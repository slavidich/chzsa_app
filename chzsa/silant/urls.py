from django.urls import path
from .models import *
from .views import *
from rest_framework_simplejwt.views import (TokenRefreshView,)

urlpatterns = [
    path('api/login', login_view, name='login'),
    path('api/token/refresh', refreshtokens, name='refreshtokens'),
    path('api/token/whoami', whoami, name='whoami'),
    path('api/directories', directories, name='directories'),
    path('api/searchdirectories',searchdirectories, name='searchdirectories' ),
    path('api/users', users, name='users'),
    path('api/refreshpassword', updatePassword, name='updatePassword'),
    path('api/services', services, name='services'),
    path('api/refreshpasswordusername', updatePasswordUsername, name='updatePasswordUsername')
]
