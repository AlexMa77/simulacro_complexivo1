from rest_framework import serializers
from .models import Marca, Auto, Rental


class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ["id", "nombre"]


class AutoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)
    brand = serializers.SerializerMethodField()
    plate = serializers.CharField(source="placa", read_only=True)
    daily_rate = serializers.SerializerMethodField()
    is_available = serializers.BooleanField(default=True, read_only=True)

    class Meta:
        model = Auto
        fields = ["id", "marca", "marca_nombre", "brand", "modelo", "anio", "placa", "plate", "color", "daily_rate", "is_available", "creado_en"]

    def get_brand(self, obj):
        return f"{obj.marca.nombre} {obj.modelo}"

    def get_daily_rate(self, obj):
        return 45.00



class RentalSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source="vehicle.placa", read_only=True)

    class Meta:
        model = Rental
        fields = ["id", "vehicle", "vehicle_plate", "customer_name", "total", "status", "created_at"]
