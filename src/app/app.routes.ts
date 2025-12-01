import { Routes } from '@angular/router';
import { MenuSimpleComponent } from './pages/menu-simple/menu-simple.component';
import { CartSimpleComponent } from './pages/cart-simple/cart-simple.component';
import { DishManagementComponent } from './pages/dish-management-component/dish-management-component';
import { CustomerComponent } from './pages/customer-component/customer-component';
import { SupplierComponent } from './pages/supplier-component/supplier-component';
import { CustomerEditComponent } from './pages/customer-component/customer-edit-component/customer-edit-component';
import { EmployeeComponent } from './pages/employee-component/employee-component';
import { EmployeeEditComponent } from './pages/employee-component/employee-edit-component/employee-edit-component';

export const routes: Routes = [
    // Rutas del sistema administrativo
    { path: '', redirectTo: '/menu', pathMatch: 'full' },
    { path: 'menu', component: MenuSimpleComponent },
    { path: 'pages/dish-management', component: DishManagementComponent },
    
    // Rutas administrativas existentes (restauradas)
    {
        path: 'pages/customer', component: CustomerComponent,
        children: [
            { path: 'new', component: CustomerEditComponent },
            { path: 'edit/:id', component: CustomerEditComponent }
        ]
    },
    { path: 'pages/supplier', component: SupplierComponent },

    {
        path: 'pages/patient', component: EmployeeComponent,
        children: [
            { path: 'new', component: EmployeeEditComponent },
            { path: 'edit/:id', component: EmployeeEditComponent }
        ]
    },
    
    // Ruta catch-all - redirige al menú
    { path: '**', redirectTo: '/menu' }
];
