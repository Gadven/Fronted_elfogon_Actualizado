import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer-service';
import { Cliente } from '../../../model/customer';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-edit-component.html',
  styleUrls: ['./customer-edit-component.css'],
})
export class CustomerEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // Tomar y conocer algo de la url activa
    private customerService: CustomerService,
    private router: Router // Sirve para navegar a otra ruta
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idCliente: new FormControl(),
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      telefono: new FormControl(''),
      direccion: new FormControl(''),
      correo: new FormControl(''),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.customerService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idCliente: new FormControl(data.idCliente),
          nombre: new FormControl(data.nombre),
          apellido: new FormControl(data.apellido),
          telefono: new FormControl(data.telefono),
          correo: new FormControl(data.correo),
          direccion: new FormControl(data.direccion),
        });
      });
    }
  }

  operate() {
    const customer: Cliente = new Cliente();
    customer.idCliente = this.form.value['idCliente'];
    customer.nombre = this.form.value['nombre'];
    customer.apellido = this.form.value['apellido'];
    customer.telefono = this.form.value['telefono'];
    customer.correo = this.form.value['correo'];
    customer.direccion = this.form.value['direccion'];

    if (this.isEdit) {
      // EDIT
      // this.customerService.update(this.id, customer).subscribe();
      // PRACTICA COMUN, NO IDEAL
      this.customerService.update(this.id, customer).subscribe(() => {
        this.customerService.findAll().subscribe((data) => {
          this.customerService.setCustomerChange(data);
          this.customerService.setMessageChange('¡Cliente actualizado!');
        });
      });      
    } else {
      // SAVE
      // this.customerService.save(customer).subscribe();
      // PRACTICA IDEAL
      this.customerService
        .save(customer)
        .pipe(switchMap(() => this.customerService.findAll()))
        .subscribe((data) => {
          this.customerService.setCustomerChange(data);
          this.customerService.setMessageChange('¡Cliente creado!');
        });
    }

    this.router.navigate(['pages/customer']);
  }
}
