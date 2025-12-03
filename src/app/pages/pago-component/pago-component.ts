import { Component, ViewChild } from '@angular/core';
import { PagoService } from '../../services/pago-service';
import { Pago } from '../../model/pago';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material-module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [MaterialModule, DecimalPipe, RouterLink],
  templateUrl: './pago-component.html',
  styleUrls: ['./pago-component.css'],
})
export class PagoComponent {
  dataSource: MatTableDataSource<Pago>;
  columnsDefinitions = [
    { def: 'idPago', label: 'ID', hide: false },
    { def: 'idPedido', label: 'Pedido', hide: false },
    { def: 'metodo', label: 'Método', hide: false },
    { def: 'monto', label: 'Monto', hide: false },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private pagoService: PagoService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.pagoService.findAll().subscribe(data => this.createTable(data));
    this.pagoService.getMessageChange().subscribe( data =>
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      })
    );
  }

  createTable(data: Pago[]) {
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
    this.pagoService.delete(id)
    .pipe(switchMap(()=>this.pagoService.findAll()))
    .subscribe( data => {
      this.createTable(data);
      this.pagoService.setMessageChange('PAGO ELIMINADO!');
    });
  }
}
