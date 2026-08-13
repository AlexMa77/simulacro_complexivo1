"""Create Rental model migration."""
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = False

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Rental",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("customer_name", models.CharField(max_length=120)),
                ("total", models.DecimalField(max_digits=10, decimal_places=2)),
                ("status", models.CharField(default="RESERVED", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "vehicle",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT, related_name="rentals", to="catalog.auto"
                    ),
                ),
            ],
        ),
    ]
