# src/routes/invoices.py

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import io

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_or_staff_role
from src.models import Invoice, Student, Payment, Parent, ParentStudent, InvoiceItem  # Changed ParentStudentRelation to ParentStudent and added InvoiceItem
from src.schemas import (
    InvoiceCreate, InvoiceUpdate, InvoiceResponse, 
    InvoiceDetailResponse, InvoiceItemCreate, InvoiceItemResponse,
    InvoiceReminderCreate
)
from src.utils.pdf_generator import generate_invoice_pdf
from src.utils.notifications import send_invoice_notification

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[InvoiceResponse])
async def read_invoices(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[int] = None,
    parent_id: Optional[int] = None,
    status: Optional[str] = None,
    due_date_from: Optional[datetime] = None,
    due_date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Invoice)
    
    # Filter by student
    if student_id:
        query = query.filter(Invoice.student_id == student_id)
    
    # Filter by parent (through student-parent relationship)
    if parent_id:
        query = query.join(Student).join(ParentStudent).filter(
            ParentStudent.parent_id == parent_id
        )
    
    # If user is a parent, only show their children's invoices
    if current_user.role == "parent":
        parent = db.query(Parent).filter(Parent.user_id == current_user.id).first()
        if parent:
            query = query.join(Student).join(ParentStudent).filter(
                ParentStudent.parent_id == parent.id
            )
        else:
            return []  # If no parent profile, return empty list
    
    # Filter by status
    if status:
        query = query.filter(Invoice.status == status)
    
    # Filter by due date range
    if due_date_from:
        query = query.filter(Invoice.due_date >= due_date_from)
    
    if due_date_to:
        query = query.filter(Invoice.due_date <= due_date_to)
    
    # Order by due date (most recent first)
    invoices = query.order_by(Invoice.due_date.desc()).offset(skip).limit(limit).all()
    return invoices

@router.get("/overdue", response_model=List[InvoiceResponse])
async def get_overdue_invoices(
    days_overdue: int = 0,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    today = datetime.utcnow().date()
    overdue_date = today - timedelta(days=days_overdue)
    
    query = db.query(Invoice).filter(
        Invoice.status != "paid",
        Invoice.due_date < overdue_date
    )
    
    invoices = query.order_by(Invoice.due_date).all()
    return invoices

@router.get("/{invoice_id}", response_model=InvoiceDetailResponse)
async def read_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Check if user has permission to view this invoice
    if current_user.role == "parent":
        parent = db.query(Parent).filter(Parent.user_id == current_user.id).first()
        if parent:
            # Check if parent is related to the student
            relation = db.query(ParentStudent).filter(
                ParentStudent.parent_id == parent.id,
                ParentStudent.student_id == invoice.student_id
            ).first()
            
            if not relation:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this invoice"
                )
    
    return invoice

@router.post("/", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice: InvoiceCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if student exists
    student = db.query(Student).filter(Student.id == invoice.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Create invoice
    db_invoice = Invoice(
        student_id=invoice.student_id,
        invoice_number=invoice.invoice_number,
        issue_date=invoice.issue_date or datetime.utcnow().date(),
        due_date=invoice.due_date,
        total_amount=invoice.total_amount,
        status=invoice.status or "pending",
        description=invoice.description,
        notes=invoice.notes
    )
    
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    # Add invoice items if provided
    if invoice.items:
        for item in invoice.items:
            db_item = InvoiceItem(
                invoice_id=db_invoice.id,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                amount=item.quantity * item.unit_price,
                item_type=item.item_type
            )
            db.add(db_item)
        
        db.commit()
    
    # Send notification to parents
    parents = db.query(Parent).join(ParentStudent).filter(
        ParentStudent.student_id == invoice.student_id
    ).all()
    
    for parent in parents:
        if parent.user_id:
            background_tasks.add_task(
                send_invoice_notification,
                user_id=parent.user_id,
                student_name=f"{student.first_name} {student.last_name}",
                invoice_number=db_invoice.invoice_number,
                amount=db_invoice.total_amount,
                due_date=db_invoice.due_date
            )
    
    return db_invoice

@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: int,
    invoice: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    update_data = invoice.dict(exclude_unset=True)
    
    # Update invoice fields
    for key, value in update_data.items():
        if key != "items":  # Handle items separately
            setattr(db_invoice, key, value)
    
    db.commit()
    db.refresh(db_invoice)
    
    return db_invoice

@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Check if invoice has payments
    payments = db.query(Payment).filter(Payment.invoice_id == invoice_id).count()
    if payments > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete invoice with associated payments"
        )
    
    # Delete invoice items first
    db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).delete()
    
    # Delete invoice
    db.delete(db_invoice)
    db.commit()
    
    return None

