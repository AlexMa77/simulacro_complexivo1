from django.contrib import admin

from catalog.models import Marca, Auto, Rental

@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ["id", "nombre"]
    search_fields = ["nombre"]

@admin.register(Auto)
class AutoAdmin(admin.ModelAdmin):
    list_display = ["id", "marca", "modelo", "anio", "placa", "color", "creado_en"]
    list_filter = ["marca", "anio"]
    search_fields = ["modelo", "placa", "color"]


@admin.register(Rental)
class RentalAdmin(admin.ModelAdmin):
    list_display = ["id", "vehicle", "customer_name", "total", "status", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["customer_name"]
