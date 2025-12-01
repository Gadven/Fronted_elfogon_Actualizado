import { Injectable } from '@angular/core';
import { Dish } from '../pages/dish-management-component/dish-management-component';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private readonly STORAGE_KEY = 'dishes';

  private defaultDishes: Dish[] = [
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

  constructor() {
    this.initializeDefaultDishes();
  }

  private initializeDefaultDishes() {
    const existingDishes = localStorage.getItem(this.STORAGE_KEY);
    if (!existingDishes) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultDishes));
    }
  }

  getDishes(): Dish[] {
    const dishes = localStorage.getItem(this.STORAGE_KEY);
    return dishes ? JSON.parse(dishes) : this.defaultDishes;
  }

  getAvailableDishes(): Dish[] {
    return this.getDishes().filter(dish => dish.available);
  }

  getDish(id: number): Dish | undefined {
    return this.getDishes().find(dish => dish.id === id);
  }

  addDish(dish: Omit<Dish, 'id'>): Dish {
    const dishes = this.getDishes();
    const newId = Math.max(...dishes.map(d => d.id), 0) + 1;
    const newDish: Dish = {
      ...dish,
      id: newId
    };
    dishes.push(newDish);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dishes));
    return newDish;
  }

  updateDish(id: number, updatedDish: Partial<Dish>): boolean {
    const dishes = this.getDishes();
    const index = dishes.findIndex(dish => dish.id === id);
    if (index !== -1) {
      dishes[index] = { ...dishes[index], ...updatedDish, id };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dishes));
      return true;
    }
    return false;
  }

  deleteDish(id: number): boolean {
    const dishes = this.getDishes();
    const index = dishes.findIndex(dish => dish.id === id);
    if (index !== -1) {
      dishes.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dishes));
      return true;
    }
    return false;
  }

  toggleAvailability(id: number): boolean {
    const dishes = this.getDishes();
    const dish = dishes.find(d => d.id === id);
    if (dish) {
      dish.available = !dish.available;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dishes));
      return true;
    }
    return false;
  }

  getDishesByCategory(category: string): Dish[] {
    return this.getDishes().filter(dish => dish.category === category);
  }

  searchDishes(searchTerm: string): Dish[] {
    const term = searchTerm.toLowerCase();
    return this.getDishes().filter(dish => 
      dish.name.toLowerCase().includes(term) ||
      dish.description.toLowerCase().includes(term) ||
      dish.category.toLowerCase().includes(term)
    );
  }

  getCategories(): string[] {
    const dishes = this.getDishes();
    const categories = new Set(dishes.map(dish => dish.category));
    return Array.from(categories).sort();
  }

  saveDishes(dishes: Dish[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dishes));
  }
}