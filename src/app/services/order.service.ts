import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from './generic-service';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends GenericService<Order> {

  constructor() {
    super('/orders');
  }

  // Métodos específicos para pedidos
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.url, order);
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/status/${status}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.url}/${orderId}/status`, { status });
  }

  getOrdersByDate(date: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/date/${date}`);
  }

  getOrdersByCustomerPhone(phone: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/customer/${phone}`);
  }
}