import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Payment,
  PaymentRequest,
  PaymentService
} from '../../services/payment.service';

import {
  Invoice,
  InvoiceService
} from '../../services/invoice.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {

  payments: Payment[] = [];
  invoices: Invoice[] = [];

  loading = false;
  saving = false;

  message = '';
  errorMessage = '';

  form = {
    invoiceId: null as number | null,
    amount: null as number | null,
    paymentDate: '',
    paymentMethod: 'CASH'
  };

  constructor(
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadPayments();
  }

  loadInvoices(): void {
    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.errorMessage = 'Unable to load invoices.';
        this.cdr.detectChanges();
      }
    });
  }

  loadPayments(): void {
    this.loading = true;

    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.errorMessage = 'Unable to load payments.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  refreshPageData(): void {
    this.message = '';
    this.errorMessage = '';

    this.loadInvoices();
    this.loadPayments();
  }

  savePayment(): void {
    this.message = '';
    this.errorMessage = '';

    if (
      this.form.invoiceId === null ||
      this.form.amount === null ||
      this.form.amount <= 0 ||
      !this.form.paymentDate ||
      !this.form.paymentMethod
    ) {
      this.errorMessage = 'Please complete all payment details.';
      return;
    }

    const paymentRequest: PaymentRequest = {
      invoiceId: this.form.invoiceId,
      amount: this.form.amount,
      paymentDate: this.form.paymentDate,
      paymentMethod: this.form.paymentMethod
    };

    this.saving = true;

    this.paymentService.createPayment(paymentRequest).subscribe({
      next: () => {
        this.message = 'Payment recorded successfully.';

        this.resetForm();
        this.saving = false;

        this.loadPayments();
        this.loadInvoices();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error saving payment:', error);

        this.errorMessage =
          'Unable to record payment. Please check the entered details.';

        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletePayment(payment: Payment): void {
    if (payment.id === undefined) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete payment #${payment.id}?`
    );

    if (!confirmed) {
      return;
    }

    this.paymentService.deletePayment(payment.id).subscribe({
      next: () => {
        this.message = 'Payment deleted successfully.';

        this.loadPayments();
        this.loadInvoices();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting payment:', error);
        this.errorMessage = 'Unable to delete payment.';
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.form = {
      invoiceId: null,
      amount: null,
      paymentDate: '',
      paymentMethod: 'CASH'
    };

    this.cdr.detectChanges();
  }

  getInvoiceNumber(payment: Payment): string {
    return payment.invoice?.invoiceNumber ?? 'Unknown invoice';
  }

  getInvoiceTotal(payment: Payment): number {
    return payment.invoice?.totalAmount ?? 0;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replaceAll('_', '-');
  }
}