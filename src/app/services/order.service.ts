import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() {}

  // Métodos que devuelven datos de prueba
  createOrder(order: Order): Observable<Order> {
    return of({ ...order, idOrder: 1 });
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return of([]);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return of({} as Order);
  }

  getOrdersByDate(date: string): Observable<Order[]> {
    return of([]);
  }

  getOrdersByCustomerPhone(phone: string): Observable<Order[]> {
    return of([]);
  }
}