"""
Script to verify the connection to Neon database and confirm table creation.
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from sqlalchemy import create_engine, text
from src.config.settings import settings

def verify_neon_connection():
    """Verify that we can connect to the Neon database and the task table exists."""
    print("Verifying Neon database connection...")

    # Create engine using the same settings as the application
    engine = create_engine(settings.database_url, echo=False)

    try:
        # Test the connection
        with engine.connect() as connection:
            print("✅ Successfully connected to Neon database!")

            # Check if the task table exists
            result = connection.execute(text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'task'
            """))

            table_exists = result.fetchone()

            if table_exists:
                print("✅ Task table exists in Neon database!")

                # Get table structure
                columns_result = connection.execute(text("""
                    SELECT column_name, data_type, is_nullable, column_default
                    FROM information_schema.columns
                    WHERE table_name = 'task'
                    ORDER BY ordinal_position
                """))

                print("\n📋 Task table structure:")
                for row in columns_result:
                    col_name, data_type, nullable, default_val = row
                    print(f"  - {col_name}: {data_type} ({'nullable' if nullable == 'YES' else 'not nullable'}) {f'[default: {default_val}]' if default_val else ''}")

                # Check for indexes
                indexes_result = connection.execute(text("""
                    SELECT indexname, indexdef
                    FROM pg_indexes
                    WHERE tablename = 'task'
                """))

                print(f"\n🔍 Indexes on task table:")
                for index_name, index_def in indexes_result:
                    print(f"  - {index_name}: {index_def}")

            else:
                print("❌ Task table does not exist in Neon database!")

    except Exception as e:
        print(f"❌ Error connecting to Neon database: {e}")

    print("\n" + "="*60)
    print("Neon Database Connection Verification Complete!")
    print("="*60)


if __name__ == "__main__":
    verify_neon_connection()