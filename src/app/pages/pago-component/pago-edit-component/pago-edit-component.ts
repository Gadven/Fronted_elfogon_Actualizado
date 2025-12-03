import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../material/material-module';
import { PagoService } from '../../../services/pago-service';
import { Pago } from '../../../model/pago';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './pago-edit-component.html',
  styleUrls: ['./pago-edit-component.css']
})
export class PagoEditComponent implements OnInit {
  
  form: FormGroup;
  isEdit: boolean;
  id: number;

  metodosPago = ['EFECTIVO', 'TARJETA', 'YAPE', 'PLIN'];
  estadosPago = ['PENDIENTE', 'PAGADO', 'FALLIDO'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pagoService: PagoService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idPago: new FormControl({ value: '', disabled: true }),
      idPedido: new FormControl('', [Validators.required, Validators.min(1)]),
      metodo: new FormControl('EFECTIVO', Validators.required),
      monto: new FormControl('', [Validators.required, Validators.min(0.01)]),
      estado: new FormControl('PENDIENTE', Validators.required)
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.pagoService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idPago: data.idPago,
          idPedido: data.idPedido,
          metodo: data.metodo,
          monto: data.monto,
          estado: data.estado
        });
      });
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const pago: Pago = {
      idPedido: this.form.value['idPedido'],
      metodo: this.form.value['metodo'],
      monto: this.form.value['monto'],
      estado: this.form.value['estado']
    };

    if (this.isEdit) {
      pago.idPago = this.form.value['idPago'];
      this.pagoService.update(this.id, pago).subscribe(() => {
        this.pagoService.setMessageChange('Pago actualizado correctamente');
        this.router.navigate(['/pages/payments']);
      });
    } else {
      this.pagoService.save(pago).subscribe(() => {
        this.pagoService.setMessageChange('Pago registrado correctamente');
        this.router.navigate(['/pages/payments']);
      });
    }
  }

  getTitle(): string {
    return this.isEdit ? 'Editar Pago' : 'Nuevo Pago';
  }
}
