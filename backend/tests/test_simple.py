"""
Simple test to verify the Task Management API is working correctly.
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

import asyncio
import threading
import time
import requests
from backend.src.api.main import app
from backend.init_db import create_tables


def start_test_server():
    """Start the FastAPI server in a separate thread for testing."""
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="error")


def run_tests():
    """Run simple tests to verify API functionality."""
    base_url = "http://localhost:8000"

    print("Waiting for server to start...")
    time.sleep(3)  # Give server time to start

    print("\nTesting API endpoints...")

    # Test 1: Root endpoint
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Root endpoint: OK")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Root endpoint: Failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint: Error - {e}")

    # Test 2: Create a task for user123
    try:
        task_data = {
            "title": "Test Task",
            "description": "This is a test task",
            "completed": False
        }
        response = requests.post(f"{base_url}/api/user123/tasks", json=task_data)
        if response.status_code == 201:
            print("\n✅ Create Task endpoint: OK")
            created_task = response.json()["data"]
            print(f"   Created task ID: {created_task['id']}")
            task_id = created_task['id']
        else:
            print(f"\n❌ Create Task endpoint: Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            task_id = None
    except Exception as e:
        print(f"\n❌ Create Task endpoint: Error - {e}")
        task_id = None

    # Test 3: Get all tasks for user123
    try:
        response = requests.get(f"{base_url}/api/user123/tasks")
        if response.status_code == 200:
            print("\n✅ Get All Tasks endpoint: OK")
            tasks = response.json()["data"]
            print(f"   Retrieved {len(tasks)} tasks")
        else:
            print(f"\n❌ Get All Tasks endpoint: Failed with status {response.status_code}")
    except Exception as e:
        print(f"\n❌ Get All Tasks endpoint: Error - {e}")

    # Test 4: Get specific task if we have one
    if task_id:
        try:
            response = requests.get(f"{base_url}/api/user123/tasks/{task_id}")
            if response.status_code == 200:
                print("\n✅ Get Specific Task endpoint: OK")
                task = response.json()["data"]
                print(f"   Retrieved task: {task['title']}")
            else:
                print(f"\n❌ Get Specific Task endpoint: Failed with status {response.status_code}")
        except Exception as e:
            print(f"\n❌ Get Specific Task endpoint: Error - {e}")

    # Test 5: Update task if we have one
    if task_id:
        try:
            update_data = {
                "title": "Updated Test Task",
                "description": "This is an updated test task",
                "completed": True
            }
            response = requests.put(f"{base_url}/api/user123/tasks/{task_id}", json=update_data)
            if response.status_code == 200:
                print("\n✅ Update Task endpoint: OK")
                updated_task = response.json()["data"]
                print(f"   Updated task: {updated_task['title']}")
            else:
                print(f"\n❌ Update Task endpoint: Failed with status {response.status_code}")
        except Exception as e:
            print(f"\n❌ Update Task endpoint: Error - {e}")

    # Test 6: Toggle task completion if we have one
    if task_id:
        try:
            toggle_data = {
                "completed": False
            }
            response = requests.patch(f"{base_url}/api/user123/tasks/{task_id}/complete", json=toggle_data)
            if response.status_code == 200:
                print("\n✅ Toggle Task Completion endpoint: OK")
                toggled_task = response.json()["data"]
                print(f"   Toggled task completion: {toggled_task['completed']}")
            else:
                print(f"\n❌ Toggle Task Completion endpoint: Failed with status {response.status_code}")
        except Exception as e:
            print(f"\n❌ Toggle Task Completion endpoint: Error - {e}")

    # Test 7: Delete task if we have one
    if task_id:
        try:
            response = requests.delete(f"{base_url}/api/user123/tasks/{task_id}")
            if response.status_code == 200:
                print("\n✅ Delete Task endpoint: OK")
                print(f"   Response: {response.json()['data']['message']}")
            else:
                print(f"\n❌ Delete Task endpoint: Failed with status {response.status_code}")
        except Exception as e:
            print(f"\n❌ Delete Task endpoint: Error - {e}")

    print("\n" + "="*50)
    print("API testing completed!")
    print("="*50)


if __name__ == "__main__":
    print("Initializing database...")
    create_tables()
    print("Database initialized successfully!\n")

    print("Starting API tests...")
    run_tests()