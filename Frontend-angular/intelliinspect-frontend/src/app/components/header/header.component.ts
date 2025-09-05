import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() currentStep: number = 1;

  steps = [
    { number: 1, title: 'Upload Dataset' },
    { number: 2, title: 'Date Ranges' },
    { number: 3, title: 'Model Training' },
    { number: 4, title: 'Simulation' }
  ];
  
  get activeStepTitle(): string {
    const step = this.steps.find(s => s.number === this.currentStep);
    return step ? step.title : '';
  }
}
