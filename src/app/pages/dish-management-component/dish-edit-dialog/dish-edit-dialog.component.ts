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
// import { HttpClient } from '@angular/common/http'; // ✅ DESCOMENTA CUANDO TENGAS TU BACKEND
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
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DishEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dish: Dish | null, isEdit: boolean }
    // private httpClient: HttpClient // ✅ DESCOMENTA CUANDO TENGAS TU BACKEND
  ) {
    this.isEdit = data.isEdit;
    if (data.dish) {
      this.dish = { ...data.dish };
      this.imagePreview = this.getImageUrl(data.dish.imageUrl);
    }
  }

  ngOnInit() {}

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

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    return `assets/${imageUrl}`;
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.dish.imageUrl = '';
  }

  save() {
    if (this.isValidForm()) {
      if (this.selectedFile) {
        // ✅ PREPARADO PARA TU BACKEND - Descomenta cuando tengas el servidor
        // this.uploadImageAndSave();
        
        // 🔄 FUNCIONAMIENTO ACTUAL - Solo para testing sin backend
        console.log('Archivo seleccionado:', this.selectedFile.name);
        console.log('Listo para subir al backend cuando esté conectado');
        this.dish.imageUrl = this.selectedFile.name; // Temporal
      }
      
      this.dialogRef.close(this.dish);
    }
  }

  // ✅ MÉTODO PREPARADO PARA TU BACKEND - Descomenta cuando esté listo
  /*
  private uploadImageAndSave() {
    const formData = new FormData();
    formData.append('image', this.selectedFile!);
    formData.append('dishData', JSON.stringify(this.dish));
    
    // Llamada a tu API backend
    this.httpClient.post('/api/dishes/upload', formData).subscribe({
      next: (response: any) => {
        this.dish.imageUrl = response.imageUrl; // URL devuelta por tu servidor
        this.dialogRef.close(this.dish);
      },
      error: (error) => {
        console.error('Error al subir imagen:', error);
        alert('Error al subir la imagen. Intenta nuevamente.');
      }
    });
  }
  */

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