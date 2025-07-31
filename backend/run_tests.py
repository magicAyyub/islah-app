#!/usr/bin/env python3
"""
Test runner script for Islah School Management System

This script runs different test suites for the application.
Each test suite is designed to run independently for better reliability.
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and display results."""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {command}")
    print('='*60)
    
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    
    if result.stdout:
        print("STDOUT:")
        print(result.stdout)
    
    if result.stderr:
        print("STDERR:")
        print(result.stderr)
    
    if result.returncode == 0:
        print(f"✔{description} - PASSED")
    else:
        print(f"𐄂 {description} - FAILED (exit code: {result.returncode})")
    
    return result.returncode == 0

def main():
    """Main test runner function."""
    print("Islah School Management System - Test Runner")
    print("=" * 60)
    
    # Change to backend directory
    os.chdir('/Users/ayouba/Documents/islah-app/backend')
    
    # Track test results
    results = []
    
    # Test configuration
    test_suites = {
        "Core Business Logic Tests": [
            "tests/test_students.py",
            "tests/test_payments.py", 
            "tests/test_registrations.py",
            "tests/test_classes.py"
        ],
        "Authentication System Tests": [
            "tests/test_auth_standalone.py"
        ],
        "Pagination & Search Tests": [
            "tests/test_pagination_standalone.py"
        ]
    }
    
    # Run each test suite
    for suite_name, test_files in test_suites.items():
        print(f"\nRunning {suite_name}...")
        
        for test_file in test_files:
            command = f"python -m pytest {test_file} -v"
            success = run_command(command, f"{suite_name} - {test_file}")
            results.append((f"{suite_name} - {os.path.basename(test_file)}", success))
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST RESULTS SUMMARY")
    print('='*60)
    
    total_tests = len(results)
    passed_tests = sum(1 for _, success in results if success)
    
    for test_suite, success in results:
        status = "✓ PASSED" if success else "𐄂 FAILED"
        print(f"{test_suite:.<40} {status}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} test suites passed")
    
    if passed_tests == total_tests:
        print("All test suites passed!")
        return 0
    else:
        print("Some test suites failed. Check the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
