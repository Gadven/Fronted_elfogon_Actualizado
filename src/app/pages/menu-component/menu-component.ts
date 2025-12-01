import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material-module';
import { Product, ProductCategory } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css'
})
export class MenuComponent implements OnInit {
  products: Product[] = [];
  categories: ProductCategory[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: number = 0;
  searchQuery: string = '';
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.snackBar.open('Error al cargar las categorías', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAvailableProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.snackBar.open('Error al cargar el menú', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  filterByCategory(categoryId: number): void {
    this.selectedCategory = categoryId;
    if (categoryId === 0) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => 
        product.category === this.getCategoryName(categoryId)
      );
    }
  }

  searchProducts(): void {
    if (this.searchQuery.trim() === '') {
      this.filterByCategory(this.selectedCategory);
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartService.addToCart(product, quantity);
    this.snackBar.open(`${product.name} agregado al carrito`, 'Ver Carrito', {
      duration: 3000,
      panelClass: ['success-snackbar']
    }).onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.idCategory === categoryId);
    return category ? category.name : '';
  }

  formatPrice(price: number): string {
    return `S/. ${price.toFixed(2)}`;
  }
}