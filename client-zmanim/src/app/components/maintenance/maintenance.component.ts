import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class MaintenanceComponent {
  contactEmail: string = 'zmaneytfilot@gmail.com';
}
