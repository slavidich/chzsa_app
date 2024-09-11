from django.urls import path
from .models import *
from .views import *

urlpatterns = [
    path('api/login', login_view, name='login')
]
