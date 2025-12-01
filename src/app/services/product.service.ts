import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from './generic-service';
import { Product, ProductCategory } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {

  constructor() {
    super('/products');
  }

  // Métodos específicos para productos
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/category/${categoryId}`);
  }

  getAvailableProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/available`);
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.url}/categories`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/search?q=${query}`);
  }

  updateAvailability(productId: number, available: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${productId}/availability`, { available });
  }
}