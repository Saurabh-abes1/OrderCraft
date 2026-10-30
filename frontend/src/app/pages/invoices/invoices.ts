import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Invoice,
  InvoiceRequest,
  InvoiceService
} from '../../services/invoice.service';

import {
  Customer,
  CustomerService
} from '../../services/customer.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})
export class Invoices implements OnInit {
  invoices: Invoice[] = [];
  customers: Customer[] = [];

  loading = false;
  saving = false;
  isEditing = false;

  message = '';
  errorMessage = '';

  form = {
    id: null as number | null,
    customerId: null as number | null,
    invoiceNumber: '',
    invoiceDate: '',
    totalAmount: null as number | null,
    status: 'UNPAID'
  };

  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadInvoices();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Unable to load customers.';
        this.cdr.detectChanges();
      }
    });
  }

  loadInvoices(): void {
    this.loading = true;

    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.errorMessage = 'Unable to load invoices.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  refreshPageData(): void {
    this.message = '';
    this.errorMessage = '';

    this.loadCustomers();
    this.loadInvoices();
  }

  saveInvoice(): void {
    this.message = '';
    this.errorMessage = '';

    if (
      this.form.customerId === null ||
      !this.form.invoiceNumber.trim() ||
      !this.form.invoiceDate ||
      this.form.totalAmount === null ||
      this.form.totalAmount < 0
    ) {
      this.errorMessage = 'Please complete all fields with valid values.';
      return;
    }

    const invoiceRequest: InvoiceRequest = {
      customerId: this.form.customerId,
      invoiceNumber: this.form.invoiceNumber.trim(),
      invoiceDate: this.form.invoiceDate,
      totalAmount: this.form.totalAmount,
      status: this.form.status
    };

    this.saving = true;

    const request =
      this.isEditing && this.form.id !== null
        ? this.invoiceService.updateInvoice(this.form.id, invoiceRequest)
        : this.invoiceService.createInvoice(invoiceRequest);

    request.subscribe({
      next: () => {
        this.message = this.isEditing
          ? 'Invoice updated successfully.'
          : 'Invoice created successfully.';

        this.resetForm();
        this.saving = false;

        this.loadInvoices();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error saving invoice:', error);
        this.errorMessage =
          'Unable to save invoice. Please check the entered details.';

        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  editInvoice(invoice: Invoice): void {
    this.isEditing = true;

    this.form = {
      id: invoice.id ?? null,
      customerId: invoice.customer?.id ?? null,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      totalAmount: invoice.totalAmount,
      status: invoice.status
    };

    this.message = '';
    this.errorMessage = '';

    // Update the form immediately with the selected invoice's details.
    this.cdr.detectChanges();
  }

  deleteInvoice(invoice: Invoice): void {
    if (invoice.id === undefined) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete invoice ${invoice.invoiceNumber}?`
    );

    if (!confirmed) {
      return;
    }

    this.invoiceService.deleteInvoice(invoice.id).subscribe({
      next: () => {
        this.message = 'Invoice deleted successfully.';
        this.loadInvoices();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting invoice:', error);
        this.errorMessage = 'Unable to delete invoice.';
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;

    this.form = {
      id: null,
      customerId: null,
      invoiceNumber: '',
      invoiceDate: '',
      totalAmount: null,
      status: 'UNPAID'
    };

    this.cdr.detectChanges();
  }

  getCustomerName(invoice: Invoice): string {
    return invoice.customer?.customerName ?? 'Unknown customer';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replaceAll('_', '-');
  }
}