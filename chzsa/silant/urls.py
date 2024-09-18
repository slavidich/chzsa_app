from django.urls import path
from .models import *
from .views import *
from rest_framework_simplejwt.views import (TokenRefreshView,)

urlpatterns = [
    path('api/login', login_view, name='login'),
    path('api/token/refresh', refreshtokens, name='refreshtokens'),
    path('api/token/whoami', whoami, name='whoami'),
    path('api/directories', get_all_directory_types, name='directorytypes')
]
