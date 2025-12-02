import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../model/customer';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';

@Injectable({
  providedIn: 'root'
})

export class CustomerService extends GenericService<Cliente> {
  // private url: string = `${environment.HOST}/clientes`;
  private customerChange: Subject<Cliente[]> = new Subject<Cliente[]>;
  private messageChange: Subject<string> = new Subject<string>;

  // constructor(private http: HttpClient){}
  constructor(){
    super(
      inject(HttpClient),
      `${environment.HOST}/clientes`
    );
    
  }
  
  // findAll(){
  //   return this.http.get<Customer[]>(this.url);
  // }

  // findById(id: number){
  //   return this.http.get<Customer>(`${this.url}/${id}`);
  // }

  // save(customer: Customer){
  //   return this.http.post(this.url, customer);
  // }

  // update(id: number, customer: Customer){
  //   return this.http.put(`${this.url}/${id}`, customer);
  // }

  // delete(id: number){
  //   return this.http.delete(`${this.url}/${id}`);
  // }

  //////////////////////////
  setCustomerChange(data: Cliente[]){
    this.customerChange.next(data);
  }

  getCustomerChange(){
    return this.customerChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
