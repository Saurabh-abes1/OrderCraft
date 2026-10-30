import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InvoiceCustomer {
  id: number;
  customerName: string;
  email?: string;
}

export interface Invoice {
  id?: number;
  invoiceNumber: string;
  customer: InvoiceCustomer;
  invoiceDate: string;
  totalAmount: number;
  status: string;
}

export interface InvoiceRequest {
  customerId: number;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8082/api/invoices';

  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  createInvoice(invoice: InvoiceRequest): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(id: number, invoice: InvoiceRequest): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}