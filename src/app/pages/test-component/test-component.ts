import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; text-align: center;">
      <h1 style="color: #d32f2f;">¡El sistema funciona!</h1>
      <p>Esta es una página de prueba para verificar que el routing funcione.</p>
      <div style="margin-top: 20px; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
        <h2>Menú de prueba:</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
          <div style="padding: 15px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3>🍗 Pollo a la Brasa</h3>
            <p>Delicioso pollo con papas fritas</p>
            <strong>S/. 25.00</strong>
          </div>
          <div style="padding: 15px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3>🐟 Ceviche Mixto</h3>
            <p>Fresco ceviche de mariscos</p>
            <strong>S/. 30.00</strong>
          </div>
          <div style="padding: 15px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3>🌽 Choclo con Queso</h3>
            <p>Choclo tierno con queso fresco</p>
            <strong>S/. 8.00</strong>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TestComponent { }