import { Routes } from '@angular/router';
import { MenuSimpleComponent } from './pages/menu-simple/menu-simple.component';
import { CartSimpleComponent } from './pages/cart-simple/cart-simple.component';
import { DishManagementComponent } from './pages/dish-management-component/dish-management-component';
import { CustomerComponent } from './pages/customer-component/customer-component';
import { SupplierComponent } from './pages/supplier-component/supplier-component';
import { CustomerEditComponent } from './pages/customer-component/customer-edit-component/customer-edit-component';
import { PedidoComponent } from './pages/pedido-component/pedido-component';
import { PedidoEditComponent } from './pages/pedido-component/pedido-edit-component/pedido-edit-component';
import { PagoComponent } from './pages/pago-component/pago-component';
import { PagoEditComponent } from './pages/pago-component/pago-edit-component/pago-edit-component';
import { UsuarioComponent } from './pages/usuario-component/usuario-component';
import { UsuarioEditComponent } from './pages/usuario-component/usuario-edit-component/usuario-edit-component';

export const routes: Routes = [
    // Rutas del sistema administrativo
    { path: '', redirectTo: '/menu', pathMatch: 'full' },
    { path: 'menu', component: MenuSimpleComponent },
    { path: 'pages/dish-management', component: DishManagementComponent },
    
    // Rutas de gestión
    { path: 'pages/orders', component: PedidoComponent },
    { path: 'pages/orders/new', component: PedidoEditComponent },
    { path: 'pages/orders/edit/:id', component: PedidoEditComponent },
    { path: 'pages/payments', component: PagoComponent },
    { path: 'pages/payments/new', component: PagoEditComponent },
    { path: 'pages/payments/edit/:id', component: PagoEditComponent },
    
    // Rutas administrativas
    { path: 'pages/customer', component: CustomerComponent },
    { path: 'pages/customer/new', component: CustomerEditComponent },
    { path: 'pages/customer/edit/:id', component: CustomerEditComponent },
    { path: 'pages/users', component: UsuarioComponent },
    { path: 'pages/users/new', component: UsuarioEditComponent },
    { path: 'pages/users/edit/:id', component: UsuarioEditComponent },
    { path: 'pages/supplier', component: SupplierComponent },

    // Ruta catch-all - redirige al menú
    { path: '**', redirectTo: '/menu' }
];
