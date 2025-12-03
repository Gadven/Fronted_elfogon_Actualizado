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
    // Datos de prueba para categorías
    this.categories = [
      { idCategory: 1, name: 'Platos Principales', description: 'Comida contundente' },
      { idCategory: 2, name: 'Entradas', description: 'Aperitivos y entradas' },
      { idCategory: 3, name: 'Bebidas', description: 'Refrescos y jugos' },
      { idCategory: 4, name: 'Postres', description: 'Dulces y postres' }
    ];
  }

  loadProducts(): void {
    this.loading = true;
    
    // Simular una pequeña carga
    setTimeout(() => {
      // Datos de prueba para productos
      this.products = [
        {
          idProduct: 1,
          name: 'Pollo a la Brasa',
          description: 'Delicioso pollo a la brasa con papas fritas y ensalada',
          price: 25.00,
          category: 'Platos Principales',
          imageUrl: '',
          available: true,
          preparationTime: 25
        },
        {
          idProduct: 2,
          name: 'Ceviche Mixto',
          description: 'Fresco ceviche de pescado y mariscos con camote y choclo',
          price: 30.00,
          category: 'Platos Principales',
          imageUrl: '',
          available: true,
          preparationTime: 15
        },
        {
          idProduct: 3,
          name: 'Choclo con Queso',
          description: 'Choclo tierno acompañado con queso fresco',
          price: 8.00,
          category: 'Entradas',
          imageUrl: '',
          available: true,
          preparationTime: 10
        },
        {
          idProduct: 4,
          name: 'Humitas',
          description: 'Humitas caseras envueltas en chala de choclo',
          price: 6.00,
          category: 'Entradas',
          imageUrl: '',
          available: true,
          preparationTime: 8
        },
        {
          idProduct: 5,
          name: 'Inca Kola',
          description: 'La bebida del sabor nacional',
          price: 5.00,
          category: 'Bebidas',
          imageUrl: '',
          available: true,
          preparationTime: 2
        },
        {
          idProduct: 6,
          name: 'Yuyo en Crema',
          description: 'Tradicional yuyo preparado en crema',
          price: 18.00,
          category: 'Platos Principales',
          imageUrl: '',
          available: true,
          preparationTime: 20
        }
      ];
      
      this.filteredProducts = this.products;
      this.loading = false;
    }, 1000);
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