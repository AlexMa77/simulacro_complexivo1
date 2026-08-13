from django.db import models

# Marca del Auto (ej: Toyota, Ford, Chevrolet)
class Marca(models.Model):
    nombre = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.nombre


# Auto (entidad de vehículos)
class Auto(models.Model):
    marca = models.ForeignKey(Marca, on_delete=models.PROTECT, related_name="autos")
    modelo = models.CharField(max_length=120)
    anio = models.IntegerField()
    placa = models.CharField(max_length=20, unique=True)
    color = models.CharField(max_length=60, blank=True, default="")
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.marca.nombre} {self.modelo} ({self.placa})"


# Rentals (alquileres)
class Rental(models.Model):
    class Status(models.TextChoices):
        RESERVED = "RESERVED", "Reserved"
        ACTIVE = "ACTIVE", "Active"
        CLOSED = "CLOSED", "Closed"
        CANCELLED = "CANCELLED", "Cancelled"

    vehicle = models.ForeignKey(Auto, on_delete=models.PROTECT, related_name="rentals")
    customer_name = models.CharField(max_length=120)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RESERVED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rental {self.id} - {self.customer_name} ({self.status})"
