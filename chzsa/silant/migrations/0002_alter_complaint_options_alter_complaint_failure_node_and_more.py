# Generated by Django 5.1 on 2024-08-27 16:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('silant', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='complaint',
            options={'verbose_name': 'Рекламация', 'verbose_name_plural': 'Рекламации'},
        ),
        migrations.AlterField(
            model_name='complaint',
            name='failure_node',
            field=models.ForeignKey(limit_choices_to={'entity_name': 'FAILURE_NODE'}, on_delete=django.db.models.deletion.CASCADE, related_name='failure_complaints', to='silant.directory', verbose_name='Узел отказа'),
        ),
        migrations.AlterField(
            model_name='complaint',
            name='recovery_method',
            field=models.ForeignKey(limit_choices_to={'entity_name': 'RECOVERY_METHOD'}, on_delete=django.db.models.deletion.CASCADE, related_name='recovery_complaints', to='silant.directory', verbose_name='Способ восстановления'),
        ),
        migrations.AlterField(
            model_name='directory',
            name='entity_name',
            field=models.CharField(choices=[('TECHNIQUE_MODEL', 'Модель техники'), ('ENGINE_MODEL', 'Модель двигателя'), ('TRANSMISSION_MODEL', 'Модель трансмиссии'), ('DRIVEN_AXLE_MODEL', 'Модель ведущего моста'), ('STEERED_AXLE_MODEL', 'Модель управляемого моста'), ('MAINTENANCE_TYPE', 'Вид ТО'), ('FAILURE_NODE', 'Узел отказа'), ('RECOVERY_METHOD', 'Способ восстановления')], max_length=50, verbose_name='Название справочника'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='driven_axle_model',
            field=models.ForeignKey(limit_choices_to={'entity_name': 'DRIVEN_AXLE_MODEL'}, on_delete=django.db.models.deletion.CASCADE, related_name='driven_axle_machines', to='silant.directory', verbose_name='Модель ведущего моста'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='engine_model',
            field=models.ForeignKey(limit_choices_to={'entity_name': 'ENGINE_MODEL'}, on_delete=django.db.models.deletion.CASCADE, related_name='engine_machines', to='silant.directory', verbose_name='Модель двигателя'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='steered_axle_model',
            field=models.ForeignKey(limit_choices_to={'entity_name': 'STEERED_AXLE_MODEL'}, on_delete=django.db.models.deletion.CASCADE, related_name='steered_axle_machines', to='silant.directory', verbose_name='Модель управляемого моста'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='technique_model',
            field=models.ForeignKey(limit_choices_to={'entity_name': 'TECHNIQUE_MODEL'}, on_delete=django.db.models.deletion.CASCADE, related_name='technique_machines', to='silant.directory', verbose_name='Модель техники'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='transmission_model',
            field=models.ForeignKey(limit_choices_to={'entity_name': 'TRANSMISSION_MODEL'}, on_delete=django.db.models.deletion.CASCADE, related_name='transmission_machines', to='silant.directory', verbose_name='Модель трансмиссии'),
        ),
        migrations.AlterField(
            model_name='maintenance',
            name='maintenance_type',
            field=models.ForeignKey(limit_choices_to={'entity_name': 'MAINTENANCE_TYPE'}, on_delete=django.db.models.deletion.CASCADE, to='silant.directory', verbose_name='Вид ТО'),
        ),
    ]
