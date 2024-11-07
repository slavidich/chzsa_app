from django.contrib.auth import authenticate
from django.contrib.auth.models import User, AnonymousUser, Group
from django.core.mail import send_mail
from django.core.paginator import Paginator
from django.db.models.functions import Concat, Left
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.db import transaction
from django.db.models import Q, CharField, F
from django.db.models import Value
from .tasks import sendEmailResetPassword
from .serializers import *
from .models import *

from chzsa import settings

def get_user_from_request(request):
    jwt_auth = JWTAuthentication()
    try:
        token = request.COOKIES.get('access_token')
        if not token:
            return AnonymousUser()
        validated_token = jwt_auth.get_validated_token(token)
        user = jwt_auth.get_user(validated_token)
        return user
    except InvalidToken:
        return AnonymousUser()

def get_role_from_request(request):
    user = get_user_from_request(request)
    if isinstance(user, AnonymousUser):
        return 'Anon'
    groups = ['Менеджер', 'Клиент', 'Сервисная организация']
    group = user.groups.filter(name__in=groups).first()
    if group:
        return group.name
    else:
        return get401()

def get_item_by_id(request, model, serializer, id):
    item = model.objects.filter(id=id).first()
    if not item:
        return get404()
    serialized_item = serializer(item)
    return Response(serialized_item.data, status=status.HTTP_200_OK)
def get404():
    return Response('Не найдено', status=status.HTTP_404_NOT_FOUND)
def get403():
    return Response('Недостаточно прав!', status=status.HTTP_403_FORBIDDEN)
def get401():
    return Response('Токен авторизации не найден!', status=status.HTTP_401_UNAUTHORIZED)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

def paginate_queryset(model, request, serializer_class, sort_field='id', search_field=None, isService=False, service_id=0, **filter_params):
    page_size = request.query_params.get('page_size', 10)
    paginator = PageNumberPagination()
    paginator.page_size = page_size

    sort_order  = request.query_params.get('sortOrder', 'asc')
    search_value = request.query_params.get('searchValue', None)

    if sort_order == 'desc':
        sort_field = f'-{sort_field}'
    if isService:
        if model==Machine:
            queryset = Machine.objects.filter(
                Q(maintenances__service_company_id=service_id) |
                Q(complaints__service_company_id=service_id)  # фильтруем по сервисной организации
            ).distinct().annotate(  # исключаем дубли и создаем аннотацию
                search_string=Concat(
                    F(f'client__last_name'),
                    Value(' '),
                    Left(F(f'client__first_name'), 1),
                    Value('. ('),
                    F(f'client__username'),
                    Value(')')
                )
            )
    else:
        queryset = model.objects.all()
    if filter_params:
        queryset = queryset.filter(**filter_params)

    if search_field and search_value:
        search_filter = {f"{search_field}__icontains": search_value}
        queryset = queryset.filter(Q(**search_filter))

    queryset = queryset.order_by(sort_field)

    django_paginator = Paginator(queryset, page_size)
    total_pages = django_paginator.num_pages

    result_page = paginator.paginate_queryset(queryset, request)
    serializer = serializer_class(result_page, many=True)
    response_data = {
        'count': paginator.page.paginator.count,
        'results': serializer.data,
        'last_page':total_pages
    }
    return Response(response_data)
    #return paginator.get_paginated_response(serializer.data)


