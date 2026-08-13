from django.db import migrations


SQL_UP = '''
-- index on rentals.status
CREATE INDEX IF NOT EXISTS idx_rentals_status ON catalog_rental (status);

-- view for active rentals
CREATE OR REPLACE VIEW vw_active_rentals AS
SELECT * FROM catalog_rental WHERE status IN ('RESERVED','ACTIVE');

-- ensure positive total
ALTER TABLE catalog_rental DROP CONSTRAINT IF EXISTS chk_rental_total_positive;
ALTER TABLE catalog_rental ADD CONSTRAINT chk_rental_total_positive CHECK (total > 0);
'''

SQL_DOWN = '''
DROP VIEW IF EXISTS vw_active_rentals;
DROP INDEX IF EXISTS idx_rentals_status;
ALTER TABLE catalog_rental DROP CONSTRAINT IF EXISTS chk_rental_total_positive;
'''


def forwards(apps, schema_editor):
    # Only run on PostgreSQL
    if schema_editor.connection.vendor != "postgresql":
        return
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(SQL_UP)


def backwards(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(SQL_DOWN)


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0002_create_rental"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
