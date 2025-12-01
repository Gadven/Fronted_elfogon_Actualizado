import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material-module';
import { Cart, CartItem } from '../../model/order';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0
  };
  
  private cartSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }
    
    this.cartService.updateQuantity(
      item.product.idProduct, 
      newQuantity, 
      item.specialInstructions
    );
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(
      item.product.idProduct, 
      item.specialInstructions
    );
    
    this.snackBar.open(`${item.product.name} eliminado del carrito`, 'Cerrar', {
      duration: 3000
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Carrito vaciado', 'Cerrar', {
      duration: 3000
    });
  }

  continueShopping(): void {
    this.router.navigate(['/menu']);
  }

  proceedToCheckout(): void {
    if (this.cart.items.length === 0) {
      this.snackBar.open('El carrito está vacío', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    this.router.navigate(['/checkout']);
  }

  formatPrice(price: number): string {
    return `S/. ${price.toFixed(2)}`;
  }

  getEstimatedTime(): number {
    return this.cart.items.reduce((total, item) => {
      const itemTime = (item.product.preparationTime || 15) * item.quantity;
      return Math.max(total, itemTime);
    }, 0);
  }

  trackByItem(index: number, item: CartItem): string {
    return `${item.product.idProduct}-${item.specialInstructions || ''}`;
  }
}