def paginate_client_queryset(model, request, serializer_class, user='user', sort_field='id', page_size=10, isService=False, service_id=0):
    page_size = request.query_params.get('page_size', page_size)
    paginator = PageNumberPagination()
    paginator.page_size = page_size

    sort_order = request.query_params.get('sortOrder', 'asc')
    search_value = request.query_params.get('searchValue', None)
    if isService:
        service = Service.objects.get(id=service_id)
        queryset = Machine.objects.filter(Q(maintenances__service_company_id=service_id)|
                                          Q(complaints__service_company_id=service_id)
              # фильтруем по сервисной организации
        ).distinct().annotate(  # исключаем дубли и создаем аннотацию
            search_string=Concat(
                F(f'{user}__last_name'),
                Value(' '),
                Left(F(f'{user}__first_name'), 1),
                Value('. ('),
                F(f'{user}__username'),
                Value(')')
            )
        )
    else:
        queryset = Machine.objects.annotate(
            search_string=Concat(
                F(f'{user}__last_name'),
                Value(' '),
                Left(F(f'{user}__first_name'), 1),
                Value('. ('),
                F(f'{user}__username'),
                Value(')')
            )
        )
    if sort_order == 'desc':
        sort_field = f'-{sort_field}'

    if sort_field=='id':
        queryset = queryset.order_by(sort_order)
    else:
        if sort_order=='asc':
            queryset = queryset.order_by('search_string')
        else:
            queryset = queryset.order_by('-search_string')

    if search_value:
        queryset = queryset.filter(Q(search_string__icontains=search_value))

    django_paginator = Paginator(queryset, page_size)
    total_pages = django_paginator.num_pages

    result_page = paginator.paginate_queryset(queryset, request)

    serializer = serializer_class(result_page, many=True)
    response_data = {
        'count': paginator.page.paginator.count,
        'results': serializer.data,
        'last_page': total_pages
    }

    return Response(response_data)

def paginate_service_queryset(model, request, serializer_class, service='service_company', sort_field='id', page_size=10 ):
    page_size = request.query_params.get('page_size', page_size)
    paginator = PageNumberPagination()
    paginator.page_size = page_size

    sort_order = request.query_params.get('sortOrder', 'asc')
    search_value = request.query_params.get('searchValue', None)

    queryset = model.objects.annotate(
        search_string=Concat(
            F(f'{service}__name'),
            Value(' ('),
            F(f'{service}__user__username'),
            Value(')')
        )
    )
    if sort_order == 'desc':
        sort_field = f'-{sort_field}'
    if sort_field=='id':
        queryset = queryset.order_by(sort_field)
    else:
        if sort_order=='asc':
            queryset = queryset.order_by('search_string')
        else:
            queryset = queryset.order_by('-search_string')
    if search_value:
        queryset = queryset.filter(Q(search_string__icontains=search_value))
    django_paginator = Paginator(queryset, page_size)
    total_pages = django_paginator.num_pages

    result_page = paginator.paginate_queryset(queryset, request)

    serializer = serializer_class(result_page, many=True)
    response_data = {
        'count': paginator.page.paginator.count,
        'results': serializer.data,
        'last_page': total_pages
    }
    return Response(response_data)



