import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PedidoService } from '../../../services/pedido-service';
import { CustomerService } from '../../../services/customer-service';
import { Pedido } from '../../../model/pedido';
import { Cliente } from '../../../model/customer';
import { MaterialModule } from '../../../material/material-module';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-pedido-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './pedido-edit-component.html',
  styleUrls: ['./pedido-edit-component.css']
})
export class PedidoEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;
  clientes: Cliente[] = [];
  estados = ['PENDIENTE', 'PREPARACION', 'LISTO', 'ENTREGADO'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idPedido: new FormControl(0),
      cliente: new FormControl(null, [Validators.required]),
      estado: new FormControl('PENDIENTE', [Validators.required]),
      total: new FormControl(0, [Validators.required, Validators.min(0)])
    });

    this.loadClientes();

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  loadClientes() {
    this.customerService.findAll().subscribe(data => {
      this.clientes = data;
    });
  }

  initForm() {
    if (this.isEdit) {
      this.pedidoService.findById(this.id).subscribe(data => {
        // Buscar el cliente completo por ID para preseleccionar en el dropdown
        const clienteSeleccionado = this.clientes.find(c => c.idCliente === data.cliente?.idCliente);
        this.form.patchValue({
          idPedido: data.idPedido,
          cliente: clienteSeleccionado,
          estado: data.estado,
          total: data.total
        });
      });
    }
  }

  operate() {
    if (this.form.invalid) { 
      console.log('Formulario inválido:', this.form.errors);
      return; 
    }

    const cliente = this.form.value['cliente'];
    const pedido: any = {
      idPedido: this.form.value['idPedido'],
      idCliente: cliente?.idCliente, // Enviar solo el ID
      estado: this.form.value['estado'],
      total: this.form.value['total']
    };

    console.log('Enviando pedido:', pedido);

    if (this.isEdit) {
      this.pedidoService.update(this.id, pedido)
        .pipe(switchMap(() => this.pedidoService.findAll()))
        .subscribe({
          next: (data) => {
            console.log('Pedido actualizado exitosamente');
            this.pedidoService.setMessageChange('PEDIDO ACTUALIZADO!');
            this.router.navigate(['/pages/orders']);
          },
          error: (err) => {
            console.error('Error al actualizar pedido:', err);
            alert('Error al actualizar: ' + (err.error?.message || err.message));
          }
        });
    } else {
      this.pedidoService.save(pedido)
        .pipe(switchMap(() => this.pedidoService.findAll()))
        .subscribe({
          next: (data) => {
            console.log('Pedido creado exitosamente');
            this.pedidoService.setMessageChange('PEDIDO CREADO!');
            this.router.navigate(['/pages/orders']);
          },
          error: (err) => {
            console.error('Error al crear pedido:', err);
            alert('Error al guardar: ' + (err.error?.message || err.message));
          }
        });
    }
  }
}
