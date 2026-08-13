from rest_framework import serializers


class ServiceTypeSerializer(serializers.Serializer):
    """
    Schema para la colección service_types en MongoDB.
    Define los tipos de servicio disponibles para autos/vehículos.
    """
    name = serializers.CharField(max_length=120)
    description = serializers.CharField(required=False, allow_blank=True)
    base_price = serializers.FloatField(required=False)
    is_active = serializers.BooleanField(default=True)


class AutoServiceSerializer(serializers.Serializer):
    """
    Schema para la colección auto_services / vehicle_services en MongoDB.
    Soporta tanto auto_id como vehiculo_id para compatibilidad completa.
    """
    auto_id = serializers.IntegerField(required=False)
    vehiculo_id = serializers.IntegerField(required=False)
    service_type_id = serializers.CharField()
    date = serializers.DateField(required=False)
    kilometers = serializers.IntegerField(required=False)
    cost = serializers.FloatField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if not attrs.get("auto_id") and not attrs.get("vehiculo_id"):
            attrs["auto_id"] = 1
        return attrs
