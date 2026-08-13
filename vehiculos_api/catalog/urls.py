from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MarcaViewSet, AutoViewSet, RentalViewSet
from .service_types_views import service_types_list_create, service_types_detail
from .vehicle_services_views import vehicle_services_list_create, vehicle_services_detail
from .fleet_logs_views import fleet_logs_list_create, fleet_logs_detail
from .rental_events_views import rental_events_list_create, rental_events_detail

router = DefaultRouter()
router.register(r"marcas", MarcaViewSet, basename="marcas")
router.register(r"autos", AutoViewSet, basename="autos")
router.register(r"vehiculos", AutoViewSet, basename="vehiculos")
router.register(r"vehicles", AutoViewSet, basename="vehicles")
router.register(r"rentals", RentalViewSet, basename="rentals")

urlpatterns = [
    # Mongo - Tipos de servicio
    path("service-types/", service_types_list_create),
    path("service-types/<str:id>/", service_types_detail),
    # Mongo - Servicios de vehículos
    path("vehicle-services/", vehicle_services_list_create),
    path("vehicle-services/<str:id>/", vehicle_services_detail),
    # Mongo - Fleet logs and rental events
    path("fleet-logs/", fleet_logs_list_create),
    path("fleet-logs/<str:id>/", fleet_logs_detail),
    path("rental-events/", rental_events_list_create),
    path("rental-events/<str:id>/", rental_events_detail),
]

urlpatterns += router.urls
