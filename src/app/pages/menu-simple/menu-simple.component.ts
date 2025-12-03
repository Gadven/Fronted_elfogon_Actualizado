import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DishService } from '../../services/dish-service';
import { Dish } from '../dish-management-component/dish-management-component';

@Component({
  selector: 'app-menu-simple',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="menu-container">
      <!-- Header del Menú -->
      <div class="menu-header">
        <div class="header-content">
          <h1>Menú El Fogón</h1>
          <div class="header-divider"></div>
          <p class="subtitle">Auténtica cocina peruana</p>
        </div>
      </div>

      <!-- Barra de búsqueda -->
      <div class="search-section">
        <div class="search-container">
          <input 
            [(ngModel)]="searchQuery" 
            (keyup.enter)="searchProducts()" 
            placeholder="Buscar en nuestro menú..."
            class="search-input">
          <button (click)="searchProducts()" class="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14M9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Filtros por categoría -->
      <div class="category-filters">
        <button 
          [class]="'category-chip ' + (selectedCategory === '' ? 'selected' : '')" 
          (click)="filterByCategory('')">
          Todos
        </button>
        <button 
          *ngFor="let category of categories" 
          [class]="'category-chip ' + (selectedCategory === category ? 'selected' : '')"
          (click)="filterByCategory(category)">
          {{category}}
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando nuestro menú...</p>
      </div>

      <!-- Grid de platos -->
      <div *ngIf="!loading && filteredDishes.length > 0" class="products-grid">
        <div *ngFor="let dish of filteredDishes" class="product-card">
          <!-- Imagen del plato - COMENTADA por eliminar funcionalidad de imagen -->
          <!--
          <div class="product-image">
            <img [src]="getImageUrl(dish.imageUrl)" 
                 [alt]="dish.name"
                 onerror="this.src='assets/default-dish.svg'">
            <div class="image-overlay"></div>
          </div>
          -->

          <!-- Contenido del plato -->
          <div class="product-info">
            <h3 class="product-name">{{dish.name}}</h3>
            <p class="product-description">{{dish.description}}</p>
            
            <div class="product-meta">
              <span class="preparation-time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
                </svg>
                15 min
              </span>
              <span class="dish-category">{{dish.category}}</span>
            </div>
            
            <div class="product-footer">
              <span class="product-price">{{formatPrice(dish.price)}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No hay platos -->
      <div *ngIf="!loading && filteredDishes.length === 0" class="no-products">
        <div class="no-products-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
        </div>
        <h2>No se encontraron platos</h2>
        <p>Intenta con otra búsqueda o selecciona una categoría diferente</p>
        <button class="btn-primary" (click)="searchQuery = ''; filterByCategory('')">
          Ver todo el menú
        </button>
      </div>


    </div>
  `,
  styles: [`
    .menu-container { padding: 0; max-width: 1400px; margin: 0 auto; background: #f8f9fa; }
    
    .menu-header { 
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      padding: 60px 20px; text-align: center; margin-bottom: 40px;
      position: relative; overflow: hidden;
    }
    .menu-header::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="%23fff" stop-opacity=".1"/><stop offset="100%" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>') repeat-x;
      opacity: 0.1;
    }
    
    .header-content { position: relative; z-index: 2; }
    .menu-header h1 { 
      color: white; font-size: 3.5rem; margin-bottom: 15px; 
      font-weight: 400; letter-spacing: 2px; 
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      font-family: 'Georgia', 'Times New Roman', serif;
      font-style: italic;
    }
    .header-divider {
      width: 80px; height: 4px; background: rgba(255,255,255,0.8);
      margin: 20px auto; border-radius: 2px;
    }
    .subtitle { 
      color: rgba(255,255,255,0.95); font-size: 1.2rem; margin: 0; 
      font-weight: 300; letter-spacing: 3px; text-transform: capitalize;
      font-family: 'Georgia', 'Times New Roman', serif;
      font-style: italic;
    }
    
    .search-section { 
      padding: 0 20px; margin-bottom: 40px; 
      display: flex; justify-content: center;
    }
    .search-container {
      display: flex; max-width: 500px; width: 100%;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12); border-radius: 50px;
      overflow: hidden; background: white;
    }
    .search-input { 
      flex: 1; padding: 18px 25px; border: none; font-size: 16px;
      outline: none; background: transparent;
    }
    .search-input::placeholder { color: #bdc3c7; }
    .search-btn { 
      padding: 18px 25px; background: #d35400; color: white; 
      border: none; cursor: pointer; display: flex; align-items: center;
      transition: all 0.3s; min-width: 60px; justify-content: center;
    }
    .search-btn:hover { background: #a04000; }
    
    .category-filters { 
      display: flex; justify-content: center; flex-wrap: wrap; 
      gap: 15px; margin-bottom: 40px; padding: 0 20px;
    }
    .category-chip {
      padding: 12px 24px; border: 2px solid transparent; background: white;
      border-radius: 25px; cursor: pointer; 
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      font-weight: 600; letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    .category-chip.selected { 
      background: linear-gradient(135deg, #e67e22, #d35400); 
      color: white; border-color: transparent;
      box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
    }
    .category-chip:hover { 
      background: #f8f9fa; transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .category-chip.selected:hover { 
      background: linear-gradient(135deg, #d68910, #a04000);
      transform: translateY(-2px);
    }
    
    .loading-container { 
      text-align: center; padding: 80px 20px; 
      background: white; margin: 20px; border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .spinner {
      width: 50px; height: 50px; border: 5px solid #f3f3f3;
      border-top: 5px solid #e74c3c; border-radius: 50%;
      animation: spin 1s linear infinite; margin: 0 auto 25px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .loading-container p { 
      color: #7f8c8d; font-size: 1.1rem; font-weight: 500; 
    }
    
    .products-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 400px));
      gap: 30px; padding: 0 20px; margin-top: 20px; justify-content: center;
    }
    .product-card {
      background: white; border-radius: 16px; overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      border-top: 4px solid #e67e22;
    }
    .product-card:hover { 
      transform: translateY(-8px); 
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    /* Estilos para imágenes - COMENTADOS para eliminar funcionalidad
    .product-image { 
      height: 220px; overflow: hidden; position: relative;
    }
    .product-image img { 
      width: 100%; height: 100%; object-fit: contain; 
      transition: transform 0.4s; background: #f8f9fa;
    }
    .product-card:hover .product-image img { transform: scale(1.05); }
    .image-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.1));
    }
    */
    
    .product-info { padding: 24px; }
    .product-name { 
      color: #2c3e50; font-size: 1.5rem; font-weight: 700; 
      margin: 0 0 12px 0; line-height: 1.3;
    }
    .product-description { 
      color: #7f8c8d; margin-bottom: 16px; line-height: 1.6; 
      font-size: 0.95rem; height: 48px; overflow: hidden;
    }
    .product-meta {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
    }
    .preparation-time { 
      color: #95a5a6; font-size: 0.9rem; font-weight: 500;
      display: flex; align-items: center; gap: 6px;
    }
    .dish-category {
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white; padding: 4px 8px; border-radius: 12px;
      font-size: 0.75rem; font-weight: bold; text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .product-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 16px; border-top: 1px solid #ecf0f1;
    }
    .product-price { 
      font-size: 1.6rem; font-weight: 800; 
      background: linear-gradient(135deg, #f39c12, #e67e22);
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; color: #f39c12;
    }
    

    
    .no-products { 
      text-align: center; padding: 80px 20px; color: #666; 
      background: white; margin: 20px; border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .no-products-icon { 
      font-size: 4rem; margin-bottom: 30px; opacity: 0.3; 
      color: #bdc3c7;
    }
    .no-products h2 { 
      margin-bottom: 15px; color: #2c3e50; font-weight: 600; 
      font-size: 1.8rem;
    }
    .no-products p { 
      margin-bottom: 40px; font-size: 1.1rem; color: #7f8c8d; 
      line-height: 1.6;
    }
    
    .btn-primary {
      padding: 16px 32px; 
      background: linear-gradient(135deg, #e67e22, #d35400);
      color: white; border: none; border-radius: 25px; cursor: pointer; 
      font-size: 16px; font-weight: 600; 
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
    }
    .btn-primary:hover { 
      background: linear-gradient(135deg, #d68910, #a04000);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(230, 126, 34, 0.5);
    }
    

    
    @media (max-width: 768px) {
      .menu-header { padding: 40px 20px; }
      .menu-header h1 { font-size: 2.5rem; }
      .search-container { max-width: 100%; }
      .products-grid { 
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        gap: 20px; padding: 0 15px; 
      }
      .category-filters { gap: 10px; }
      .category-chip { padding: 10px 20px; font-size: 14px; }
    }
  `]
})
export class MenuSimpleComponent implements OnInit {
  dishes: Dish[] = [];
  categories: string[] = [];
  filteredDishes: Dish[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';
  loading: boolean = true;

  constructor(
    private dishService: DishService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadDishes();
  }

  loadCategories(): void {
    this.categories = ['Platos Principales', 'Entradas', 'Aperitivos', 'Bebidas', 'Postres'];
  }

  loadDishes(): void {
    this.loading = true;
    
    setTimeout(() => {
      this.dishes = this.dishService.getAvailableDishes();
      this.filteredDishes = this.dishes;
      this.loading = false;
    }, 500);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (!category) {
      this.filteredDishes = this.dishes;
    } else {
      this.filteredDishes = this.dishes.filter(dish => dish.category === category);
    }
    this.applySearch();
  }

  searchProducts(): void {
    this.applySearch();
  }

  private applySearch(): void {
    let filtered = this.selectedCategory ? 
      this.dishes.filter(dish => dish.category === this.selectedCategory) : 
      this.dishes;
    
    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter(dish =>
        dish.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    this.filteredDishes = filtered;
  }



  formatPrice(price: number): string {
    return `S/. ${price.toFixed(2)}`;
  }

  getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `assets/${imageUrl}`;
  }
}