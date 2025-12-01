import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material/material-module';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MaterialModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './layout-component.html',
  styleUrls: ['./layout-component.css'],
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
}
