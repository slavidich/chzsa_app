from time import sleep

from celery import shared_task

@shared_task
def testcelery():
    print('start test')
    sleep(5)
    print('good test')