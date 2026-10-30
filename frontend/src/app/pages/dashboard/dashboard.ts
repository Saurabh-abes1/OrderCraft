import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CustomerService, Customer } from '../../services/customer.service';
import { ProductService, Product } from '../../services/product.service';
import { SupplierService, Supplier } from '../../services/supplier.service';
import {
  PurchaseOrderService,
  PurchaseOrder
} from '../../services/purchase-order.service';
import {
  InvoiceService,
  Invoice
} from '../../services/invoice.service';
import {
  PaymentService,
  Payment
} from '../../services/payment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // =========================
  // KPI COUNTS
  // =========================

  totalCustomers = 0;
  totalProducts = 0;
  totalSuppliers = 0;
  totalPurchaseOrders = 0;
  totalInvoices = 0;
  totalPayments = 0;

  // =========================
  // FINANCIAL DATA
  // =========================

  totalInvoiceValue = 0;
  totalPaymentsReceived = 0;
  outstandingAmount = 0;

  // =========================
  // RECENT DATA
  // =========================

  recentCustomers: Customer[] = [];
  recentPurchaseOrders: PurchaseOrder[] = [];
  recentInvoices: Invoice[] = [];
  recentPayments: Payment[] = [];

  // =========================
  // UI STATE
  // =========================

  loading = true;
  errorMessage = '';

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private purchaseOrderService: PurchaseOrderService,
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // =========================
  // LOAD DASHBOARD
  // =========================

  loadDashboardData(): void {

    this.loading = true;
    this.errorMessage = '';

    let completedRequests = 0;
    const totalRequests = 6;

    const requestCompleted = () => {
      completedRequests++;

      if (completedRequests === totalRequests) {
        this.calculateOutstandingAmount();
        this.loading = false;
        this.cdr.detectChanges();
      }
    };

    // -------------------------
    // CUSTOMERS
    // -------------------------

    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {

        this.totalCustomers = data.length;

        this.recentCustomers = [...data]
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .slice(0, 5);

        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Some dashboard data could not be loaded.';
        requestCompleted();
      }
    });

    // -------------------------
    // PRODUCTS
    // -------------------------

    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {

        this.totalProducts = data.length;

        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Some dashboard data could not be loaded.';
        requestCompleted();
      }
    });

    // -------------------------
    // SUPPLIERS
    // -------------------------

    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {

        this.totalSuppliers = data.length;

        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.errorMessage = 'Some dashboard data could not be loaded.';
        requestCompleted();
      }
    });

    // -------------------------
    // PURCHASE ORDERS
    // -------------------------

    this.purchaseOrderService.getPurchaseOrders().subscribe({
      next: (data: PurchaseOrder[]) => {

        this.totalPurchaseOrders = data.length;

        this.recentPurchaseOrders = [...data]
          .sort((a: any, b: any) => {
            return (b.id ?? 0) - (a.id ?? 0);
          })
          .slice(0, 5);

        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading purchase orders:', error);
        this.errorMessage = 'Some dashboard data could not be loaded.';
        requestCompleted();
      }
    });

    // -------------------------
    // INVOICES
    // -------------------------

    this.invoiceService.getAllInvoices().subscribe({
      next: (data: Invoice[]) => {

        this.totalInvoices = data.length;

        this.totalInvoiceValue = data.reduce(
          (total, invoice) =>
            total + Number(invoice.totalAmount || 0),
          0
        );

        this.recentInvoices = [...data]
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .slice(0, 5);

        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.errorMessage = 'Some dashboard data could not be loaded.';
        requestCompleted();
      }
    });

    // -------------------------
    // PAYMENTS
    // -------------------------

    this.paymentService.getAllPayments().subscribe({
      next: (data: Payment[]) => {

        this.totalPayments = data.length;

        this.totalPaymentsReceived = data.reduce(
          (total, payment) =>
            total + Number(payment.amount || 0),
          0
        );

        this.recentPayments = [...data]
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .slice(0, 5);

        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.errorMessage = 'Some dashboard data could not be loaded.';
        requestCompleted();
      }
    });
  }

  // =========================
  // OUTSTANDING AMOUNT
  // =========================

  calculateOutstandingAmount(): void {

    this.outstandingAmount =
      this.totalInvoiceValue - this.totalPaymentsReceived;

    if (this.outstandingAmount < 0) {
      this.outstandingAmount = 0;
    }
  }

  // =========================
  // REFRESH
  // =========================

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  // =========================
  // HELPERS
  // =========================

  getInvoiceStatusClass(status: string): string {

    const value = (status || '').toUpperCase();

    if (value === 'PAID') {
      return 'status-paid';
    }

    if (value === 'PARTIALLY_PAID') {
      return 'status-partial';
    }

    return 'status-unpaid';
  }

  getInvoiceStatusLabel(status: string): string {

    const value = (status || '').toUpperCase();

    if (value === 'PARTIALLY_PAID') {
      return 'Partially Paid';
    }

    if (value === 'PAID') {
      return 'Paid';
    }

    return 'Unpaid';
  }

  getPaymentMethodLabel(method: string): string {

    if (!method) {
      return '-';
    }

    return method
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  getCustomerName(invoice: Invoice): string {

    return invoice.customer?.customerName || 'Unknown customer';
  }

  getPurchaseOrderReference(order: PurchaseOrder): string {

    const item: any = order;

    return (
      item.poNumber ||
      item.orderNumber ||
      item.purchaseOrderNumber ||
      `PO-${item.id ?? ''}`
    );
  }

  getPurchaseOrderSupplier(order: PurchaseOrder): string {

    const item: any = order;

    return (
      item.supplier?.supplierName ||
      item.supplierName ||
      'Supplier'
    );
  }
}