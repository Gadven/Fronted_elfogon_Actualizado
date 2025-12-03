export class Pago {
    idPago?: number;
    idPedido?: number;
    metodo?: string; // EFECTIVO / TARJETA / YAPE / PLIN
    monto?: number;
    estado?: string; // PENDIENTE / PAGADO / FALLIDO
}
