from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Marca, Auto, Rental
from .serializers import MarcaSerializer, AutoSerializer, RentalSerializer
from .permissions import IsAdminOrReadOnly


class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all().order_by("id")
    serializer_class = MarcaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["nombre"]
    ordering_fields = ["id", "nombre"]


class AutoViewSet(viewsets.ModelViewSet):
    queryset = Auto.objects.select_related("marca").all().order_by("-id")
    serializer_class = AutoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["marca"]
    search_fields = ["modelo", "placa", "color", "marca__nombre"]
    ordering_fields = ["id", "anio", "modelo", "placa", "creado_en"]

    def get_queryset(self):
        qs = super().get_queryset()
        anio_min = self.request.query_params.get("anio_min")
        anio_max = self.request.query_params.get("anio_max")
        if anio_min:
            qs = qs.filter(anio__gte=int(anio_min))
        if anio_max:
            qs = qs.filter(anio__lte=int(anio_max))
        return qs

    def get_permissions(self):
        # Público: SOLO listar autos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()


class RentalViewSet(viewsets.ModelViewSet):
    queryset = Rental.objects.select_related("vehicle").all().order_by("-created_at")
    serializer_class = RentalSerializer
    permission_classes = [IsAdminOrReadOnly]

    def create(self, request, *args, **kwargs):
        # Allow authenticated users (or admin) to create rentals; after creating rental, insert event in Mongo
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rental = serializer.save()

        # Insert rental event into MongoDB
        try:
            from .mongo import db
            event = {
                "rental_id": int(rental.id),
                "event_type": "CREATED",
                "source": "SYSTEM",
                "note": "Rental created",
                "created_at": rental.created_at.isoformat(),
            }
            db["rental_events"].insert_one(event)
        except Exception:
            # do not block rental creation if Mongo fails
            pass

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
