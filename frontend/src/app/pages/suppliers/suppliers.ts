import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Supplier,
  SupplierService,
} from '../../services/supplier.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css',
})
export class Suppliers implements OnInit {
  suppliers: Supplier[] = [];
  searchTerm = '';

  supplierForm: Supplier = this.createEmptySupplier();

  editingId: number | null = null;

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  private createEmptySupplier(): Supplier {
    return {
      supplierName: '',
      email: '',
      phone: '',
      address: '',
    };
  }

  // Load all suppliers from the backend
  loadSuppliers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliers = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading suppliers:', error);

        this.errorMessage =
          'Could not load suppliers. Check that the Spring Boot backend is running.';

        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Add a supplier or update an existing supplier
  saveSupplier(): void {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const isEditing = this.editingId !== null;

    const supplierToSave: Supplier = {
      supplierName: this.supplierForm.supplierName.trim(),
      email: this.supplierForm.email?.trim() ?? '',
      phone: this.supplierForm.phone?.trim() ?? '',
      address: this.supplierForm.address?.trim() ?? '',
    };

    const request = isEditing
      ? this.supplierService.updateSupplier(
          this.editingId!,
          supplierToSave
        )
      : this.supplierService.addSupplier(supplierToSave);

    request.subscribe({
      next: () => {
        this.successMessage = isEditing
          ? 'Supplier updated successfully.'
          : 'Supplier added successfully.';

        this.resetForm();
        this.saving = false;
        this.cdr.detectChanges();

        this.loadSuppliers();
      },

      error: (error) => {
        console.error('Error saving supplier:', error);

        this.errorMessage =
          'Could not save supplier. Check the entered details and try again.';

        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Copy the selected supplier's details into the form
  editSupplier(supplier: Supplier): void {
    console.log('Selected supplier for editing:', supplier);

    this.supplierForm = {
      id: supplier.id,
      supplierName: supplier.supplierName ?? '',
      email: supplier.email ?? '',
      phone: supplier.phone ?? '',
      address: supplier.address ?? '',
    };

    this.editingId = supplier.id ?? null;

    this.successMessage = '';
    this.errorMessage = '';

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // Delete a supplier
  deleteSupplier(supplier: Supplier): void {
    if (supplier.id === undefined) {
      this.errorMessage = 'Cannot delete supplier: supplier ID is missing.';
      return;
    }

    const confirmed = window.confirm(
      `Delete ${supplier.supplierName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.supplierService.deleteSupplier(supplier.id).subscribe({
      next: () => {
        this.successMessage = 'Supplier deleted successfully.';

        if (this.editingId === supplier.id) {
          this.resetForm();
        }

        this.cdr.detectChanges();
        this.loadSuppliers();
      },

      error: (error) => {
        console.error('Error deleting supplier:', error);
        this.errorMessage = 'Could not delete this supplier.';
        this.cdr.detectChanges();
      },
    });
  }

  // Search suppliers by name, email, phone, or address
  get filteredSuppliers(): Supplier[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.suppliers;
    }

    return this.suppliers.filter((supplier) =>
      [
        supplier.supplierName,
        supplier.email,
        supplier.phone,
        supplier.address,
      ].some((value) => value?.toLowerCase().includes(term))
    );
  }

  // Clear the form and exit edit mode
  resetForm(): void {
    this.supplierForm = this.createEmptySupplier();
    this.editingId = null;
    this.cdr.detectChanges();
  }
}