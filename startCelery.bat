@echo off
REM Активация виртуальной среды
call venv\scripts\activate

REM Переход в папку проекта
cd .\chzsa\

REM Запуск Celery
celery -A chzsa worker -l INFO --pool=solo