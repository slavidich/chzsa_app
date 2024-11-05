from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from .models import Directory, Service, Machine, Maintenance, Complaint
from django.contrib.auth.models import User, Group

##### сериализаторы для переходов внутри просмотра итд
class MachineSimple(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = Machine
        fields = ['id', 'serial_number', 'name']

    def get_name(self, obj):
        return obj.serial_number

class DirectorySimple(serializers.ModelSerializer):
    class Meta:
        model = Directory
        fields = ['id', 'name']

class ServiceSimple(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['name'] = f'{instance.name} ({instance.user.username})'
        return representation
#####
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
        full_name = f'{instance.last_name} {instance.first_name[:1]}. ({instance.username})'
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
    engine_model= serializers.SerializerMethodField()
    transmission_model= serializers.SerializerMethodField()
    driven_axle_model= serializers.SerializerMethodField()
    steered_axle_model= serializers.SerializerMethodField()
    class Meta:
        model = Machine
        fields = ['id', 'serial_number', 'technique_model','engine_model','transmission_model','driven_axle_model','steered_axle_model', 'username', 'shipping_date']
    def get_username(self, obj):
        return f'{obj.client.last_name} {obj.client.first_name[:1]}. ({obj.client.username})'
    def get_technique_model(self, obj):
        return obj.technique_model.name
    def get_engine_model(self, obj):
        return obj.engine_model.name
    def get_transmission_model(self, obj):
        return obj.transmission_model.name
    def get_driven_axle_model(self, obj):
        return obj.driven_axle_model.name
    def get_steered_axle_model(self, obj):
        return obj.steered_axle_model.name

class AddMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model=Machine
        fields = '__all__'

class UserForMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']
class MachineViewSerializer(serializers.ModelSerializer):
    client = SearchUserSerializer()
    class Meta:
        depth = 1
        model = Machine
        fields = [
            'id',
            'serial_number',
            'technique_model',
            'engine_model',
            'engine_serial_number',
            'transmission_model',
            'transmission_serial_number',
            'driven_axle_model',
            'driven_axle_serial_number',
            'steered_axle_model',
            'steered_axle_serial_number',
            'delivery_contract_number',
            'shipping_date',
            'cargo_receiver',
            'delivery_address',
            'equipment',
            'client',
        ]

class SearchMachinerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'serial_number']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['name'] = instance.serial_number
        return representation

class SearchServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['name'] = f'{instance.name} ({instance.user.username})'
        return representation

class AddToSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields=['id', 'machine', 'service_company', 'maintenance_type', 'maintenance_date', 'order_date','order_number', 'operating_hours' ]

class AllToSerializer(serializers.ModelSerializer):
    machine = serializers.SerializerMethodField()
    service_company = serializers.SerializerMethodField()
    maintenance_type = serializers.SerializerMethodField()
    class Meta:
        model = Maintenance
        fields=['id', 'machine', 'service_company', 'maintenance_type', 'maintenance_date', 'order_date','order_number', 'operating_hours' ]

    def get_machine(self, obj):
        return obj.machine.serial_number
    def get_service_company(self, obj):
        return f'{obj.service_company.name} ({obj.service_company.user.username})'
    def get_maintenance_type(self, obj):
        return obj.maintenance_type.name

class ToViewSerializer(serializers.ModelSerializer):
    machine = serializers.SerializerMethodField()
    service_company = serializers.SerializerMethodField()
    class Meta:
        depth = 1
        model = Maintenance
        fields = ['id', 'machine', 'service_company', 'maintenance_type', 'maintenance_date', 'order_date','order_number', 'operating_hours' ]
    def get_machine(self, obj):
        return {"id": obj.machine.id,
                "name": obj.machine.serial_number}
    def get_service_company(self, obj):
        return {"id": obj.service_company.id,
                "name": f'{obj.service_company.name} ({obj.service_company.user.username})'}

class GetAllComplaints(serializers.ModelSerializer):
    machine = serializers.SerializerMethodField()
    service_company = serializers.SerializerMethodField()
    failure_node = serializers.SerializerMethodField()
    recovery_method = serializers.SerializerMethodField()
    class Meta:
        model = Complaint
        fields = ['id', 'machine', 'service_company', 'date_refuse', 'failure_node', 'recovery_method', 'recovery_date']

    def get_machine(self, obj):
        return obj.machine.serial_number
    def get_service_company(self, obj):
        return f'{obj.service_company.name} ({obj.service_company.user.username})'
    def get_failure_node(self, obj):
        return obj.failure_node.name
    def get_recovery_method(self, obj):
        return obj.recovery_method.name

class PostComplaint(serializers.ModelSerializer):
    class Meta:
        model=Complaint
        fields='__all__'

class GetFullComplaint(serializers.ModelSerializer):
    machine = MachineSimple()
    service_company = ServiceSimple()
    failure_node = DirectorySimple()
    recovery_method = DirectorySimple()
    class Meta:
        model = Complaint
        fields=['id', 'machine', 'service_company', 'date_refuse', 'operating_hours', 'failure_node', 'failure_description', 'recovery_method','parts_used', 'recovery_date', 'downtime']


