from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MarcaViewSet, AutoViewSet
from .service_types_views import service_types_list_create, service_types_detail
from .auto_services_views import auto_services_list_create, auto_services_detail

router = DefaultRouter()
router.register(r"marcas", MarcaViewSet, basename="marcas")
router.register(r"autos", AutoViewSet, basename="autos")
router.register(r"vehiculos", AutoViewSet, basename="vehiculos")

urlpatterns = [
    # Mongo - Tipos de servicio
    path("service-types/", service_types_list_create),
    path("service-types/<str:id>/", service_types_detail),
    # Mongo - Servicios de autos / vehiculos (ambos aliases disponibles)
    path("auto-services/", auto_services_list_create),
    path("auto-services/<str:id>/", auto_services_detail),
    path("vehicle-services/", auto_services_list_create),
    path("vehicle-services/<str:id>/", auto_services_detail),
]

urlpatterns += router.urls
