from django.contrib import admin
from .models import *

admin.site.register(Directory)
admin.site.register(Machine)
admin.site.register(Service)
admin.site.register(Maintenance)
admin.site.register(Complaint)
