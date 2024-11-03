# Generated by Django 5.1 on 2024-11-03 09:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('silant', '0004_service_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='machine',
            name='equipment',
            field=models.TextField(blank=True, null=True, verbose_name='Комплетакция (доп. опции)'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='serial_number',
            field=models.CharField(max_length=255, unique=True, verbose_name='Зав. № машины'),
        ),
    ]
