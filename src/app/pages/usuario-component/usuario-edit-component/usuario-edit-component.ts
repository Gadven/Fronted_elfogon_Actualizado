import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material/material-module';
import { UsuarioService } from '../../../services/usuario-service';
import { Usuario } from '../../../model/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './usuario-edit-component.html',
  styleUrls: ['./usuario-edit-component.css']
})
export class UsuarioEditComponent implements OnInit {
  
  form: FormGroup;
  isEdit: boolean;
  id: number;

  roles = ['ADMIN', 'MOZO', 'CAJERO'];
  hidePassword = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idUsuario: new FormControl({ value: '', disabled: true }),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(80)]),
      usuario: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(120)]),
      rol: new FormControl('MOZO', Validators.required)
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.usuarioService.findById(this.id).subscribe(data => {
        this.form.patchValue({
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          usuario: data.usuario,
          contraseña: '', // No cargar la contraseña por seguridad
          rol: data.rol
        });
        // En modo edición, la contraseña es opcional
        this.form.get('contraseña')?.clearValidators();
        this.form.get('contraseña')?.setValidators([Validators.minLength(6), Validators.maxLength(120)]);
        this.form.get('contraseña')?.updateValueAndValidity();
      });
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const usuario: Usuario = {
      nombre: this.form.value['nombre'],
      usuario: this.form.value['usuario'],
      rol: this.form.value['rol']
    };

    // Solo incluir contraseña si se ingresó algo
    const password = this.form.value['contraseña'];
    if (password && password.trim() !== '') {
      usuario.contraseña = password;
    }

    if (this.isEdit) {
      usuario.idUsuario = this.form.value['idUsuario'];
      this.usuarioService.update(this.id, usuario).subscribe(() => {
        this.usuarioService.setMessageChange('Usuario actualizado correctamente');
        this.router.navigate(['/pages/users']);
      });
    } else {
      // En creación, la contraseña es obligatoria
      if (!password || password.trim() === '') {
        return;
      }
      this.usuarioService.save(usuario).subscribe(() => {
        this.usuarioService.setMessageChange('Usuario registrado correctamente');
        this.router.navigate(['/pages/users']);
      });
    }
  }

  getTitle(): string {
    return this.isEdit ? 'Editar Usuario' : 'Nuevo Usuario';
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
