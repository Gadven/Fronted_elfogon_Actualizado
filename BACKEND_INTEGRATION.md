# 🚀 INTEGRACIÓN CON BACKEND - El Fogón

## 📋 **ESTADO ACTUAL**
- ✅ **Frontend funcional** con localStorage
- ✅ **Código preparado** para backend
- ✅ **Servicios listos** para integración
- 🔄 **Esperando conexión** a tu backend

---

## 🔧 **PASOS PARA CONECTAR TU BACKEND**

### **1. Configurar URLs del Backend**
Edita el archivo: `src/app/services/dish-backend-service.ts`

```typescript
// Cambia estas URLs por las de tu backend
private readonly API_BASE_URL = 'http://localhost:8080/api'; // TU URL AQUÍ
private readonly DISHES_ENDPOINT = `${this.API_BASE_URL}/dishes`;
private readonly UPLOAD_ENDPOINT = `${this.API_BASE_URL}/dishes/upload`;
```

### **2. Activar el Servicio Backend**
En `src/app/pages/dish-management-component/dish-management-component.ts`:

**Descomenta estas líneas:**
```typescript
// import { DishBackendService } from '../../services/dish-backend-service'; // ✅ DESCOMENTA
// private dishBackendService: DishBackendService // ✅ DESCOMENTA
```

### **3. Activar Métodos del Backend**
En el mismo archivo, **descomenta los bloques** marcados con:
```typescript
// ✅ MÉTODO PARA TU BACKEND - Descomenta cuando esté listo
/*  <-- ELIMINA ESTE COMENTARIO
... código del backend ...
*/  <-- ELIMINA ESTE COMENTARIO
```

### **4. Activar Upload de Imágenes**
En `src/app/pages/dish-management-component/dish-edit-dialog/dish-edit-dialog.component.ts`:

**Descomenta:**
```typescript
// import { HttpClient } from '@angular/common/http'; // ✅ DESCOMENTA
// private httpClient: HttpClient // ✅ DESCOMENTA
// this.uploadImageAndSave(); // ✅ DESCOMENTA
```

### **5. Configurar HttpClient**
En `src/app/app.config.ts`, asegúrate de tener:
```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers ...
    provideHttpClient(), // ✅ NECESARIO PARA BACKEND
  ]
};
```

---

## 🗄️ **ESTRUCTURA DE API ESPERADA**

Tu backend debería tener estos endpoints:

### **Platos (Dishes)**
```
GET    /api/dishes                    # Obtener todos los platos
GET    /api/dishes/{id}               # Obtener plato por ID
POST   /api/dishes                    # Crear nuevo plato
PUT    /api/dishes/{id}               # Actualizar plato
DELETE /api/dishes/{id}               # Eliminar plato
GET    /api/dishes/search?q={query}   # Buscar platos
GET    /api/dishes/category/{cat}     # Platos por categoría
PATCH  /api/dishes/{id}/toggle-availability # Toggle disponibilidad
```

### **Subida de Imágenes**
```
POST   /api/dishes/upload             # Subir imagen sola
POST   /api/dishes/with-image         # Crear plato con imagen
PUT    /api/dishes/{id}/with-image    # Actualizar plato con imagen
```

### **Respuestas Esperadas**

**Plato (Dish):**
```json
{
  "id": 1,
  "name": "Pollo a la Brasa",
  "description": "Delicioso pollo a la brasa...",
  "price": 25.00,
  "category": "Platos Principales",
  "imageUrl": "uploads/pollo-brasa.jpg",
  "available": true
}
```

**Upload de Imagen:**
```json
{
  "imageUrl": "uploads/imagen-123.jpg",
  "message": "Imagen subida exitosamente"
}
```

---

## 🔄 **MIGRACIÓN DE DATOS**

Los datos actuales están en **localStorage**. Cuando conectes el backend:

1. **Exportar datos actuales:**
```javascript
// En el navegador (F12 > Console):
const dishes = JSON.parse(localStorage.getItem('dishes') || '[]');
console.log(JSON.stringify(dishes, null, 2));
```

2. **Importar al backend:**
   - Copia los datos
   - Insértalos en tu base de datos
   - O crea un endpoint temporal para importar

---

## ✅ **VERIFICACIÓN**

Una vez conectado el backend, verifica:

- [ ] **Carga de platos** desde la base de datos
- [ ] **Crear nuevos platos** se guarda en BD
- [ ] **Editar platos** actualiza en BD
- [ ] **Eliminar platos** borra de BD
- [ ] **Subida de imágenes** funciona correctamente
- [ ] **Imágenes se muestran** desde el servidor

---

## 🚨 **TROUBLESHOOTING**

### **Error CORS:**
Configura CORS en tu backend para permitir:
```
Origin: http://localhost:4201
Methods: GET, POST, PUT, DELETE, PATCH
Headers: Content-Type, Authorization
```

### **Error 404:**
Verifica que las URLs en `dish-backend-service.ts` coincidan con tu backend.

### **Error Upload:**
Asegúrate de que tu backend acepte `FormData` con:
- `image` (File)
- `dishData` (JSON string)

---

## 📞 **ESTADO ACTUAL: LISTO PARA TU BACKEND**

El sistema está **100% preparado**. Solo necesitas:
1. ✅ Tener tu backend corriendo
2. ✅ Descomentar las líneas marcadas
3. ✅ Actualizar las URLs de API
4. ✅ ¡Ya funciona con base de datos! 🎉

**¿Tienes preguntas sobre la integración?** ¡Pregúntame y te ayudo!