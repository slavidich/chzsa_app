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

class SearchUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        full_name = f'{instance.username} {instance.last_name if instance.last_name else ""} {instance.first_name[0]+"." if instance.first_name else ""}'
        representation['name'] = full_name
        return representation

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
    username = serializers.SerializerMethodField()
    technique_model = serializers.SerializerMethodField()
    class Meta:
        model = Machine
        fields = ['id', 'serial_number', 'technique_model', 'username']
    def get_username(self, obj):
        return obj.client.username
    def get_technique_model(self, obj):
        return obj.technique_model.name
class AddMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model=Machine
        fields = '__all__'