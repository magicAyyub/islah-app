#!/usr/bin/env python3
"""Test the complete frontend-backend integration workflow"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import json
from datetime import date

# Test configuration
BASE_URL = "http://127.0.0.1:8000"

def test_complete_workflow():
    """Test the complete workflow that the frontend needs"""
    print("🧪 Testing complete frontend-backend integration workflow...")
    
    try:
        # 1. Test root endpoint
        print("\n1️⃣ Testing root endpoint...")
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Root endpoint working")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return
        
        # 2. Test endpoints that require authentication (should get 403/401)
        print("\n2️⃣ Testing authentication requirements...")
        
        endpoints_to_test = [
            "/students/",
            "/parents/",
            "/classes/"
        ]
        
        for endpoint in endpoints_to_test:
            response = requests.get(f"{BASE_URL}{endpoint}")
            if response.status_code in [401, 403]:
                print(f"✅ {endpoint} properly requires authentication")
            else:
                print(f"❌ {endpoint} should require authentication but got {response.status_code}")
        
        # 3. Test API structure (check if endpoints exist)
        print("\n3️⃣ Testing API endpoint structure...")
        
        # Try to get OpenAPI docs to see available endpoints
        try:
            response = requests.get(f"{BASE_URL}/docs")
            if response.status_code == 200:
                print("✅ FastAPI docs accessible at /docs")
            
            response = requests.get(f"{BASE_URL}/openapi.json")
            if response.status_code == 200:
                openapi_spec = response.json()
                paths = openapi_spec.get("paths", {})
                
                required_endpoints = [
                    "/students/",
                    "/parents/",
                    "/classes/",
                    "/auth/login"
                ]
                
                for endpoint in required_endpoints:
                    if endpoint in paths:
                        print(f"✅ {endpoint} endpoint exists")
                    else:
                        print(f"❌ {endpoint} endpoint missing")
                        
        except Exception as e:
            print(f"⚠️ Could not check OpenAPI spec: {e}")
        
        print("\n🎉 Integration test completed!")
        print("\nTo test the full workflow:")
        print("1. Start the backend server: python -m uvicorn app.main:app --reload")
        print("2. Start the frontend server: npm run dev")  
        print("3. Login with a valid user")
        print("4. Try creating a student with the form")
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("Make sure the backend is running on http://127.0.0.1:8000")
        print("Start it with: python -m uvicorn app.main:app --reload")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_complete_workflow()
