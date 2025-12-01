import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, ProductCategory } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() {}

  // Métodos que devuelven datos de prueba
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return of([]);
  }

  getAvailableProducts(): Observable<Product[]> {
    return of([]);
  }

  getCategories(): Observable<ProductCategory[]> {
    return of([]);
  }

  searchProducts(query: string): Observable<Product[]> {
    return of([]);
  }

  updateAvailability(productId: number, available: boolean): Observable<Product> {
    return of({} as Product);
  }
}