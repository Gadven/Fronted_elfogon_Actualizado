import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee-service';
import { Usuario } from '../../model/employee';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { switchMap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-employee',
    standalone: true,
    templateUrl: './employee-component.html',
    styleUrls: ['./employee-component.css'],
    imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatSnackBarModule, 
        MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, 
        CommonModule, RouterOutlet]
})
export class EmployeeComponent implements OnInit {

    dataSource: MatTableDataSource<Usuario>;
    displayedColumns: string[] = ['idUsuario', 'nombre', 'usuario', 'contraseña', 'rol', 'actions'];
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    totalElements: number = 0;

    constructor(
        private employeeService: EmployeeService,
        private _snackBar: MatSnackBar,
        public route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.employeeService.getEmployeeChange().subscribe(data => {
            this.createTable(data);
        });

        this.employeeService.getMessageChange().subscribe(data => {
            this._snackBar.open(data, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        });

        this.employeeService.findAll().subscribe(data => {
            this.createTable(data);
        });
    }

    createTable(data: Usuario[]) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalElements = data.length;
    }

    applyFilter(e: any) {
        this.dataSource.filter = e.target.value.trim().toLowerCase();
    }

    delete(idUsuario: number) {
        this.employeeService.delete(idUsuario).pipe(switchMap(() => {
            return this.employeeService.findAll();
        }))
            .subscribe(data => {
                this.employeeService.setEmployeeChange(data);
                this.employeeService.setMessageChange('EMPLEADO ELIMINADO');
            });
    }

    openDialog(employee?: Usuario) {
        // Navegación al formulario de edición
        if (employee) {
            this.router.navigate(['edit', employee.idUsuario], { relativeTo: this.route });
        } else {
            this.router.navigate(['new'], { relativeTo: this.route });
        }
    }

    checkChildren() {
        return this.route.children.length > 0;
    }
}
