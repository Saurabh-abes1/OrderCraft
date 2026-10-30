import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Customer,
  CustomerService,
} from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {

  customers: Customer[] = [];
  searchTerm = '';

  customerForm: Customer = {
    customerName: '',
    email: '',
    phone: '',
    companyName: '',
  };

  editingId: number | null = null;

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Load all customers from the backend
  loadCustomers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage =
          'Could not load customers. Check that the Spring Boot backend is running.';

        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // Add a new customer or update an existing customer
  saveCustomer(): void {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const isEditing = this.editingId !== null;

    const request = isEditing
      ? this.customerService.updateCustomer(
          this.editingId!,
          this.customerForm
        )
      : this.customerService.addCustomer(this.customerForm);

    request.subscribe({
      next: () => {
        this.successMessage = isEditing
          ? 'Customer updated successfully.'
          : 'Customer added successfully.';

        this.resetForm();

        this.saving = false;

        this.cdr.detectChanges();

        this.loadCustomers();
      },

      error: () => {
        this.errorMessage =
          'Could not save customer. Check the entered details and try again.';

        this.saving = false;

        this.cdr.detectChanges();
      },
    });
  }

  // Load customer details into the form for editing
  editCustomer(customer: Customer): void {

    this.customerForm = {
      customerName: customer.customerName,
      email: customer.email,
      phone: customer.phone,
      companyName: customer.companyName,
    };

    this.editingId = customer.id ?? null;

    this.successMessage = '';
    this.errorMessage = '';

    // Force Angular to update the form immediately
    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // Delete a customer
  deleteCustomer(customer: Customer): void {

    if (customer.id === undefined) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${customer.customerName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.customerService.deleteCustomer(customer.id).subscribe({
      next: () => {
        this.successMessage = 'Customer deleted successfully.';

        this.cdr.detectChanges();

        this.loadCustomers();
      },

      error: () => {
        this.errorMessage = 'Could not delete this customer.';

        this.cdr.detectChanges();
      },
    });
  }

  // Filter customers using the search field
  get filteredCustomers(): Customer[] {

    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.customers;
    }

    return this.customers.filter((customer) =>
      [
        customer.customerName,
        customer.companyName,
        customer.email,
        customer.phone,
      ].some((value) =>
        value?.toLowerCase().includes(term)
      )
    );
  }

  // Clear the form and exit edit mode
  resetForm(): void {

    this.customerForm = {
      customerName: '',
      email: '',
      phone: '',
      companyName: '',
    };

    this.editingId = null;

    this.cdr.detectChanges();
  }
}