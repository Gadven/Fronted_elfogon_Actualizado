import { Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer-component/customer-component';
import { SupplierComponent } from './pages/supplier-component/supplier-component';
import { ProjectComponent } from './pages/project-component/project-component';
import { CustomerEditComponent } from './pages/customer-component/customer-edit-component/customer-edit-component';
import { EmployeeComponent } from './pages/employee-component/employee-component';
import { EmployeeEditComponent } from './pages/employee-component/employee-edit-component/employee-edit-component';
import { MenuComponent } from './pages/menu-component/menu-component';
import { CartComponent } from './pages/cart-component/cart-component';
import { CheckoutComponent } from './pages/checkout-component/checkout-component';

export const routes: Routes = [
    // Rutas principales del sistema de pedidos
    { path: '', redirectTo: '/menu', pathMatch: 'full' },
    { path: 'menu', component: MenuComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    
    // Rutas administrativas existentes
    {
        path: 'pages/customer', component: CustomerComponent,
        children: [
            { path: 'new', component: CustomerEditComponent },
            { path: 'edit/:id', component: CustomerEditComponent }
        ]
    },
    { path: 'pages/supplier', component: SupplierComponent },
    { path: 'pages/project', component: ProjectComponent },
    {
        path: 'pages/patient', component: EmployeeComponent,
        children: [
            { path: 'new', component: EmployeeEditComponent },
            { path: 'edit/:id', component: EmployeeEditComponent }
        ]
    }
];
