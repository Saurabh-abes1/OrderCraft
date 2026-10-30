import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  BomService,
  Bom as BomRecord,
  BomRequest
} from '../../services/bom.service';

import {
  ProductService,
  Product
} from '../../services/product.service';

@Component({
  selector: 'app-bom',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bom.html',
  styleUrl: './bom.css'
})
export class Bom implements OnInit {

  boms: BomRecord[] = [];
  products: Product[] = [];

  form = {
    id: null as number | null,
    productId: null as number | null,
    materialName: '',
    quantity: 1,
    unit: ''
  };

  isEditing = false;
  loading = false;
  message = '';
  errorMessage = '';

  constructor(
    private bomService: BomService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshPageData();
  }

  // Reload products and BOM records
  refreshPageData(): void {
    this.loadProducts();
    this.loadBoms();
  }

  // Load products for the dropdown
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);

        this.errorMessage =
          'Unable to load products. Please check the backend.';

        this.cdr.detectChanges();
      }
    });
  }

  // Load all BOM records from the backend
  loadBoms(): void {
    this.loading = true;

    this.bomService.getAllBoms().subscribe({
      next: (data) => {
        this.boms = data;
        this.loading = false;

        // Explicitly update the Angular view
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading BOM records:', error);

        this.errorMessage = 'Unable to load BOM records.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  // Create or update a BOM item
  saveBom(): void {
    this.message = '';
    this.errorMessage = '';

    // Validate form fields
    if (
      this.form.productId === null ||
      !this.form.materialName.trim() ||
      !this.form.unit.trim() ||
      this.form.quantity <= 0
    ) {
      this.errorMessage =
        'Please complete all fields with valid values.';
      return;
    }

    // Prepare request for the backend
    const request: BomRequest = {
      productId: this.form.productId,
      materialName: this.form.materialName.trim(),
      quantity: this.form.quantity,
      unit: this.form.unit.trim()
    };

    const isUpdate =
      this.isEditing && this.form.id !== null;

    // Choose create or update API
    const saveRequest = isUpdate
      ? this.bomService.updateBom(this.form.id!, request)
      : this.bomService.createBom(request);

    saveRequest.subscribe({
      next: () => {
        this.message = isUpdate
          ? 'BOM item updated successfully.'
          : 'BOM item added successfully.';

        this.errorMessage = '';

        // Reset form after successful save
        this.resetForm();

        // Fetch the latest records and update the table
        this.loadBoms();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error saving BOM item:', error);

        this.errorMessage = isUpdate
          ? 'Unable to update BOM item.'
          : 'Unable to add BOM item. Check the backend.';

        this.cdr.detectChanges();
      }
    });
  }

  // Load a BOM item into the form for editing
  editBom(bom: BomRecord): void {
    this.form = {
      id: bom.id ?? null,
      productId: bom.product.id,
      materialName: bom.materialName,
      quantity: bom.quantity,
      unit: bom.unit
    };

    this.isEditing = true;
    this.message = '';
    this.errorMessage = '';

    this.cdr.detectChanges();
  }

  // Delete a BOM item
  deleteBom(id?: number): void {
    if (id === undefined) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this BOM item?'
    );

    if (!confirmed) {
      return;
    }

    this.bomService.deleteBom(id).subscribe({
      next: () => {
        this.message = 'BOM item deleted successfully.';
        this.errorMessage = '';

        // Reload records after deletion
        this.loadBoms();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting BOM item:', error);

        this.errorMessage = 'Unable to delete BOM item.';
        this.message = '';

        this.cdr.detectChanges();
      }
    });
  }

  // Reset the form
  resetForm(): void {
    this.form = {
      id: null,
      productId: null,
      materialName: '',
      quantity: 1,
      unit: ''
    };

    this.isEditing = false;
  }

  // Get product name using its ID
  getProductName(productId?: number): string {
    return this.products.find(
      product => product.id === productId
    )?.productName ?? 'Unknown product';
  }
}