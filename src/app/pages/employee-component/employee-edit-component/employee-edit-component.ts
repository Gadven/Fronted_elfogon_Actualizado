import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { EmployeeService } from '../../../services/employee-service';
import { Employee } from '../../../model/employee';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-employee-edit',
    standalone: true,
    templateUrl: './employee-edit-component.html',
    styleUrls: ['./employee-edit-component.css'],
    imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, 
        MatButtonModule, MatIconModule, RouterLink, CommonModule]
})
export class EmployeeEditComponent implements OnInit {

    id: number;
    isEdit: boolean;
    form: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            idEmployee: new FormControl(0),
            firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
            lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
            dni: new FormControl('', [Validators.required, Validators.pattern(/^\d{8}$/)]),
            phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            address: new FormControl(''),
            position: new FormControl('', [Validators.required])
        });

        this.route.params.subscribe(data => {
            this.id = data['id'];
            this.isEdit = this.id != null;
            this.initForm();
        });
    }

    initForm() {
        if (this.isEdit) {
            this.employeeService.findById(this.id).subscribe(data => {
                this.form.patchValue(data);
            });
        }
    }

    operate() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const employee: Employee = this.form.value;

        if (this.isEdit) {
            // UPDATE
            this.employeeService.update(this.id, employee)
                .pipe(switchMap(() => this.employeeService.findAll()))
                .subscribe(data => {
                    this.employeeService.setEmployeeChange(data);
                    this.employeeService.setMessageChange('EMPLEADO ACTUALIZADO');
                    this.router.navigate(['/pages/patient']);
                });
        } else {
            // INSERT
            this.employeeService.save(employee)
                .pipe(switchMap(() => this.employeeService.findAll()))
                .subscribe(data => {
                    this.employeeService.setEmployeeChange(data);
                    this.employeeService.setMessageChange('EMPLEADO CREADO');
                    this.router.navigate(['/pages/patient']);
                });
        }
    }

    get f() {
        return this.form.controls;
    }
}
