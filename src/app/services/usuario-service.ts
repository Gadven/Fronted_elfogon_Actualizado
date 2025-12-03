import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GenericService } from './generic-service';
import { Usuario } from '../model/usuario';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario> {
    private messageChange: Subject<string> = new Subject<string>();

    constructor() {
        super(
            inject(HttpClient),
            `${environment.HOST}/usuarios`
        );
    }

    setMessageChange(data: string) {
        this.messageChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }
}
