from time import sleep

from celery import shared_task
from django.core.mail import send_mail
import secrets
import string
from django.contrib.auth.models import User


@shared_task
def sendEmailResetPassword(userid, isRegistration=False):
    print('началась генерация пароля + его установка')
    characters = string.ascii_letters + string.digits
    new_password = ''.join(secrets.choice(characters) for i in range(8))
    user = User.objects.get(id=userid)
    username = user.username
    toEmail = user.email
    user.set_password(new_password)
    user.save()
    if isRegistration:
        subject = 'Добро пожаловать в SILANT!'
        message = f'Добро пожаловать, вот Ваши данные для входа в личный кабинет:\n' \
                  f'Логин: {username} \n' \
                  f'Пароль: {new_password}'
    else:
        subject = 'Сброс пароля в SILANT'
        message = f'Вы запросили обновление пароля, {username} \n' \
                  f'Ваш новый пароль: {new_password}'
    print('пароль установлен,начинаем отправлять почту')
    sleep(5)#симуляция отправки почты


    send_mail(subject=subject,
              message=message,
              from_email=None,
              recipient_list=[toEmail])
    print('письмо отправилось')