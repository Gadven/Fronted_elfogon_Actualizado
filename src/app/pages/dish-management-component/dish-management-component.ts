import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DishEditDialogComponent } from './dish-edit-dialog/dish-edit-dialog.component';
// import { DishBackendService } from '../../services/dish-backend-service'; // ✅ DESCOMENTA CUANDO TENGAS TU BACKEND

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

@Component({
  selector: 'app-dish-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './dish-management-component.html',
  styleUrl: './dish-management-component.css'
})
export class DishManagementComponent implements OnInit {

  dishes: Dish[] = [
    {
      id: 1,
      name: 'Pollo a la Brasa',
      description: 'Delicioso pollo a la brasa con papas fritas y ensalada',
      price: 25.00,
      category: 'Platos Principales',
      imageUrl: 'Pollo_brasa.jpg',
      available: true
    },
    {
      id: 2,
      name: 'Ceviche Mixto',
      description: 'Fresco ceviche con pescado y mariscos del día',
      price: 22.00,
      category: 'Entradas',
      imageUrl: 'Ceviche_mixto.jpg',
      available: true
    },
    {
      id: 3,
      name: 'Choclo con Queso',
      description: 'Tradicional choclo peruano con queso fresco',
      price: 12.00,
      category: 'Aperitivos',
      imageUrl: 'Choclo_queso.jpg',
      available: true
    },
    {
      id: 4,
      name: 'Humitas',
      description: 'Deliciosas humitas caseras dulces o saladas',
      price: 8.00,
      category: 'Aperitivos',
      imageUrl: 'Humitas.jpg',
      available: true
    },
    {
      id: 5,
      name: 'Inca Kola',
      description: 'La bebida dorada del Perú',
      price: 5.00,
      category: 'Bebidas',
      imageUrl: 'Yuyo.jpg',
      available: true
    },
    {
      id: 6,
      name: 'Yuyo y Trigo',
      description: 'Bebida natural de yuyo con trigo',
      price: 4.00,
      category: 'Bebidas',
      imageUrl: 'Yuyo.jpg',
      available: true
    }
  ];

  categories = ['Platos Principales', 'Entradas', 'Aperitivos', 'Bebidas', 'Postres'];
  filteredDishes: Dish[] = [];
  selectedCategory = '';
  searchTerm = '';

  constructor(
    private dialog: MatDialog
    // private dishBackendService: DishBackendService // ✅ DESCOMENTA CUANDO TENGAS TU BACKEND
  ) {}

  ngOnInit() {
    this.loadDishes();
    this.filteredDishes = [...this.dishes];
  }

  loadDishes() {
    // ✅ MÉTODO PARA TU BACKEND - Descomenta cuando esté listo
    /*
    this.dishBackendService.getAllDishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        this.filterDishes();
      },
      error: (error) => {
        console.error('Error cargando platos desde backend:', error);
        this.loadDishesFromLocalStorage(); // Fallback a localStorage
      }
    });
    */
    
    // 🔄 FUNCIONAMIENTO ACTUAL - Solo localStorage
    this.loadDishesFromLocalStorage();
  }

  private loadDishesFromLocalStorage() {
    const storedDishes = localStorage.getItem('dishes');
    if (storedDishes) {
      this.dishes = JSON.parse(storedDishes);
    }
    this.filterDishes();
  }

  saveDishes() {
    localStorage.setItem('dishes', JSON.stringify(this.dishes));
  }

  filterDishes() {
    this.filteredDishes = this.dishes.filter(dish => {
      const matchesCategory = !this.selectedCategory || dish.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm || 
        dish.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  onCategoryChange() {
    this.filterDishes();
  }

  onSearchChange() {
    this.filterDishes();
  }

  addDish() {
    const dialogRef = this.dialog.open(DishEditDialogComponent, {
      width: '600px',
      data: { dish: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ MÉTODO PARA TU BACKEND - Descomenta cuando esté listo
        /*
        this.dishBackendService.createDish(result).subscribe({
          next: (newDish) => {
            this.dishes.push(newDish);
            this.filterDishes();
            console.log('Plato creado exitosamente:', newDish);
          },
          error: (error) => {
            console.error('Error creando plato:', error);
            alert('Error al crear el plato. Intenta nuevamente.');
          }
        });
        */

        // 🔄 FUNCIONAMIENTO ACTUAL - Solo localStorage
        const newId = Math.max(...this.dishes.map(d => d.id), 0) + 1;
        const newDish: Dish = { ...result, id: newId };
        this.dishes.push(newDish);
        this.saveDishes();
        this.filterDishes();
        console.log('Plato agregado localmente - Listo para backend:', newDish);
      }
    });
  }

  editDish(dish: Dish) {
    const dialogRef = this.dialog.open(DishEditDialogComponent, {
      width: '600px',
      data: { dish: { ...dish }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // ✅ MÉTODO PARA TU BACKEND - Descomenta cuando esté listo
        /*
        this.dishBackendService.updateDish(dish.id, result).subscribe({
          next: (updatedDish) => {
            const index = this.dishes.findIndex(d => d.id === dish.id);
            if (index !== -1) {
              this.dishes[index] = updatedDish;
              this.filterDishes();
              console.log('Plato actualizado exitosamente:', updatedDish);
            }
          },
          error: (error) => {
            console.error('Error actualizando plato:', error);
            alert('Error al actualizar el plato. Intenta nuevamente.');
          }
        });
        */

        // 🔄 FUNCIONAMIENTO ACTUAL - Solo localStorage
        const index = this.dishes.findIndex(d => d.id === dish.id);
        if (index !== -1) {
          this.dishes[index] = { ...result, id: dish.id };
          this.saveDishes();
          this.filterDishes();
          console.log('Plato actualizado localmente - Listo para backend:', result);
        }
      }
    });
  }

  deleteDish(dish: Dish) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${dish.name}"?`)) {
      // ✅ MÉTODO PARA TU BACKEND - Descomenta cuando esté listo
      /*
      this.dishBackendService.deleteDish(dish.id).subscribe({
        next: () => {
          const index = this.dishes.findIndex(d => d.id === dish.id);
          if (index !== -1) {
            this.dishes.splice(index, 1);
            this.filterDishes();
            console.log('Plato eliminado exitosamente');
          }
        },
        error: (error) => {
          console.error('Error eliminando plato:', error);
          alert('Error al eliminar el plato. Intenta nuevamente.');
        }
      });
      */

      // 🔄 FUNCIONAMIENTO ACTUAL - Solo localStorage
      const index = this.dishes.findIndex(d => d.id === dish.id);
      if (index !== -1) {
        this.dishes.splice(index, 1);
        this.saveDishes();
        this.filterDishes();
        console.log('Plato eliminado localmente - Listo para backend');
      }
    }
  }

  toggleAvailability(dish: Dish) {
    dish.available = !dish.available;
    this.saveDishes();
  }

  getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `assets/${imageUrl}`;
  }

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Platos Principales': 'restaurant',
      'Entradas': 'local_dining',
      'Aperitivos': 'tapas',
      'Bebidas': 'local_bar',
      'Postres': 'cake'
    };
    return iconMap[category] || 'fastfood';
  }
}