@api_view(['POST'])
def refreshtokens(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        return Response({"error": "Invalid token and no refresh token provided"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        refresh = RefreshToken(refresh_token)
        if refresh.check_exp():
            return Response({"error": "Refresh token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = refresh.payload['user_id']
        user = User.objects.get(id=user_id)
        new_refresh_token = RefreshToken.for_user(user)
        new_access_token = new_refresh_token.access_token
        group = user.groups.all()[0]
        response = Response({
            "username": user.username,
            'role': str(group)
        })
        response.set_cookie('access_token', new_access_token, httponly=True, max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
        response.set_cookie('refresh_token', new_refresh_token, path='/api/token/refresh', httponly=True, max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
        return response
    except TokenError:
        return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def whoami(request):
    access_token = request.COOKIES.get('access_token')
    if not access_token:
        return Response({"error": "No access token provided"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        token = AccessToken(access_token)
        user_id = token.payload['user_id']
        user = User.objects.get(id=user_id)
        group = user.groups.all()[0]
        return Response({
            "username": user.username,
            'role': str(group)
        })
    except TokenError:
        return Response({"error":"Update your access token"}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if username is None or password is None:
        return Response({'error': 'Введите и имя пользователя, и пароль'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Неверные имя пользователя или пароль'}, status=status.HTTP_401_UNAUTHORIZED)
    group = user.groups.all()[0]
    if user is not None:
        tokens = get_tokens_for_user(user)
        response = JsonResponse({
            'username': user.username,
            'role': str(group)
        })
        response.set_cookie(
            key='access_token',
            value=tokens['access'],
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            httponly = True,
            secure=True,
            samesite='Lax',
            path='/'
        )
        response.set_cookie(
            key='refresh_token',
            value=tokens['refresh'],
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
            httponly = True,
            secure=True,
            samesite='Lax',
            path='/api/token/refresh'
        )
        return response
    else:
        return Response({'error': 'Неверные имя пользователя или пароль'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout(request):
    response = JsonResponse({'message': 'Logged out successfully'})
    response.delete_cookie('access_token', path='/', domain='127.0.0.1')
    response.delete_cookie('refresh_token', path='/api/token', domain='127.0.0.1')
    return response

@api_view(['GET', 'POST', 'PUT', 'DELETE']) # все это для справочника менеджеров
def directories(request):
    role_check = get_role_from_request(request)
    if role_check!='Менеджер':
        return get403()
    if request.method=='GET':
        entity_name = request.query_params.get('entity_name', None)
        sort_field = request.query_params.get('sortField', 'id')
        search_field = request.query_params.get('searchField', None)
        return paginate_queryset(Directory, request, DirectorySerializer, sort_field=sort_field,search_field=search_field, entity_name=entity_name)
    elif request.method=='POST':
        serializer = DirectorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # тут сохранение происходит
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='PUT':
        data = request.data
        directory_id = data.get('id')
        directory = get_object_or_404(Directory, id=directory_id)
        serializer = DirectorySerializer(directory, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        data = request.data
        directory_id = request.query_params.get('id')
        try:
            Directory.objects.get(id=directory_id).delete()
            return Response(f'Справочник с ID={directory_id} был успешно удален', status=status.HTTP_200_OK)
        except:
            return Response('Справочник с ID не найден', status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_directory(request, id):
    role_check = get_role_from_request(request)
    return get_item_by_id(request, Directory, DirectorySerializer, id)

@api_view(['GET']) # поиск для ВСЕГО autocomplete полей
def searchdata(request):
    role_check = get_role_from_request(request)
    if role_check == 'Anon':
        return get403()

    model = request.query_params.get('model')
    if model=='directory':
        entity_name = request.query_params.get('entity_name', None)
        search_term = request.query_params.get('search', None)
        if not entity_name:
            return Response({'error': 'Entity name is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Фильтрация по entity_name
        directory_items = Directory.objects.filter(entity_name=entity_name)

        # Если передан параметр search, фильтруем по имени
        if search_term:
            directory_items = directory_items.filter(name__icontains=search_term)
        serializer = SearchDirectorySerializer(directory_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif model=='client':
        search_term = request.query_params.get('search', None)
        #users = User.objects.filter(Q(username__contains='client')&(Q(username__contains=search_term)|Q(first_name__contains=search_term)|Q(last_name__contains=search_term))).order_by('id')
        users = User.objects.annotate(
            search_string=Concat(
                'last_name',
                Value(' '),
                Left('first_name', 1),
                Value('. ('),
                'username',
                Value(')')
            )
        ).filter(Q(search_string__icontains=search_term)&Q(username__contains='client')).order_by('id')
        serializer = SearchUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif model=='machine': # поиск по зав. №
        role_check = get_role_from_request(request)
        client = get_user_from_request(request)
        search_term = request.query_params.get('search', None)
        if role_check=='Клиент':
            machines = Machine.objects.filter(Q(serial_number__contains=search_term)&Q(client=client)).order_by('id')
        else:
            machines = Machine.objects.filter(serial_number__contains=search_term).order_by('id')
        serializer = SearchMachinerSerializer(machines, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif model=='service':
        role_check = get_role_from_request(request)
        search_term = request.query_params.get('search', None)
        if role_check=='Клиент':
            services = Service.objects.filter(name__contains=search_term).order_by('id')
            serializer = SearchServiceForClientSerializer(services, many=True)
        else:
            services = Service.objects.annotate(
                search_string=Concat(
                    'name',
                    Value(' ('),
                    'user__username',
                    Value(')')
                )
            ).filter(Q(search_string__icontains=search_term)&Q(user__username__contains='service')).order_by('id')
            serializer = SearchServiceSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST', 'PUT']) # api/users
def users(request):
    role_check = get_role_from_request(request)
    if role_check != 'Менеджер':
        return get403()
    if request.method == 'GET':
        target_groups = ['Клиент']
        sort_field = request.query_params.get('sortField', 'id')
        search_field = request.query_params.get('searchField', None)
        return paginate_queryset(User, request, UserSerializer, sort_field=sort_field, search_field=search_field, groups__name__in=target_groups)
    elif request.method=='POST':
        data = request.data
        firstName = data.get('first_name')
        lastName = data.get('last_name')
        email = data.get('email')
        try:
            lastuser = User.objects.filter(username__startswith='client').order_by('id').last()
            lastusernumber = lastuser.username.replace('client', '')
            user = User.objects.create(username=f'client{int(lastusernumber) + 1}', first_name=firstName,
                                       last_name=lastName, email=email)
            client_group = Group.objects.get(name='Клиент')
            user.groups.add(client_group)
            sendEmailResetPassword.delay(user.id, isRegistration=True)  # celery таска !!!
        except:
            return Response('', status=status.HTTP_400_BAD_REQUEST)
        return Response('', status=status.HTTP_201_CREATED)
    elif request.method=='PUT':
        try:
            data = request.data
            username = data.get('username')
            user = get_object_or_404(User, username=username)
            serializer = UserSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response('', status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_user_id(request, id):
    role_check = get_role_from_request(request)
    if role_check!= 'Менеджер':
        return get403()
    return get_item_by_id(request, User, UserSerializer, id)

@api_view(['POST'])
def updatePassword(request):
    role_check = get_role_from_request(request)
    if role_check != 'Менеджер':
        return get403()
    data = request.data
    userid = data.get('id')
    if not userid:
        username = data.get('username')
        user = User.objects.get(username=username)
        sendEmailResetPassword.delay(user.id)
        return Response('', status=status.HTTP_200_OK)
    sendEmailResetPassword.delay(userid)
    return Response('', status=status.HTTP_200_OK)

@api_view(['GET', 'POST', 'PUT']) # api/services
def services(request):
    role_check = get_role_from_request(request)
    if role_check != 'Менеджер':
        return Response('Недостаточно прав!', status=status.HTTP_403_FORBIDDEN)
    if request.method == 'GET':
        sort_field = request.query_params.get('sortField', 'id')
        if sort_field == 'username':
            sort_field = 'user__username'
        elif sort_field == 'user_first_name':
            sort_field = 'user__first_name'
        elif sort_field == 'user_last_name':
            sort_field = 'user__last_name'
        elif sort_field == 'user_email':
            sort_field = 'user__email'
        search_field = request.query_params.get('searchField', None)
        if search_field == 'username':
            search_field = 'user__username'
        elif search_field == 'user_first_name':
            search_field = 'user__first_name'
        elif search_field == 'user_last_name':
            search_field = 'user__last_name'
        elif search_field == 'user_email':
            search_field = 'user__email'
        return paginate_queryset(Service, request, ServiceSerializer, search_field=search_field, sort_field=sort_field)
    elif request.method=='POST':
        data = request.data
        firstName = data.get('user_first_name')
        lastName = data.get('user_last_name')
        email = data.get('user_email')
        try:
            lastuser = User.objects.filter(username__startswith='service').order_by('id').last()
            lastusernumber = lastuser.username.replace('service', '') or '0'
            user = User.objects.create(username=f'service{int(lastusernumber) + 1}', first_name=firstName,
                                       last_name=lastName, email=email)
            service_group = Group.objects.get(name='Сервисная организация')
            user.groups.add(service_group)
            sendEmailResetPassword.delay(user.id, isRegistration=True)  # celery таска !!!
            Service.objects.create(user=user, name=data.get('name'), description=data.get('description'))
        except :
            return Response('', status=status.HTTP_400_BAD_REQUEST)
        return Response('ok', status=status.HTTP_201_CREATED)
    elif request.method=='PUT':
        try:
            data = request.data
            firstName = data.get('user_first_name')
            lastName = data.get('user_last_name')
            email = data.get('user_email')
            name = data.get('name')
            description = data.get('description')
            username = data.get('username')
            user = User.objects.get(username=username)
            # Обновление пользователя
            user = User.objects.get(username=username)
            user.first_name = firstName
            user.last_name = lastName
            user.email = email
            user.save()
            # Обновление сервиса
            service = Service.objects.get(user=user)
            service.name = name
            service.description = description
            service.save()
            return Response('', status=status.HTTP_200_OK)
        except:
            return Response('', status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_service_id(request, id):
    role_check = get_role_from_request(request)
    return get_item_by_id(request, Service, ServiceSerializer, id)

    #return Response('', status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'PUT'])
def cars(request):
    role_check = get_role_from_request(request)
    if request.method == 'GET':
        field_mapping = {
            # вот тут надо придумать какой то sort_field для username, который состоит из
            'username': 'client__username',
            'technique_model': 'technique_model__name',
            'engine_model': 'engine_model__name',
            'transmission_model': 'transmission_model__name',
            'driven_axle_model': 'driven_axle_model__name',
            'steered_axle_model': 'steered_axle_model__name'
        }
        sort_field = request.query_params.get('sortField', 'id')
        sort_field = field_mapping.get(sort_field, sort_field)

        search_field = request.query_params.get('searchField', None)
        search_field = field_mapping.get(search_field, search_field)
        if role_check=='Менеджер':
            if sort_field=='client__username' or search_field=='client__username': # это если сортировка
                return paginate_client_queryset(model=Machine, request=request, serializer_class=MachineSerializer, sort_field='client__username', user='client')
            return paginate_queryset(Machine, request, MachineSerializer, search_field=search_field, sort_field=sort_field)
        elif role_check=='Сервисная организация':
            service = Service.objects.get(user=get_user_from_request(request))
            if sort_field == 'client__username' or search_field == 'client__username':  # это если сортировка
                return paginate_client_queryset(Machine, request, MachineSerializer, sort_field=sort_field, user='client', isService=True, service_id=service.id)
            return paginate_queryset(Machine, request, MachineSerializer, search_field=search_field,
                                     sort_field=sort_field, isService=True, service_id=service.id)
        elif role_check=='Клиент':
            client = get_user_from_request(request)
            return paginate_queryset(Machine, request, MachineSerializer, search_field=search_field,
                                     sort_field=sort_field, client=client)
        elif role_check=='Anon':
            machine = get_object_or_404(Machine, serial_number=request.query_params['serial_number'])
            print(request.query_params['serial_number'])
            print(machine)
            return get_item_by_id(request, Machine, MachineViewAnonSerializer, machine.id)

        else: return get403()
    elif request.method=='POST':
        if role_check=='Менеджер':
            serial_number = request.data.get('serial_number')
            error_machine = Machine.objects.all().filter(serial_number=serial_number)
            if error_machine:
                return Response('Машина с данным зав. № уже существует! Выберите другой зав. №!',
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = AddMachineSerializer(data=request.data)
            if serializer.is_valid():
                machine = serializer.save()
                return Response('Машина добавлена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else: return get403()
    elif request.method == 'PUT':
        if role_check == 'Менеджер':
            machine_id = request.data.get('id')
            machine = get_object_or_404(Machine, id=machine_id)
            serial_number = request.data.get('serial_number')
            error_machine = Machine.objects.all().filter(serial_number=serial_number)
            if error_machine and error_machine[0].id!=int(machine_id):
                return Response('Машина с данным зав. № уже существует! Выберите другой зав. №!', status=status.HTTP_400_BAD_REQUEST)
            serializer = AddMachineSerializer(machine, data=request.data, partial=True)
            if serializer.is_valid():
                machine = serializer.save()
                return Response('Машина изменена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else: return get403()

@api_view(['GET'])
def get_car_id(request, id):
    role_check = get_role_from_request(request)
    if role_check=='Менеджер':
        return get_item_by_id(request, Machine, MachineViewSerializer, id)
    elif role_check=='Сервисная организация':
        service = Service.objects.get(user=get_user_from_request(request))
        machines_id = list(Machine.objects.filter(maintenances__service_company_id=service.id).values_list('id', flat=True))
        machines_id2 = list(Machine.objects.filter(complaints__service_company_id=service.id).values_list('id', flat=True))
        if id in machines_id or id in machines_id2:
            return get_item_by_id(request, Machine, MachineViewSerializer, id)
        else:
            return get403()
    elif role_check=='Клиент':
        client = get_user_from_request(request)
        machines_id = list(Machine.objects.filter(client=client).values_list('id', flat=True))
        if id in machines_id:
            return get_item_by_id(request, Machine, MachineViewSerializer, id)
        else:
            return get403()

@api_view(['GET', 'POST', 'PUT'])
def allto(request):
    role_check = get_role_from_request(request)
    field_mapping = {
        'machine': 'machine__serial_number',
        'service_company': 'service_company__name',
        'maintenance_type': 'maintenance_type__name',
        'maintenance_date': 'maintenance_date',
        'operating_hours': 'operating_hours',
        'order_number': 'order_number',
        'order_date':'order_date',
    }
    if request.method == 'GET':
        sort_field = request.query_params.get('sortField', 'id')
        sort_field = field_mapping.get(sort_field, sort_field)

        search_field = request.query_params.get('searchField', None)
        search_field = field_mapping.get(search_field, search_field)
        if role_check == 'Менеджер':
            if search_field=='service_company__name':
                return paginate_service_queryset(Maintenance, request, AllToSerializer, sort_field=sort_field)
            return paginate_queryset(Maintenance, request, AllToSerializer, search_field=search_field, sort_field=sort_field)
        elif role_check=='Сервисная организация':
            service = Service.objects.get(user=get_user_from_request(request))
            return paginate_queryset(Maintenance, request, AllToSerializer, search_field=search_field,
                                     sort_field=sort_field, service_company=service)
        elif role_check=='Клиент':
            client = get_user_from_request(request)
            return paginate_queryset(Maintenance, request, AllToSerializerForClients, search_field=search_field,
                                     sort_field=sort_field, machine__client=client)
        else: get403()
    if request.method=='POST':
        if role_check=='Менеджер':
            serializer = AddToSerializer(data=request.data)
            if serializer.is_valid():
                to = serializer.save()
                return Response('ТО добавлено', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif role_check=='Сервисная организация':
            service = Service.objects.get(user=get_user_from_request(request))
            request.data['service_company'] = service.id
            serializer = AddToSerializer(data=request.data)
            if serializer.is_valid():
                to = serializer.save()
                return Response('ТО добавлено', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif role_check=='Клиент':
            serializer = AddToSerializer(data=request.data)
            if serializer.is_valid():
                to = serializer.save()
                return Response('ТО добавлено', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else: get403()
    if request.method=='PUT':
        if role_check=='Менеджер':
            to_id = request.data.get('id')
            to = get_object_or_404(Maintenance, id=to_id)
            serializer = AddToSerializer(to, data=request.data, partial=True)
            if serializer.is_valid():
                to = serializer.save()
                return Response('Машина изменена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif role_check=='Сервисная организация':
            to_id = request.data.get('id')
            to = get_object_or_404(Maintenance, id=to_id)
            service = Service.objects.get(user=get_user_from_request(request))
            request.data['service_company'] = service.id
            serializer = AddToSerializer(to, data=request.data, partial=True)
            if serializer.is_valid():
                to = serializer.save()
                return Response('Машина изменена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif role_check=='Клиент':
            to_id = request.data.get('id')
            to = get_object_or_404(Maintenance, id=to_id)
            serializer = AddToSerializer(to, data=request.data, partial=True)
            if serializer.is_valid():
                to = serializer.save()
                return Response('Машина изменена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:return  get403()

@api_view(['GET'])
def get_to_id(request, id):
    role_check = get_role_from_request(request)
    if role_check=='Менеджер':
        return get_item_by_id(request, Maintenance, ToViewSerializer, id)
    elif role_check=='Сервисная организация':
        service = Service.objects.get(user=get_user_from_request(request))
        maintenance = Maintenance.objects.get(id=id)
        if maintenance.service_company==service:
            return get_item_by_id(request, Maintenance, ToViewSerializer, id)
        else: return get403()
    elif role_check=='Клиент':
        client = get_user_from_request(request)
        maintenance = Maintenance.objects.get(id=id)
        if maintenance.machine.client==client:
            return get_item_by_id(request, Maintenance, ToViewClientSerializer, id)
        else: return get403()

@api_view(['GET', 'POST', 'PUT'])
def complaints(request):
    role_check = get_role_from_request(request)
    field_mapping = {
        'machine': 'machine__serial_number',
        'service_company': 'service_company__name',
        'failure_node': 'failure_node__name',
        'recovery_method': 'recovery_method__name'
    }
    if request.method == 'GET':
        sort_field = request.query_params.get('sortField', 'id')
        sort_field = field_mapping.get(sort_field, sort_field)

        search_field = request.query_params.get('searchField', None)
        search_field = field_mapping.get(search_field, search_field)
        if role_check=='Менеджер':
            if search_field == 'service_company__name':
                return paginate_service_queryset(Complaint, request, GetAllComplaints, sort_field=sort_field)
            return paginate_queryset(Complaint, request, GetAllComplaints, search_field=search_field,
                                     sort_field=sort_field)
        elif role_check=='Сервисная организация':
            service=Service.objects.get(user=get_user_from_request(request))
            return paginate_queryset(Complaint, request, GetAllComplaints, search_field=search_field,
                                     sort_field=sort_field, service_company=service)
        elif role_check=='Клиент':
            client = get_user_from_request(request)
            return paginate_queryset(Complaint, request, GetAllComplaintsForClient, search_field=search_field,
                                     sort_field=sort_field, machine__client=client)
        else: get403()
    if request.method=='POST':
        if role_check=='Менеджер':
            serializer = PostComplaint(data=request.data)
            if serializer.is_valid():
                complaint = serializer.save()
                return Response('Рекламация добавлена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif role_check=='Сервисная организация':
            service = Service.objects.get(user=get_user_from_request(request))
            request.data['service_company'] = service.id
            serializer = PostComplaint(data=request.data)
            if serializer.is_valid():
                complaint = serializer.save()
                return Response('Рекламация добавлена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else: get403()
    if request.method=='PUT':
        if role_check=='Менеджер':
            complaint_id = request.data.get('id')
            compaint = get_object_or_404(Complaint, id=complaint_id)
            serializer = PostComplaint(compaint, data=request.data, partial=True)
            if serializer.is_valid():
                complaint = serializer.save()
                return Response('Рекламация изменена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif role_check=='Сервисная организация':
            complaint_id = request.data.get('id')
            compaint = get_object_or_404(Complaint, id=complaint_id)
            service = Service.objects.get(user=get_user_from_request(request))
            request.data['service_company'] = service.id
            serializer = PostComplaint(compaint, data=request.data, partial=True)
            if serializer.is_valid():
                complaint = serializer.save()
                return Response('Рекламация изменена', status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_complaint_id(request, id):
    role_check = get_role_from_request(request)
    if role_check=='Менеджер':
        return get_item_by_id(request, Complaint, GetFullComplaint, id)
    elif role_check=='Сервисная организация':
        service = Service.objects.get(user=get_user_from_request(request))
        complaint = get_object_or_404(Complaint, id=id)
        if complaint.service_company==service:
            return get_item_by_id(request, Complaint, GetFullComplaint, id)
        else: return get403()
    elif role_check=='Клиент':
        client = get_user_from_request(request)
        complaint = get_object_or_404(Complaint, id=id)
        if complaint.machine.client==client:
            return get_item_by_id(request, Complaint, GetFullComplaintForClient, id)
        else: return get403()
    else:  return get403()
@api_view(['POST'])
def create_user(request):
    role_check = get_role_from_request(request)
    if isinstance(role_check, Response):
        return role_check
    if role_check != 'Менеджер':
        return Response('Недостаточно прав!', status=status.HTTP_403_FORBIDDEN)
    data = request.data
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    type = data.get('userType')
    if type=='client':
        print('client')
        lastuser=User.objects.filter(username__startswith='client').order_by('id').last()
        lastusernumber = lastuser.username.replace('client','')
        user = User.objects.create(username=f'client{int(lastusernumber)+1}', first_name=firstName, last_name=lastName, email=email)
        client_group= Group.objects.get(name='Клиент')
        user.groups.add(client_group)
        sendEmailResetPassword.delay(user.username, user.email, isRegistration=True)  # celery таска !!!
    elif type=='service':
        lastservice = User.objects.filter(username__startswith='service').order_by('id').last()
        if lastservice:
            lastservicenumber = lastservice.username.replace('service', '')
            user = User.objects.create(username=f'service{int(lastservicenumber) + 1}', first_name=firstName,
                                       last_name=lastName, email=email)
        else:
            user = User.objects.create(username=f'service1', first_name=firstName,
                                       last_name=lastName, email=email)
        sendEmailResetPassword.delay(user.username, user.email, isRegistration=True)  # celery таска !!!
        service_group = Group.objects.get(name='Сервисная организация')
        user.groups.add(service_group)
        Service.objects.create(name=data.get('organization'), description=data.get('description'),
                               user=user)
    return Response('', status=status.HTTP_201_CREATED)