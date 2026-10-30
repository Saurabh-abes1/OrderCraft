import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BomProduct {
  id: number;
  productName: string;
}

export interface Bom {
  id?: number;
  product: BomProduct;
  materialName: string;
  quantity: number;
  unit: string;
}

export interface BomRequest {
  productId: number;
  materialName: string;
  quantity: number;
  unit: string;
}

@Injectable({
  providedIn: 'root'
})
export class BomService {

  private apiUrl = 'http://localhost:8082/api/boms';

  constructor(private http: HttpClient) {}

  getAllBoms(): Observable<Bom[]> {
    return this.http.get<Bom[]>(this.apiUrl);
  }

  getBomsByProductId(productId: number): Observable<Bom[]> {
    return this.http.get<Bom[]>(`${this.apiUrl}/product/${productId}`);
  }

  createBom(bom: BomRequest): Observable<Bom> {
    return this.http.post<Bom>(this.apiUrl, bom);
  }

  updateBom(id: number, bom: BomRequest): Observable<Bom> {
    return this.http.put<Bom>(`${this.apiUrl}/${id}`, bom);
  }

  deleteBom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}