@router.get("/{invoice_id}/pdf", response_class=Response)
async def generate_invoice_pdf_endpoint(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if invoice is None:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Check if user has permission to view this invoice
    if current_user.role == "parent":
        parent = db.query(Parent).filter(Parent.user_id == current_user.id).first()
        if parent:
            # Check if parent is related to the student
            relation = db.query(ParentStudent).filter(
                ParentStudent.parent_id == parent.id,
                ParentStudent.student_id == invoice.student_id
            ).first()
            
            if not relation:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this invoice"
                )
    
    # Get student details
    student = db.query(Student).filter(Student.id == invoice.student_id).first()
    
    # Get invoice items
    items = db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).all()
    
    # Generate PDF
    pdf_bytes = generate_invoice_pdf(invoice, student, items)
    
    # Return PDF as response
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=invoice_{invoice.invoice_number}.pdf"
        }
    )

@router.post("/{invoice_id}/items", response_model=InvoiceItemResponse)
async def add_invoice_item(
    invoice_id: int,
    item: InvoiceItemCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if invoice exists
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Create invoice item
    db_item = InvoiceItem(
        invoice_id=invoice_id,
        description=item.description,
        quantity=item.quantity,
        unit_price=item.unit_price,
        amount=item.quantity * item.unit_price,
        item_type=item.item_type
    )
    
    db.add(db_item)
    
    # Update invoice total amount
    invoice.total_amount += db_item.amount
    
    db.commit()
    db.refresh(db_item)
    
    return db_item

@router.delete("/{invoice_id}/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_invoice_item(
    invoice_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if invoice exists
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Check if item exists and belongs to the invoice
    item = db.query(InvoiceItem).filter(
        InvoiceItem.id == item_id,
        InvoiceItem.invoice_id == invoice_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Invoice item not found")
    
    # Update invoice total amount
    invoice.total_amount -= item.amount
    
    # Delete item
    db.delete(item)
    db.commit()
    
    return None

@router.post("/{invoice_id}/send-reminder", status_code=status.HTTP_200_OK)
async def send_invoice_reminder(
    invoice_id: int,
    reminder: InvoiceReminderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    # Check if invoice exists
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Check if invoice is already paid
    if invoice.status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send reminder for a paid invoice"
        )
    
    # Get student details
    student = db.query(Student).filter(Student.id == invoice.student_id).first()
    
    # Get parents
    parents = db.query(Parent).join(ParentStudent).filter(
        ParentStudent.student_id == invoice.student_id
    ).all()
    
    # Send reminder to parents
    for parent in parents:
        if parent.user_id:
            background_tasks.add_task(
                send_invoice_notification,
                user_id=parent.user_id,
                student_name=f"{student.first_name} {student.last_name}",
                invoice_number=invoice.invoice_number,
                amount=invoice.total_amount,
                due_date=invoice.due_date,
                is_reminder=True,
                message=reminder.message
            )
    
    # Update invoice reminder count and last reminder date
    invoice.reminder_count = (invoice.reminder_count or 0) + 1
    invoice.last_reminder_date = datetime.utcnow().date()
    
    db.commit()
    
    return {"message": f"Reminder sent to {len(parents)} parents"}

@router.post("/bulk-reminders", status_code=status.HTTP_200_OK)
async def send_bulk_invoice_reminders(
    reminder: InvoiceReminderCreate,
    background_tasks: BackgroundTasks,
    days_overdue: int = 0,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_or_staff_role)
):
    today = datetime.utcnow().date()
    overdue_date = today - timedelta(days=days_overdue)
    
    # Get all overdue invoices
    overdue_invoices = db.query(Invoice).filter(
        Invoice.status != "paid",
        Invoice.due_date < overdue_date
    ).all()
    
    reminder_count = 0
    
    for invoice in overdue_invoices:
        # Get student details
        student = db.query(Student).filter(Student.id == invoice.student_id).first()
        
        # Get parents
        parents = db.query(Parent).join(ParentStudent).filter(
            ParentStudent.student_id == invoice.student_id
        ).all()
        
        # Send reminder to parents
        for parent in parents:
            if parent.user_id:
                background_tasks.add_task(
                    send_invoice_notification,
                    user_id=parent.user_id,
                    student_name=f"{student.first_name} {student.last_name}",
                    invoice_number=invoice.invoice_number,
                    amount=invoice.total_amount,
                    due_date=invoice.due_date,
                    is_reminder=True,
                    message=reminder.message
                )
                reminder_count += 1
        
        # Update invoice reminder count and last reminder date
        invoice.reminder_count = (invoice.reminder_count or 0) + 1
        invoice.last_reminder_date = today
    
    db.commit()
    
    return {
        "message": f"Sent {reminder_count} reminders for {len(overdue_invoices)} overdue invoices"
    }