import { Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer-component/customer-component';
import { SupplierComponent } from './pages/supplier-component/supplier-component';
import { ProjectComponent } from './pages/project-component/project-component';
import { CustomerEditComponent } from './pages/customer-component/customer-edit-component/customer-edit-component';
import { EmployeeComponent } from './pages/employee-component/employee-component';
import { EmployeeEditComponent } from './pages/employee-component/employee-edit-component/employee-edit-component';

export const routes: Routes = [
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
