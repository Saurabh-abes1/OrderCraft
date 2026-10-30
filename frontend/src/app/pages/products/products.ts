import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Product,
  ProductService,
} from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: Product[] = [];
  searchTerm = '';

  productForm: Product = {
    productName: '',
    sku: '',
    description: '',
    unitPrice: 0,
    unit: '',
  };

  editingId: number | null = null;

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load products from the backend
  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage =
          'Could not load products. Check that the Spring Boot backend is running.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Add a new product or update an existing one
  saveProduct(): void {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const isEditing = this.editingId !== null;

    const request = isEditing
      ? this.productService.updateProduct(
          this.editingId!,
          this.productForm
        )
      : this.productService.addProduct(this.productForm);

    request.subscribe({
      next: () => {
        this.successMessage = isEditing
          ? 'Product updated successfully.'
          : 'Product added successfully.';

        this.resetForm();
        this.saving = false;
        this.cdr.detectChanges();

        this.loadProducts();
      },

      error: () => {
        this.errorMessage =
          'Could not save product. Check the entered details and try again.';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Load a product into the form for editing
  editProduct(product: Product): void {
    this.productForm = { ...product };
    this.editingId = product.id ?? null;

    this.successMessage = '';
    this.errorMessage = '';

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // Delete a product
  deleteProduct(product: Product): void {
    if (product.id === undefined) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${product.productName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.successMessage = 'Product deleted successfully.';
        this.loadProducts();
      },

      error: () => {
        this.errorMessage = 'Could not delete this product.';
      },
    });
  }

  // Search products by name, SKU, description, or unit
  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.products;
    }

    return this.products.filter((product) =>
      [
        product.productName,
        product.sku,
        product.description,
        product.unit,
      ].some((value) => value?.toLowerCase().includes(term))
    );
  }

  // Clear the form and exit edit mode
  resetForm(): void {
    this.productForm = {
      productName: '',
      sku: '',
      description: '',
      unitPrice: 0,
      unit: '',
    };

    this.editingId = null;
  }
}