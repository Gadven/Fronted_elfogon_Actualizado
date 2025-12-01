import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from '../pages/dish-management-component/dish-management-component';

@Injectable({
  providedIn: 'root'
})
export class DishBackendService {
  
  // ✅ CONFIGURACIÓN PARA TU BACKEND - Actualiza estas URLs cuando tengas tu servidor
  private readonly API_BASE_URL = 'http://localhost:8080/api'; // Cambia por tu URL
  private readonly DISHES_ENDPOINT = `${this.API_BASE_URL}/dishes`;
  private readonly UPLOAD_ENDPOINT = `${this.API_BASE_URL}/dishes/upload`;

  constructor(private http: HttpClient) {}

  // ========== MÉTODOS PREPARADOS PARA TU BACKEND ==========

  /**
   * 📊 Obtener todos los platos desde el backend
   */
  getAllDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.DISHES_ENDPOINT);
  }

  /**
   * 🍽️ Obtener un plato específico por ID
   */
  getDishById(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.DISHES_ENDPOINT}/${id}`);
  }

  /**
   * ➕ Crear un nuevo plato
   */
  createDish(dish: Omit<Dish, 'id'>): Observable<Dish> {
    return this.http.post<Dish>(this.DISHES_ENDPOINT, dish);
  }

  /**
   * ✏️ Actualizar un plato existente
   */
  updateDish(id: number, dish: Partial<Dish>): Observable<Dish> {
    return this.http.put<Dish>(`${this.DISHES_ENDPOINT}/${id}`, dish);
  }

  /**
   * 🗑️ Eliminar un plato
   */
  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.DISHES_ENDPOINT}/${id}`);
  }

  /**
   * 📸 Subir imagen de plato
   * @param file - Archivo de imagen
   * @param dishData - Datos del plato (opcional)
   */
  uploadDishImage(file: File, dishData?: any): Observable<{imageUrl: string, message: string}> {
    const formData = new FormData();
    formData.append('image', file);
    
    if (dishData) {
      formData.append('dishData', JSON.stringify(dishData));
    }

    return this.http.post<{imageUrl: string, message: string}>(this.UPLOAD_ENDPOINT, formData);
  }

  /**
   * 🔄 Crear plato con imagen (operación completa)
   */
  createDishWithImage(dishData: Omit<Dish, 'id'>, imageFile?: File): Observable<Dish> {
    if (imageFile) {
      const formData = new FormData();
      formData.append('dishData', JSON.stringify(dishData));
      formData.append('image', imageFile);
      
      return this.http.post<Dish>(`${this.DISHES_ENDPOINT}/with-image`, formData);
    } else {
      return this.createDish(dishData);
    }
  }

  /**
   * 🔄 Actualizar plato con imagen (operación completa)
   */
  updateDishWithImage(id: number, dishData: Partial<Dish>, imageFile?: File): Observable<Dish> {
    if (imageFile) {
      const formData = new FormData();
      formData.append('dishData', JSON.stringify(dishData));
      formData.append('image', imageFile);
      
      return this.http.put<Dish>(`${this.DISHES_ENDPOINT}/${id}/with-image`, formData);
    } else {
      return this.updateDish(id, dishData);
    }
  }

  /**
   * 🔍 Buscar platos
   */
  searchDishes(query: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.DISHES_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * 📂 Obtener platos por categoría
   */
  getDishesByCategory(category: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.DISHES_ENDPOINT}/category/${encodeURIComponent(category)}`);
  }

  /**
   * 👁️ Toggle disponibilidad de plato
   */
  toggleDishAvailability(id: number): Observable<Dish> {
    return this.http.patch<Dish>(`${this.DISHES_ENDPOINT}/${id}/toggle-availability`, {});
  }

  // ========== CONFIGURACIÓN Y UTILIDADES ==========

  /**
   * 🔧 Configurar headers personalizados si es necesario
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.getAuthToken()}` // Si usas autenticación
    });
  }

  /**
   * 🔐 Obtener token de autenticación (si lo usas)
   */
  // private getAuthToken(): string {
  //   return localStorage.getItem('authToken') || '';
  // }

  /**
   * 🌐 Obtener URL completa de imagen
   */
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.API_BASE_URL}/images/${imagePath}`;
  }
}