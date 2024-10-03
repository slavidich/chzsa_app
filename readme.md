backend - django + drf + celery + redis

fronend - react + redux + router

бд - postgresql (docker). pgadmin 

wsl (ubuntu) - docker-compose(postgresql+pgadmin+redis) 

Для запуска django:
1. python -m venv venv
2. ./venv/scripts/activate
3. pip install -r ./requirements.txt
4. python ./chzsa/manage.py runserver


Фронтенд сделан с оптимизацией. Компоненты разных страниц загружаются с помощью React.lazy. Webpack собирает проект с помощью разделения чанков и treeshaking. Окончательный вес ВСЕГО проекта после оптимизации и сжатия - меньше 200кб (bundlyAnalyzer также присутствует в проекте).

Бэкенд использует postgresql и reddis, которые в свою очередь запущены в WSL с помощью docker-compose
Для оптимизации в некоторых местах запросы к БД идут через transaction.atomic.
Также дополнительно стоит PGAdmin. 
Reddis используется как брокер задач для Celery, который используется для асинхронного выполнения задач, таких как отправка письма на почту с паролем пользователю.

Аутентификация и авторизация выполнена с помощью JWT. Access токен имеет время жизни в 30 минут, Refresh токен - 30 дней. Оба токена имеют httpOnly функцию, причем refresh токен имеет path только для "/api/refresh", т.е. он отправляется только в случае обновления Access токена. Access токен же, имеет path "/", т.е. отправляется всегда.
Проект защищен, как на стороне клиента, так и на стороне сервера. Есть пользователь с правами клиента попробует зайти на страницу, к которой доступа у него нет - он увидит страницу 403. Если же пользователь смог получить доступ к этой странице (путем изменения кода js), пользователь не получит никакие данные, т.к. в этом случае уже сервер их не выдаст.

Сделаны поля типа AutoComplete, с функцией поиска с задержкой. Если пользователь будет слишком быстро вводить, дабы не отправлять слишком много запросов, будет своего рода отображение "загрузки". 
