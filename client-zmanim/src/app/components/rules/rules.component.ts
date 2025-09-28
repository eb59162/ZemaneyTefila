import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class RulesComponent {
  showRules = false;
  designEmail: string = 'm0556704176@gmail.com';
  toggleRules() {
    this.showRules = !this.showRules;
  }
}
