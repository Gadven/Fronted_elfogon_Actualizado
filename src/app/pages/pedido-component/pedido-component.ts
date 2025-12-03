import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { PedidoService } from '../../services/pedido-service';
import { Pedido } from '../../model/pedido';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material-module';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [MaterialModule, DecimalPipe, RouterLink],
  templateUrl: './pedido-component.html',
  styleUrls: ['./pedido-component.css'],
})
export class PedidoComponent implements AfterViewInit {
  dataSource: MatTableDataSource<Pedido>;
  columnsDefinitions = [
    { def: 'idPedido', label: 'ID', hide: false },
    { def: 'cliente', label: 'Cliente', hide: false },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'total', label: 'Total', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private pedidoService: PedidoService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadData();
    this.pedidoService.getMessageChange().subscribe( data =>
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      })
    );
  }

  ngAfterViewInit(): void {
    // Asegurar que la tabla se actualice después de la vista
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadData() {
    this.pedidoService.findAll().subscribe(data => {
      console.log('Pedidos cargados:', data);
      this.createTable(data);
    });
  }

  createTable(data: Pedido[]) {
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
    this.pedidoService.delete(id)
    .pipe(switchMap(()=>this.pedidoService.findAll()))
    .subscribe( data => {
      this.createTable(data);
      this.pedidoService.setMessageChange('PEDIDO ELIMINADO!');
    });
  }
}
