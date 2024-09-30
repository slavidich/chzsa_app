from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from .models import Directory
from django.contrib.auth.models import User, Group

class DirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Directory
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    group = SerializerMethodField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'group', 'username']

    def get_group(self, obj):
        group = obj.groups.first()  # Берём первую группу
        return group.name if group else None