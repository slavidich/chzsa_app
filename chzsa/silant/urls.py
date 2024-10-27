from django.urls import path
from .models import *
from .views import *
from rest_framework_simplejwt.views import (TokenRefreshView,)

urlpatterns = [
    path('api/login', login_view, name='login'),
    path('api/token/refresh', refreshtokens, name='refreshtokens'),
    path('api/token/whoami', whoami, name='whoami'),

    path('api/directories', directories, name='directories'),
    path('api/directories/<int:id>', get_directory, name='get_directory'),

    path('api/users', users, name='users'),
    path('api/users/<int:id>', get_user_id, name='get_user'),

    path('api/services', services, name='services'),
    path('api/services/<int:id>', get_service_id, name='services'),

    path('api/cars', cars, name='cars'),

    path('api/search',searchdata, name='search' ),

    path('api/refreshpassword', updatePassword, name='updatePassword'),
]
