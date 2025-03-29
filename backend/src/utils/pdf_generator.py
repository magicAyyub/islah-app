"""
PDF generation utilities for the application.
"""

import io
from datetime import datetime
from typing import List
import base64

# Simple HTML-based PDF generation without reportlab
def generate_invoice_pdf(invoice, student, items):
    """
    Generate a PDF invoice using HTML string.
    Returns bytes that can be directly sent as a response.
    
    Args:
        invoice: The invoice model instance
        student: The student model instance
        items: List of invoice items
    
    Returns:
        bytes: PDF content as bytes
    """
    # Create a simple HTML invoice instead of PDF since reportlab is missing
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Invoice #{invoice.invoice_number}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .header {{ display: flex; justify-content: space-between; margin-bottom: 40px; }}
            .invoice-details {{ margin-bottom: 30px; }}
            table {{ width: 100%; border-collapse: collapse; margin-bottom: 30px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
            .total {{ font-weight: bold; text-align: right; margin-top: 20px; }}
            .footer {{ margin-top: 50px; font-size: 0.8em; text-align: center; color: #666; }}
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <h1>INVOICE</h1>
                <p>Islah School</p>
                <p>123 Education Street</p>
                <p>City, Country</p>
            </div>
            <div>
                <h2>Invoice #{invoice.invoice_number}</h2>
                <p>Date: {invoice.issue_date.strftime('%Y-%m-%d')}</p>
                <p>Due Date: {invoice.due_date.strftime('%Y-%m-%d')}</p>
                <p>Status: {invoice.status.upper()}</p>
            </div>
        </div>
        
        <div class="invoice-details">
            <h3>Billed To:</h3>
            <p>{student.first_name} {student.last_name}</p>
            <p>Student ID: {student.id}</p>
            <p>{student.address if student.address else 'No address provided'}</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
    """
    
    # Add invoice items
    for item in items:
        html += f"""
                <tr>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price:.2f}</td>
                    <td>${item.amount:.2f}</td>
                </tr>
        """
    
    html += f"""
            </tbody>
        </table>
        
        <div class="total">
            <p>Total Amount: ${invoice.total_amount:.2f}</p>
        </div>
        
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>For questions concerning this invoice, please contact our finance department.</p>
            <p>Phone: +123-456-7890 | Email: finance@islahschool.edu</p>
        </div>
    </body>
    </html>
    """
    
    # Return HTML as bytes
    return html.encode('utf-8')