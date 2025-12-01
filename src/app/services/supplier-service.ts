import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../model/supplier';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';

@Injectable({
  providedIn: 'root'
})

// http://localhost:9090/suppliers
export class SupplierService extends GenericService<Supplier>{
  // private url: string =  `${environment.HOST}/suppliers`;
  private supplierChange: Subject<Supplier[]> = new Subject<Supplier[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(){
    super(
      inject(HttpClient),
      `${environment.HOST}/suppliers`
    );
  }
  
    //////////////////////////
    setSupplierChange(data: Supplier[]){
      this.supplierChange.next(data);
    }
  
    getSupplierChange(){
      return this.supplierChange.asObservable();
    }
  
    setMessageChange(data: string){
      this.messageChange.next(data);
    }
  
    getMessageChange(){
      return this.messageChange.asObservable();
    }
}
