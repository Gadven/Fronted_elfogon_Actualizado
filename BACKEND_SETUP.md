# Configuración del Backend - El Fogón

## Requisitos
- Java 21
- Spring Boot 3.5.5
- MySQL o PostgreSQL
- Maven

## Configuración CORS

Para que el frontend Angular (http://localhost:4200) pueda comunicarse con el backend Spring Boot (http://localhost:9090), debes configurar CORS en tu backend.

### Opción 1: Configuración Global (Recomendada)

Crea la clase `WebConfig.java` en el paquete de configuración:

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

### Opción 2: Anotación en Controladores

Agrega `@CrossOrigin` en cada controlador:

```java
@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {
    // ... métodos del controlador
}
```

## Endpoints Esperados

El frontend espera los siguientes endpoints REST:

### Customers (Clientes)
```
GET    /customers           - Listar todos los clientes
GET    /customers/{id}      - Obtener un cliente por ID
POST   /customers           - Crear un nuevo cliente
PUT    /customers/{id}      - Actualizar un cliente
DELETE /customers/{id}      - Eliminar un cliente
```

### Suppliers (Proveedores)
```
GET    /suppliers           - Listar todos los proveedores
GET    /suppliers/{id}      - Obtener un proveedor por ID
POST   /suppliers           - Crear un nuevo proveedor
PUT    /suppliers/{id}      - Actualizar un proveedor
DELETE /suppliers/{id}      - Eliminar un proveedor
```

### Projects (Proyectos)
```
GET    /projects            - Listar todos los proyectos
GET    /projects/{id}       - Obtener un proyecto por ID
POST   /projects            - Crear un nuevo proyecto
PUT    /projects/{id}       - Actualizar un proyecto
DELETE /projects/{id}       - Eliminar un proyecto
```

### Employees (Empleados)
```
GET    /employees           - Listar todos los empleados
GET    /employees/{id}      - Obtener un empleado por ID
POST   /employees           - Crear un nuevo empleado
PUT    /employees/{id}      - Actualizar un empleado
DELETE /employees/{id}      - Eliminar un empleado
```

## Modelos de Datos

### Customer (Cliente)
```java
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCustomer;
    
    @NotBlank
    private String dni;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    private String phone;
    
    @Email
    private String email;
    
    private String address;
    
    // getters y setters
}
```

### Supplier (Proveedor)
```java
@Entity
@Table(name = "suppliers")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSupplier;
    
    @NotBlank
    private String ruc;
    
    @NotBlank
    private String name;
    
    private String phone;
    
    @Email
    private String email;
    
    private String address;
    
    // getters y setters
}
```

### Project (Proyecto)
```java
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProject;
    
    @NotBlank
    private String name;
    
    private String location;
    
    @Temporal(TemporalType.DATE)
    private Date startDate;
    
    @Temporal(TemporalType.DATE)
    private Date estimatedEndDate;
    
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "id_customer")
    private Customer customer;
    
    // getters y setters
}
```

### Employee (Empleado)
```java
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmployee;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    @NotBlank
    private String dni;
    
    private String phone;
    
    @Email
    private String email;
    
    private String address;
    
    @NotBlank
    private String position; // cargo/puesto
    
    // getters y setters
}
```

## Configuración de Base de Datos

### MySQL (application.properties)
```properties
server.port=9090

# JPA / Hibernate settings
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.database=mysql
spring.jpa.show-sql=true
spring.jpa.generate-ddl=true
spring.jpa.hibernate.ddl-auto=update

# Database connection
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/constructapp
spring.datasource.username=root
spring.datasource.password=tu_password
```

### PostgreSQL (application.properties)
```properties
server.port=9090

spring.jpa.database=postgresql
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update

spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.datasource.url=jdbc:postgresql://localhost:5432/constructapp
spring.datasource.username=postgres
spring.datasource.password=tu_password
```

## Pasos para Ejecutar

1. **Crear la base de datos:**
   ```sql
   CREATE DATABASE constructapp;
   ```

2. **Configurar las credenciales** en `application.properties`

3. **Ejecutar el backend:**
   ```bash
   mvn spring-boot:run
   ```
   O desde tu IDE favorito

4. **Verificar que el servidor está corriendo:**
   - El backend debe estar disponible en `http://localhost:9090`

5. **Ejecutar el frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   - El frontend estará disponible en `http://localhost:4200`

## Validación

### Probar los Endpoints con cURL

```bash
# Listar todos los clientes
curl http://localhost:9090/customers

# Crear un cliente
curl -X POST http://localhost:9090/customers \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "987654321",
    "email": "juan@example.com",
    "address": "Av. Principal 123"
  }'
```

## Troubleshooting

### Error de CORS
Si ves errores de CORS en la consola del navegador, verifica:
1. Que la configuración de CORS está correctamente implementada
2. Que el backend está corriendo en el puerto 9090
3. Que el frontend está corriendo en el puerto 4200

### Error de Conexión
Si el frontend no puede conectarse al backend:
1. Verifica que el backend esté corriendo: `http://localhost:9090/customers`
2. Revisa la consola del navegador para ver errores específicos
3. Verifica la configuración de `environment.development.ts`

## Arquitectura

```
Frontend (Angular)                Backend (Spring Boot)
Port: 4200                        Port: 9090
├── Components                    ├── Controllers
│   ├── Customer                  │   ├── CustomerController
│   ├── Supplier                  │   ├── SupplierController
│   ├── Project                   │   ├── ProjectController
│   └── Employee                  │   └── EmployeeController
├── Services                      ├── Services
│   ├── CustomerService    -----> │   ├── CustomerService
│   ├── SupplierService    -----> │   ├── SupplierService
│   ├── ProjectService     -----> │   ├── ProjectService
│   └── EmployeeService    -----> │   └── EmployeeService
└── Models                        ├── Models/Entities
    ├── Customer                  │   ├── Customer
    ├── Supplier                  │   ├── Supplier
    ├── Project                   │   ├── Project
    └── Employee                  │   └── Employee
                                  └── Repositories
                                      ├── CustomerRepository
                                      ├── SupplierRepository
                                      ├── ProjectRepository
                                      └── EmployeeRepository
```

## Notas Adicionales

- El proyecto usa **ModelMapper** para mapeo de DTOs
- Se incluye **Jakarta Validation** para validación de datos
- La arquitectura es **n-capas** (Controller → Service → Repository)
- El proyecto sigue el **modelo de madurez de Richardson** para APIs REST
