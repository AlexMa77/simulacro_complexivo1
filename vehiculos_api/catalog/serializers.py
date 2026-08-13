from rest_framework import serializers
from .models import Marca, Auto

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ["id", "nombre"]


class AutoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source="marca.nombre", read_only=True)

    class Meta:
        model = Auto
        fields = ["id", "marca", "marca_nombre", "modelo", "anio", "placa", "color", "creado_en"]
