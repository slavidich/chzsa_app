from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from chzsa import settings


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

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
    user = request.user
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

@api_view(['POST'])
def logout_view(request):
    print('test')

