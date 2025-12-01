import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../model/order';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0
  };

  private cartSubject = new BehaviorSubject<Cart>(this.cart);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    // Cargar carrito desde localStorage si existe
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number = 1, specialInstructions?: string): void {
    const existingItem = this.cart.items.find(item => 
      item.product.idProduct === product.idProduct && 
      item.specialInstructions === specialInstructions
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.product.price;
    } else {
      const newItem: CartItem = {
        product: product,
        quantity: quantity,
        subtotal: product.price * quantity,
        specialInstructions: specialInstructions
      };
      this.cart.items.push(newItem);
    }

    this.updateCartTotals();
  }

  removeFromCart(productId: number, specialInstructions?: string): void {
    this.cart.items = this.cart.items.filter(item => 
      !(item.product.idProduct === productId && item.specialInstructions === specialInstructions)
    );
    this.updateCartTotals();
  }

  updateQuantity(productId: number, quantity: number, specialInstructions?: string): void {
    const item = this.cart.items.find(item => 
      item.product.idProduct === productId && 
      item.specialInstructions === specialInstructions
    );
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId, specialInstructions);
      } else {
        item.quantity = quantity;
        item.subtotal = item.quantity * item.product.price;
        this.updateCartTotals();
      }
    }
  }

  clearCart(): void {
    this.cart = {
      items: [],
      totalItems: 0,
      subtotal: 0,
      total: 0
    };
    this.updateCartTotals();
  }

  getCart(): Cart {
    return this.cart;
  }

  private updateCartTotals(): void {
    this.cart.totalItems = this.cart.items.reduce((total, item) => total + item.quantity, 0);
    this.cart.subtotal = this.cart.items.reduce((total, item) => total + item.subtotal, 0);
    this.cart.total = this.cart.subtotal;
    
    this.cartSubject.next({ ...this.cart });
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    localStorage.setItem('fogon_cart', JSON.stringify(this.cart));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('fogon_cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next({ ...this.cart });
    }
  }
}