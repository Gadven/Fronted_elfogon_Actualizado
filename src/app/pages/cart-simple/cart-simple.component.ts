import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../model/order';

@Component({
  selector: 'app-cart-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-container">
      <!-- Header del Carrito -->
      <div class="cart-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Volver al Menú
          </button>
          <h1>Mi Carrito</h1>
          <div class="header-divider"></div>
        </div>
      </div>

      <!-- Carrito vacío -->
      <div *ngIf="cart.items.length === 0" class="empty-cart">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7,18C5.9,18 5,18.9 5,20S5.9,22 7,22 9,20.1 9,20 8.1,18 7,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5H5.21L4.27,3H1M17,18C15.9,18 15,18.9 15,20S15.9,22 17,22 19,20.1 19,20 18.1,18 17,18Z"/>
          </svg>
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>Descubre nuestros deliciosos platos peruanos y arma tu pedido perfecto</p>
        <button class="btn-primary" (click)="goToMenu()">Explorar Menú</button>
      </div>

      <!-- Items del carrito -->
      <div *ngIf="cart.items.length > 0" class="cart-content">
        <div class="items-section">
          <h2>Tus pedidos ({{cart.totalItems}} items)</h2>
          
          <div *ngFor="let item of cart.items" class="cart-item">
            <div class="item-info">
              <h3>{{item.product.name}}</h3>
              <p class="item-description">{{item.product.description}}</p>
              <span class="item-price">{{formatPrice(item.product.price)}} c/u</span>
            </div>
            
            <div class="item-controls">
              <div class="quantity-controls">
                <button class="qty-btn" (click)="updateQuantity(item, item.quantity - 1)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H5V11H19V13Z"/>
                  </svg>
                </button>
                <span class="quantity">{{item.quantity}}</span>
                <button class="qty-btn" (click)="updateQuantity(item, item.quantity + 1)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                  </svg>
                </button>
              </div>
              
              <div class="item-total">
                {{formatPrice(item.subtotal)}}
              </div>
              
              <button class="remove-btn" (click)="removeItem(item)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div class="order-summary">
          <h3>Resumen del Pedido</h3>
          
          <div class="summary-line">
            <span>Subtotal:</span>
            <span>{{formatPrice(cart.subtotal)}}</span>
          </div>
          
          <div class="summary-line">
            <span>Delivery:</span>
            <span>{{formatPrice(deliveryFee)}}</span>
          </div>
          
          <div class="summary-line total-line">
            <span><strong>Total:</strong></span>
            <span><strong>{{formatPrice(cart.total + deliveryFee)}}</strong></span>
          </div>
          
          <button class="checkout-btn" (click)="goToCheckout()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
            </svg>
            Proceder al Pago
          </button>
          
          <button class="clear-btn" (click)="clearCart()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6Z"/>
            </svg>
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container { padding: 0; max-width: 1400px; margin: 0 auto; background: #f8f9fa; min-height: 100vh; }
    
    .cart-header { 
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      padding: 40px 20px; margin-bottom: 30px;
      position: relative; overflow: hidden;
    }
    .cart-header::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="%23fff" stop-opacity=".1"/><stop offset="100%" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>') repeat-x;
      opacity: 0.1;
    }
    .header-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; }
    .back-btn {
      padding: 12px 20px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
      border-radius: 25px; cursor: pointer; color: white; font-weight: 600;
      display: flex; align-items: center; gap: 8px; transition: all 0.3s;
      backdrop-filter: blur(10px); margin-bottom: 20px;
    }
    .back-btn:hover { background: rgba(255,255,255,0.3); transform: translateX(-5px); }
    .cart-header h1 { 
      color: white; margin: 0; font-size: 2.8rem; font-weight: 800; 
      text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin-bottom: 15px;
    }
    .header-divider {
      width: 60px; height: 4px; background: rgba(255,255,255,0.8);
      border-radius: 2px;
    }
    
    .empty-cart { 
      text-align: center; padding: 80px 20px; color: #666; 
      background: white; margin: 20px; border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .empty-icon { 
      margin-bottom: 30px; opacity: 0.3; color: #e74c3c;
    }
    .empty-cart h2 { 
      margin-bottom: 15px; color: #2c3e50; font-weight: 700; 
      font-size: 2rem;
    }
    .empty-cart p { 
      margin-bottom: 40px; font-size: 1.2rem; color: #7f8c8d; 
      line-height: 1.6; max-width: 400px; margin-left: auto; margin-right: auto;
    }
    
    .btn-primary {
      padding: 18px 35px; 
      background: linear-gradient(135deg, #e67e22, #d35400);
      color: white; border: none; border-radius: 25px; cursor: pointer; 
      font-size: 16px; font-weight: 700; 
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .btn-primary:hover { 
      background: linear-gradient(135deg, #d68910, #a04000);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(230, 126, 34, 0.5);
    }
    
    .cart-content { 
      display: grid; grid-template-columns: 2fr 1fr; gap: 40px; 
      align-items: start; padding: 0 20px; max-width: 1200px; margin: 0 auto;
    }
    
    .items-section { 
      background: white; border-radius: 16px; padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .items-section h2 { 
      color: #2c3e50; margin-bottom: 25px; font-size: 1.8rem; 
      font-weight: 700;
    }
    
    .cart-item {
      display: grid; grid-template-columns: 1fr auto;
      align-items: center; gap: 20px; padding: 25px;
      border: 1px solid #ecf0f1; border-radius: 16px; margin-bottom: 20px;
      background: #fafafa; transition: all 0.3s;
    }
    .cart-item:hover { 
      box-shadow: 0 5px 15px rgba(231, 76, 60, 0.1);
      border-color: rgba(231, 76, 60, 0.2);
    }
    
    .item-info h3 { 
      margin: 0 0 10px 0; color: #2c3e50; font-size: 1.4rem; 
      font-weight: 700;
    }
    .item-description { 
      color: #7f8c8d; margin: 0 0 12px 0; font-size: 0.95rem; 
      line-height: 1.5;
    }
    .item-price { 
      color: #e67e22; font-weight: 600; font-size: 1rem;
    }
    
    .item-controls { 
      display: flex; flex-direction: column; align-items: center; gap: 15px;
    }
    
    .quantity-controls { 
      display: flex; align-items: center; gap: 12px;
      background: white; border-radius: 25px; padding: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .qty-btn {
      width: 38px; height: 38px; border: none; 
      background: linear-gradient(135deg, #e67e22, #d35400);
      color: white; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s;
    }
    .qty-btn:hover { 
      background: linear-gradient(135deg, #d68910, #a04000);
      transform: scale(1.1);
    }
    .quantity { 
      font-weight: 700; font-size: 1.2rem; min-width: 35px; 
      text-align: center; color: #2c3e50;
    }
    
    .item-total { 
      font-weight: 800; font-size: 1.4rem; 
      background: linear-gradient(135deg, #f39c12, #e67e22);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; color: #f39c12;
      text-align: center;
    }
    
    .remove-btn {
      background: rgba(231, 76, 60, 0.1); border: none; 
      padding: 10px; border-radius: 10px; cursor: pointer;
      color: #e74c3c; transition: all 0.3s;
    }
    .remove-btn:hover { 
      background: #e74c3c; color: white;
      transform: scale(1.1);
    }
    
    .order-summary {
      background: white; padding: 30px; border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: sticky; top: 20px;
      border: 1px solid rgba(231, 76, 60, 0.1);
    }
    .order-summary h3 { 
      margin: 0 0 25px 0; color: #2c3e50; font-size: 1.6rem;
      font-weight: 700;
    }
    
    .summary-line {
      display: flex; justify-content: space-between; margin-bottom: 18px;
      font-size: 1.1rem; color: #7f8c8d;
    }
    .summary-line span:last-child { color: #2c3e50; font-weight: 600; }
    .total-line {
      border-top: 2px solid rgba(231, 76, 60, 0.2); padding-top: 20px; margin-top: 25px;
      font-size: 1.4rem; font-weight: 800;
    }
    .total-line span {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; color: #e74c3c;
    }
    
    .checkout-btn {
      width: 100%; padding: 18px; 
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white; border: none; border-radius: 12px; cursor: pointer; 
      font-size: 16px; font-weight: 700; margin: 25px 0 15px 0;
      transition: all 0.3s; display: flex; align-items: center;
      justify-content: center; gap: 10px; text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .checkout-btn:hover { 
      background: linear-gradient(135deg, #229954, #27ae60);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
    }
    
    .clear-btn {
      width: 100%; padding: 14px; background: rgba(231, 76, 60, 0.1); 
      color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.3); 
      border-radius: 10px; cursor: pointer; font-weight: 600;
      transition: all 0.3s; display: flex; align-items: center;
      justify-content: center; gap: 8px;
    }
    .clear-btn:hover { 
      background: #e74c3c; color: white;
      transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
      .cart-header { padding: 30px 15px; }
      .cart-header h1 { font-size: 2.2rem; }
      .cart-content { 
        grid-template-columns: 1fr; gap: 25px; padding: 0 15px;
      }
      .items-section, .order-summary { padding: 20px; }
      .cart-item { 
        grid-template-columns: 1fr; text-align: center; gap: 15px;
      }
      .item-controls { flex-direction: row; justify-content: space-between; }
      .quantity-controls { order: -1; }
    }
  `]
})
export class CartSimpleComponent implements OnInit {
  cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0
  };
  deliveryFee: number = 5.00;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(item);
      return;
    }
    this.cartService.updateQuantity(item.product.idProduct, newQuantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.idProduct);
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }

  goBack(): void {
    this.router.navigate(['/menu']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  formatPrice(price: number): string {
    return `S/. ${price.toFixed(2)}`;
  }
}