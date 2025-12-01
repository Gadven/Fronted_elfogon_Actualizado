# ✅ Checklist de Conexión Frontend ↔ Backend

## Paso 1: Verificar Backend

### 1.1 Base de Datos
```sql
-- Conectarse a DBeaver y crear la base de datos
CREATE DATABASE constructapp;
USE constructapp;

-- Verificar que las tablas se crearon automáticamente (después de ejecutar el backend)
SHOW TABLES;
```

### 1.2 Configuración Backend
En `application.properties`:
```properties
server.port=9090
spring.datasource.url=jdbc:mysql://localhost:3306/constructapp
spring.datasource.username=root
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 1.3 Configurar CORS
Crear archivo `WebConfig.java` en tu backend:
```java
package pe.constructora.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 1.4 Ejecutar Backend
```bash
cd tu-proyecto-backend
mvn spring-boot:run
```

**Verificar que esté corriendo:**
- Abrir navegador: http://localhost:9090/customers
- Debería devolver `[]` (array vacío) si no hay clientes

## Paso 2: Verificar Frontend

### 2.1 Frontend ya está configurado ✅
- Puerto: 4200
- URL del backend: http://localhost:9090
- Servicios: CustomerService, SupplierService, ProjectService

### 2.2 Frontend ya está corriendo ✅
El servidor de desarrollo ya está ejecutándose en:
- http://localhost:4200

## Paso 3: Probar la Conexión

### 3.1 Probar desde el Navegador
1. Abrir: http://localhost:4200
2. Ir a "Clientes" en el menú
3. Click en el botón **+** (agregar)
4. Llenar el formulario:
   - DNI: 12345678
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: 987654321
   - Correo: juan@example.com
   - Dirección: Av. Principal 123
5. Click en "Guardar"

### 3.2 Verificar en la Base de Datos
```sql
USE constructapp;
SELECT * FROM customers;
```

Deberías ver el cliente que acabas de crear.

### 3.3 Verificar en la Interfaz
La tabla de clientes debería mostrar el nuevo cliente creado.

## 🔧 Troubleshooting

### ❌ Error: "Failed to fetch" o "CORS error"
**Solución:** Verifica que:
1. El backend esté corriendo en puerto 9090
2. CORS esté configurado en el backend (WebConfig.java)
3. Reinicia el backend después de agregar CORS

### ❌ Error: "Cannot connect to database"
**Solución:**
1. Verifica que MySQL esté corriendo
2. Verifica usuario/password en application.properties
3. Verifica que la base de datos exista: `CREATE DATABASE constructapp;`

### ❌ Error: "404 Not Found" en las peticiones
**Solución:**
1. Verifica que tu backend tenga los controladores:
   - CustomerController con @RequestMapping("/customers")
   - SupplierController con @RequestMapping("/suppliers")
   - ProjectController con @RequestMapping("/projects")

### ❌ Los datos no se guardan
**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Intenta guardar un cliente
4. Verifica:
   - Que la petición POST se haga a http://localhost:9090/customers
   - Que el status sea 200 o 201
   - Si hay error, revisa el mensaje

## 📊 Flujo de Guardado

```
Usuario llena formulario en Angular
         ↓
Click en "Guardar"
         ↓
customer-edit-component.ts → operate()
         ↓
customerService.save(customer)
         ↓
HTTP POST → http://localhost:9090/customers
         ↓
Spring Boot Backend
         ↓
CustomerController.save()
         ↓
CustomerService.save()
         ↓
CustomerRepository.save()
         ↓
MySQL Database (tabla customers)
         ↓
Respuesta exitosa → 201 Created
         ↓
Frontend actualiza la tabla
         ↓
Mensaje: "¡Cliente creado!"
```

## ✅ Verificación Final

Marca cada punto cuando lo completes:

- [ ] Base de datos MySQL creada: `constructapp`
- [ ] Backend configurado en application.properties
- [ ] CORS configurado en WebConfig.java
- [ ] Backend corriendo en http://localhost:9090
- [ ] Endpoint /customers responde (aunque sea con [])
- [ ] Frontend corriendo en http://localhost:4200
- [ ] Crear cliente desde la interfaz
- [ ] Cliente aparece en la tabla del frontend
- [ ] Cliente existe en la base de datos MySQL

## 🎯 Siguiente Paso

Una vez que funcione:
1. Prueba editar un cliente
2. Prueba eliminar un cliente
3. Prueba el mismo flujo con Proveedores
4. Luego podemos agregar más funcionalidades

---

**¿Necesitas ayuda?** Revisa los logs:
- **Backend:** En la consola donde ejecutaste `mvn spring-boot:run`
- **Frontend:** F12 → Console en el navegador
