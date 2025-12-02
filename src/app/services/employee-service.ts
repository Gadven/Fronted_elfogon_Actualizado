import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../model/employee';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService extends GenericService<Usuario> {
    private employeeChange: Subject<Usuario[]> = new Subject<Usuario[]>;
    private messageChange: Subject<string> = new Subject<string>;

    constructor() {
        super(
            inject(HttpClient),
            `${environment.HOST}/employees`
        );
    }

    setEmployeeChange(data: Usuario[]) {
        this.employeeChange.next(data);
    }

    getEmployeeChange() {
        return this.employeeChange.asObservable();
    }

    setMessageChange(data: string) {
        this.messageChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }
}
