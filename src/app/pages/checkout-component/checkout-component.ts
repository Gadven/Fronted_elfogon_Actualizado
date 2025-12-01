import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material-module';
import { Cart, Order } from '../../model/order';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './checkout-component.html',
  styleUrl: './checkout-component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0
  };

  checkoutForm: FormGroup;
  isSubmitting: boolean = false;
  private cartSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.checkoutForm = this.formBuilder.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^9[0-9]{8}$/)]],
      customerEmail: ['', [Validators.email]],
      orderType: ['pickup', [Validators.required]],
      deliveryAddress: [''],
      specialInstructions: ['']
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (cart.items.length === 0) {
        this.router.navigate(['/menu']);
        this.snackBar.open('Tu carrito está vacío', 'Cerrar', { duration: 3000 });
      }
    });

    // Validación condicional para dirección de delivery
    this.checkoutForm.get('orderType')?.valueChanges.subscribe(value => {
      const deliveryAddressControl = this.checkoutForm.get('deliveryAddress');
      if (value === 'delivery') {
        deliveryAddressControl?.setValidators([Validators.required, Validators.minLength(10)]);
      } else {
        deliveryAddressControl?.clearValidators();
      }
      deliveryAddressControl?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (this.cart.items.length === 0) {
      this.snackBar.open('Tu carrito está vacío', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    const formValue = this.checkoutForm.value;
    const order: Order = {
      customerName: formValue.customerName,
      customerPhone: formValue.customerPhone,
      customerEmail: formValue.customerEmail,
      items: this.cart.items,
      totalAmount: this.cart.total,
      orderType: formValue.orderType,
      deliveryAddress: formValue.orderType === 'delivery' ? formValue.deliveryAddress : undefined,
      specialInstructions: formValue.specialInstructions,
      orderDate: new Date(),
      status: 'pending',
      estimatedTime: this.getEstimatedTime()
    };

    // Simular envío del pedido (sin backend)
    setTimeout(() => {
      this.cartService.clearCart();
      this.snackBar.open('¡Pedido enviado exitosamente! El restaurante se contactará contigo pronto.', 'Cerrar', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['/menu']);
      this.isSubmitting = false;
    }, 2000);
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
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

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validación del formulario
  get customerName() { return this.checkoutForm.get('customerName'); }
  get customerPhone() { return this.checkoutForm.get('customerPhone'); }
  get customerEmail() { return this.checkoutForm.get('customerEmail'); }
  get orderType() { return this.checkoutForm.get('orderType'); }
  get deliveryAddress() { return this.checkoutForm.get('deliveryAddress'); }
}