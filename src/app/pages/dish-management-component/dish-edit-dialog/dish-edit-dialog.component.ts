import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http'; // ✅ BACKEND ACTIVADO
import { Dish } from '../dish-management-component';

@Component({
  selector: 'app-dish-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './dish-edit-dialog.component.html',
  styleUrl: './dish-edit-dialog.component.css'
})
export class DishEditDialogComponent implements OnInit {
  private readonly API_BASE_URL = 'http://localhost:9090';

  dish: Partial<Dish> = {
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    available: true
  };

  categories = ['Platos Principales', 'Entradas', 'Aperitivos', 'Bebidas', 'Postres'];
  isEdit = false;
  // TEMPORALMENTE COMENTADO - para versión sin imágenes
  // selectedFile: File | null = null;
  // imagePreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DishEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dish: Dish | null, isEdit: boolean },
    private httpClient: HttpClient // ✅ BACKEND ACTIVADO
  ) {
    this.isEdit = data.isEdit;
    if (data.dish) {
      this.dish = { ...data.dish };
      // TEMPORALMENTE COMENTADO - para versión sin imágenes
      // this.imagePreview = this.getImageUrl(data.dish.imageUrl);
    }
  }

  ngOnInit() {}

  // TEMPORALMENTE COMENTADO - para versión sin imágenes
  /*
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Establecer el nombre del archivo como imageUrl
      this.dish.imageUrl = file.name;
    }
  }
  */

  // TEMPORALMENTE COMENTADO - para versión sin imágenes
  /*
  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      // Buscar imagen en localStorage usando el ID del plato
      if (this.dish.id) {
        const storedImage = localStorage.getItem(`plato_image_${this.dish.id}`);
        if (storedImage) {
          return storedImage;
        }
      }
      return '';
    }
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    return `assets/${imageUrl}`;
  }
  */

  // TEMPORALMENTE COMENTADO - para versión sin imágenes
  /*
  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.dish.imageUrl = '';
  }
  */

  save() {
    console.log('🔍 Método save() llamado');
    console.log('🔍 Datos del plato:', this.dish);
    console.log('🔍 Formulario válido:', this.isValidForm());
    
    if (this.isValidForm()) {
      console.log('💾 Guardando plato...');
      this.saveDishLocally();
    } else {
      console.log('❌ Formulario inválido');
      alert('Por favor completa todos los campos requeridos');
    }
  }

  // TEMPORALMENTE COMENTADO - para versión sin imágenes
  /*
  private uploadImageAndSave() {
    console.log('Guardando plato con imagen en localStorage...');
    
    // Convertir imagen a base64 para guardar en localStorage
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      
      // Generar ID único si es un plato nuevo
      if (!this.dish.id) {
        this.dish.id = Date.now(); // Usar timestamp como ID único
      }
      
      // Guardar la imagen en localStorage
      localStorage.setItem(`plato_image_${this.dish.id}`, base64Image);
      this.dish.imageUrl = base64Image;
      
      // Llamar al método normal de guardar que maneja localStorage
      this.saveDishLocally();
    };
    
    reader.readAsDataURL(this.selectedFile!);
  }
  */
  
  private saveDishLocally() {
    console.log('💾 Guardando plato localmente:', this.dish);
    
    // Generar ID si no existe
    if (!this.dish.id) {
      this.dish.id = Date.now();
    }
    
    // Asegurar que todos los campos estén completos
    const dishToSave = {
      id: this.dish.id,
      name: this.dish.name,
      description: this.dish.description,
      price: this.dish.price,
      category: this.dish.category,
      imageUrl: 'assets/default-dish.jpg', // Imagen por defecto
      available: this.dish.available ?? true
    };
    
    console.log('✅ Plato preparado para guardar:', dishToSave);
    alert('¡Plato guardado exitosamente!');
    this.dialogRef.close(dishToSave);
  }

  private saveDish() {
    // Guardar plato usando el endpoint tradicional
    const platoData = {
      nombre: this.dish.name,
      descripcion: this.dish.description,
      precio: this.dish.price,
      categoria: this.dish.category,
      estado: this.dish.available ? 'DISPONIBLE' : 'NO_DISPONIBLE'
    };
    
    console.log('Guardando plato:', platoData);
    
    this.httpClient.post(`${this.API_BASE_URL}/platos`, platoData).subscribe({
      next: (response: any) => {
        console.log('✅ Plato guardado exitosamente:', response);
        
        if (response.idPlato) {
          this.dish.id = response.idPlato;
        }
        
        alert('¡Plato guardado exitosamente!');
        this.dialogRef.close(this.dish);
      },
      error: (error) => {
        console.error('❌ Error al guardar plato:', error);
        
        if (error.status === 0) {
          alert('Error de conexión: Verifica que el backend esté corriendo');
        } else if (error.status === 400) {
          alert('Error de validación: Revisa que los datos sean correctos');
        } else {
          alert(`Error al guardar: ${error.message || 'Error desconocido'}`);
        }
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  isValidForm(): boolean {
    return !!(
      this.dish.name &&
      this.dish.description &&
      this.dish.price !== undefined &&
      this.dish.price > 0 &&
      this.dish.category
    );
  }
}