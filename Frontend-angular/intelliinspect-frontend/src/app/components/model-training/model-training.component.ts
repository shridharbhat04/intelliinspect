import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MockModelService } from '../../services/mock-model.service';

@Component({
  selector: 'app-model-training',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './model-training.component.html',
  styleUrls: ['./model-training.component.scss']
})
export class ModelTrainingComponent {
  isTraining = false;
  progress = 0;
  metrics: any = null;

  // Flag to know if training is completed
  modelTrained = false;

  trainingCurve: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { label: 'Accuracy', data: [], tension: 0.3 },
      { label: 'Loss', data: [], tension: 0.3 }
    ]
  };

  trainingOptions: ChartOptions<'line'> = { responsive: true };

  constructor(private router: Router, private mockService: MockModelService) {}

  startMockTraining() {
    if (this.isTraining || this.modelTrained) return;

    this.isTraining = true;
    this.modelTrained = false;  // Reset flag when training starts
    this.progress = 0;
    this.metrics = null;

    this.trainingCurve.labels = [];
    this.trainingCurve.datasets[0].data = [];
    this.trainingCurve.datasets[1].data = [];

    this.mockService.trainModelMock().subscribe({
      next: (update) => {
        this.progress = update.progress;
        this.trainingCurve.labels!.push(`E${update.epoch}`);
        (this.trainingCurve.datasets[0].data as number[]).push(update.accuracy);
        (this.trainingCurve.datasets[1].data as number[]).push(update.loss);
      },
      complete: () => {
        this.isTraining = false;
        this.progress = 100;
        this.modelTrained = true;  // Mark training complete

        // Set final metrics
        this.metrics = {
          accuracy: '93.5%',
          precision: '91.2%',
          recall: '88.7%',
          f1: '89.9%'
        };
      }
    });
  }

  proceedToSimulation() {
    this.router.navigate(['/simulation']);
  }

  // Doughnut Chart Data for Confusion Matrix
  confusionData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['True Positive', 'True Negative', 'False Positive', 'False Negative'],
    datasets: [
      {
        data: [420, 380, 60, 40], // dummy example values
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'], // green, blue, amber, red
      }
    ]
  };

  // Doughnut Chart Options
  confusionOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    }
  };
}
