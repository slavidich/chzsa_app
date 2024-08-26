from django.db import models
from django.contrib.auth.models import User

class Directory(models.Model): # Справочники
    class EntityType(models.TextChoices):
        TECHNIQUE_MODEL = 'Модель техники'
        ENGINE_MODEL = 'Модель двигателя'
        TRANSMISSION_MODEL = 'Модель трансмиссии'
        DRIVEN_AXLE_MODEL = 'Модель ведущего моста'
        STEERED_AXLE_MODEL = 'Модель управляемого моста'
        MAINTENANCE_TYPE = 'Вид ТО'
        FAILURE_NODE = 'Узел отказа'
        RECOVERY_METHOD = 'Способ восстановления'

    entity_name = models.CharField(max_length=50, choices=EntityType.choices, verbose_name='Название справочника')
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')

    def __str__(self):
        return f"{self.entity_name}: {self.name}"

    class Meta:
        verbose_name = "Справочник"
        verbose_name_plural = "Справочники"

class Service(models.Model): # сервисная компания
    name = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')

    class Meta:
        verbose_name = "Сервисная компания"
        verbose_name_plural = "Сервисные компании"

class Machine(models.Model): # Машина
    serial_number = models.CharField(max_length=255, verbose_name='Зав. № машины')
    technique_model = models.ForeignKey(Directory, on_delete=models.CASCADE, verbose_name='Модель техники', limit_choices_to={'entity_name': Directory.EntityType.TECHNIQUE_MODEL})
    engine_model = models.ForeignKey(Directory, on_delete=models.CASCADE, verbose_name='Модель двигателя', limit_choices_to={'entity_name': Directory.EntityType.ENGINE_MODEL})
    engine_serial_number = models.CharField(max_length=255, on_delete=models.CASCADE, verbose_name='Зав. № двигателя')
    transmission_model = models.ForeignKey(Directory, on_delete=models.CASCADE, verbose_name='Модель трансмиссии', limit_choices_to={'entity_name': Directory.EntityType.TRANSMISSION_MODEL})
    transmission_serial_number = models.CharField(max_length=255, on_delete=models.CASCADE, verbose_name='Зав. № трансмиссии')
    driven_axle_model = models.ForeignKey(Directory, on_delete=models.CASCADE, verbose_name='Модель ведущего моста', limit_choices_to={'entity_name': Directory.EntityType.DRIVEN_AXLE_MODEL})
    driven_axle_serial_number = models.CharField(max_length=255, on_delete=models.CASCADE, verbose_name='Зав. № ведущего моста')
    steered_axle_model = models.ForeignKey(Directory, on_delete=models.CASCADE, verbose_name='Модель управляемого моста', limit_choices_to={'entity_name': Directory.EntityType.STEERED_AXLE_MODEL})
    steered_axle_serial_number = models.CharField(max_length=255, on_delete=models.CASCADE, verbose_name='Зав. № управляемого моста')
    delivery_contract_number = models.CharField(max_length=255, verbose_name='Договор поставки №, дата')
    shipping_date = models.DateField(verbose_name='Дата отгрузки с завода')
    cargo_receiver = models.CharField(max_length=255, verbose_name='Грузополучатель')
    delivery_address = models.TextField(verbose_name='Адрес поставки (эксплуатации)')
    equipment = models.TextField(verbose_name='Комплетакция (доп. опции)')
    client = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Клиент', related_name='machines')

    def __str__(self):
        return f"Машина: {self.serial_number}"

    class Meta:
        verbose_name = "Машина"
        verbose_name_plural = "Машины"

class Maintenance(models.Model): #ТО
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, verbose_name='Машина', related_name='maintenances')
    maintenance_type = models.ForeignKey(Directory, on_delete=models.CASCADE, verbose_name='Вид ТО', limit_choices_to={'entity_name': Directory.EntityType.MAINTENANCE_TYPE})
    maintenance_date = models.DateField(verbose_name='Дата проведения ТО')
    operating_hours = models.IntegerField(verbose_name='Наработка, м/час')
    order_number = models.CharField(max_length=255, verbose_name='№ заказ-наряда')
    order_date = models.DateField(verbose_name='Дата заказ-наряда')
    service_company = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name='Сервисная компания')

    def __str__(self):
        return f"ТО {self.machine}"

    class Meta:
        verbose_name = "ТО"
        verbose_name_plural = "ТО"

class Complaint(models.Model): # рекламация 
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, verbose_name='Машина')
    service_company = models.ForeignKey(Service, on_delete=models.CASCADE, verbose_name='Сервисная компания')
    date_refuse = models.DateField(verbose_name='Дата отказа')
    operating_hours = models.IntegerField(verbose_name='Наработка, м/час')
    failure_node = models.ForeignKey(Directory, on_delete=models.CASCADE, verbose_name='Узел отказа', limit_choices_to={'entity_name': Directory.EntityType.FAILURE_NODE})
    failure_description = models.CharField(max_length=255, verbose_name='Описание отказа')
    recovery_method = models.ForeignKey(Directory, on_delete=models.CASCADE, verbose_name='Способ восстановления', limit_choices_to={'entity_name': Directory.EntityType.RECOVERY_METHOD})
    parts_used = models.TextField(verbose_name='Используемые запасные части')
    recovery_date = models.DateField(verbose_name='Дата восстановления')
    downtime = models.CharField(max_length=255, verbose_name='Время простоя техники')
    