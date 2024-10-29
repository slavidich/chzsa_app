from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from .models import Directory, Service, Machine
from django.contrib.auth.models import User, Group

class DirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Directory
        fields = ['id', 'entity_name', 'name', 'description']

class SearchDirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Directory
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username']


class ServiceSerializer(serializers.ModelSerializer):
    user_first_name = serializers.SerializerMethodField()
    user_last_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'user_first_name', 'user_last_name', 'user_email', 'username']
    def get_username(self,obj):
        return obj.user.username if obj.user else None
    def get_user_first_name(self, obj):
        return obj.user.first_name if obj.user else None

    def get_user_last_name(self, obj):
        return obj.user.last_name if obj.user else None

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'serial_number', 'technique_model', 'client']