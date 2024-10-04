from django.contrib.auth import authenticate
from django.contrib.auth.models import User, AnonymousUser, Group
from django.core.mail import send_mail
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

from .tasks import sendEmailResetPassword
from .serializers import DirectorySerializer, UserSerializer
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
        return Response({"error": "No access token provided"}, status=status.HTTP_401_UNAUTHORIZED)
    if user.groups.filter(name='Менеджер').exists():
        return 'Менеджер'
    elif user.groups.filter(name='Клиент').exists():
        return 'Клиент'
    return Response({"error": "No access token provided"}, status=status.HTTP_401_UNAUTHORIZED)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

def paginate_queryset(model, request, serializer_class, sort_field=id, **filter_params):
    page_size = request.query_params.get('page_size', 10)
    paginator = PageNumberPagination()
    paginator.page_size = page_size

    sort_order  = request.query_params.get('sortOrder', 'asc')

    if sort_order == 'desc':
        sort_field = f'-{sort_field}'

    queryset = model.objects.all()
    if filter_params:
        queryset = queryset.filter(**filter_params)
    queryset = queryset.order_by(sort_field)
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = serializer_class(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

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

@api_view(['GET', 'POST', 'PUT', 'DELETE']) # все это для справочника менеджеров
def directories(request):
    role_check = get_role_from_request(request)
    if isinstance(role_check, Response):
        return role_check
    if role_check!='Менеджер':
        return Response('Недостаточно прав!', status=status.HTTP_403_FORBIDDEN)
    if request.method=='GET':
        entity_name = request.query_params.get('entity_name', None)
        if entity_name:
            directories = Directory.objects.filter(entity_name=entity_name)
        else:
            directories = Directory.objects.all()
        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(directories, request)
        serializer = DirectorySerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
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

@api_view(['GET']) # поиск директорий для autocomplete полей
def searchdirectories(request):
    entity_name = request.query_params.get('entity_name', None)
    search_term = request.query_params.get('search', None)
    if not entity_name:
        return Response({'error': 'Entity name is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Фильтрация по entity_name
    directory_items = Directory.objects.filter(entity_name=entity_name)

    # Если передан параметр search, фильтруем по имени
    if search_term:
        directory_items = directory_items.filter(name__icontains=search_term)
    serializer = DirectorySerializer(directory_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET']) # получение списка пользователей
def users(request):
    role_check = get_role_from_request(request)
    if isinstance(role_check, Response):
        return role_check
    if role_check != 'Менеджер':
        return Response('Недостаточно прав!', status=status.HTTP_403_FORBIDDEN)

    target_groups = ['Клиент', 'Сервисная организация']
    sort_field = request.query_params.get('sortField', 'id')
    if sort_field=='group':
        sort_field='groups__name'
    return paginate_queryset(User, request, UserSerializer, sort_field=sort_field, groups__name__in=target_groups)

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