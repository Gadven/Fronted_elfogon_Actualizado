import { Component, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service';
import { Usuario } from '../../model/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material-module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './usuario-component.html',
  styleUrls: ['./usuario-component.css'],
})
export class UsuarioComponent {
  dataSource: MatTableDataSource<Usuario>;
  columnsDefinitions = [
    { def: 'idUsuario', label: 'ID', hide: false },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'usuario', label: 'Usuario', hide: false },
    { def: 'rol', label: 'Rol', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usuarioService: UsuarioService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.usuarioService.findAll().subscribe(data => this.createTable(data));
    this.usuarioService.getMessageChange().subscribe( data =>
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      })
    );
  }

  createTable(data: Usuario[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number){
    this.usuarioService.delete(id)
    .pipe(switchMap(()=>this.usuarioService.findAll()))
    .subscribe( data => {
      this.createTable(data);
      this.usuarioService.setMessageChange('USUARIO ELIMINADO!');
    });
  }
}
