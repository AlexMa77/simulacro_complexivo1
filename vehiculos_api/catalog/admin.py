from django.contrib import admin
from catalog.models import Marca, Auto

@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ["id", "nombre"]
    search_fields = ["nombre"]

@admin.register(Auto)
class AutoAdmin(admin.ModelAdmin):
    list_display = ["id", "marca", "modelo", "anio", "placa", "color", "creado_en"]
    list_filter = ["marca", "anio"]
    search_fields = ["modelo", "placa", "color"]
