import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentInvoice {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
}

export interface Payment {
  id?: number;
  invoice: PaymentInvoice;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

export interface PaymentRequest {
  invoiceId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8082/api/payments';

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  createPayment(payment: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
