import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PurchaseOrder,
  PurchaseOrderService,
} from '../../services/purchase-order.service';

import {
  Supplier,
  SupplierService,
} from '../../services/supplier.service';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-orders.html',
  styleUrl: './purchase-orders.css',
})
export class PurchaseOrders implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  suppliers: Supplier[] = [];

  searchTerm = '';
  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  editingId: number | null = null;

  orderForm = this.createEmptyForm();

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadPurchaseOrders();
  }

  private createEmptyForm() {
    return {
      supplierId: null as number | null,
      orderDate: new Date().toISOString().slice(0, 10),
      totalAmount: null as number | null,
      status: 'PENDING',
    };
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data ?? [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.errorMessage = 'Could not load suppliers. Check the backend connection.';
        this.cdr.detectChanges();
      },
    });
  }

  loadPurchaseOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.purchaseOrderService.getPurchaseOrders().subscribe({
      next: (data) => {
        this.purchaseOrders = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading purchase orders:', error);
        this.errorMessage = 'Could not load purchase orders. Check the backend connection.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  savePurchaseOrder(): void {
    if (this.saving) return;

    if (
      this.orderForm.supplierId === null ||
      this.orderForm.totalAmount === null ||
      this.orderForm.totalAmount < 0 ||
      !this.orderForm.orderDate
    ) {
      this.errorMessage = 'Please complete all required fields with valid values.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const order: PurchaseOrder = {
      supplierId: this.orderForm.supplierId,
      orderDate: this.orderForm.orderDate,
      totalAmount: this.orderForm.totalAmount,
      status: this.orderForm.status,
    };

    const isEditing = this.editingId !== null;

    const request = isEditing
      ? this.purchaseOrderService.updatePurchaseOrder(this.editingId!, order)
      : this.purchaseOrderService.addPurchaseOrder(order);

    request.subscribe({
      next: () => {
        this.successMessage = isEditing
          ? 'Purchase order updated successfully.'
          : 'Purchase order created successfully.';

        this.resetForm();
        this.saving = false;
        this.loadPurchaseOrders();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error saving purchase order:', error);
        this.errorMessage =
          error?.error?.message ||
          'Could not save purchase order. Check the supplier and entered details.';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  editPurchaseOrder(order: PurchaseOrder): void {
    if (order.id === undefined) return;

    this.editingId = order.id;

    this.orderForm = {
      supplierId: order.supplier?.id ?? order.supplierId ?? null,
      orderDate: order.orderDate,
      totalAmount: order.totalAmount,
      status: order.status,
    };

    this.errorMessage = '';
    this.successMessage = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deletePurchaseOrder(order: PurchaseOrder): void {
    if (order.id === undefined) return;

    const confirmed = window.confirm(
      `Delete purchase order #${order.id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    this.purchaseOrderService.deletePurchaseOrder(order.id).subscribe({
      next: () => {
        this.successMessage = 'Purchase order deleted successfully.';

        if (this.editingId === order.id) {
          this.resetForm();
        }

        this.loadPurchaseOrders();
      },
      error: (error) => {
        console.error('Error deleting purchase order:', error);
        this.errorMessage = 'Could not delete this purchase order.';
        this.cdr.detectChanges();
      },
    });
  }

  get filteredPurchaseOrders(): PurchaseOrder[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) return this.purchaseOrders;

    return this.purchaseOrders.filter((order) => {
      const supplierName = order.supplier?.supplierName ?? '';

      return (
        String(order.id ?? '').includes(term) ||
        supplierName.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        order.orderDate.includes(term)
      );
    });
  }

  resetForm(): void {
    this.orderForm = this.createEmptyForm();
    this.editingId = null;
    this.cdr.detectChanges();
  }
}