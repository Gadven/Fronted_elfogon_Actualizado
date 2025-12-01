import { Component, Inject, inject } from '@angular/core';
import { Supplier } from '../../../model/supplier';
import { SupplierService } from '../../../services/supplier-service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material-module';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule],
  templateUrl: './supplier-dialog-component.html',
  styleUrls: ['./supplier-dialog-component.css'],
})
export class SupplierDialogComponent {
  supplier: Supplier;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Supplier,
    private _dialogRef: MatDialogRef<SupplierDialogComponent>,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.supplier = {... this.data} //spread operator
    //this.supplier = this.data;
  }

  operate() {
    if (this.supplier != null && this.supplier.idSupplier > 0) {
      // UPDATE
      this.supplierService
        .update(this.supplier.idSupplier, this.supplier)
        .pipe(switchMap(() => this.supplierService.findAll()))
        .subscribe((data) => {
          this.supplierService.setSupplierChange(data);
          this.supplierService.setMessageChange('SUPPLIER UPDATED!');
        });
    } else {
      // INSERT
      this.supplierService
        .save(this.supplier)
        .pipe(switchMap(() => this.supplierService.findAll()))
        .subscribe((data) => {
          this.supplierService.setSupplierChange(data);
          this.supplierService.setMessageChange('SUPPLIER CREATED!');
        });        
    }
    this.close();
  }

  close() {
    this._dialogRef.close();
  }
}
