import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MockSimulationService } from '../../services/mock-simulation.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, OnDestroy {
  isRunning = false;
  progress = 0;
  resultsReady = false;

  predictedVsActual: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { label: 'Actual', data: [], borderColor: '#3b82f6', fill: false },
      { label: 'Predicted', data: [], borderColor: '#f59e0b', fill: false }
    ]
  };

  predictedVsActualOptions: ChartOptions<'line'> = { responsive: true };

  distribution: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Good', 'Bad'],
    datasets: [
      { data: [0, 0], backgroundColor: ['#10b981', '#ef4444'] }
    ]
  };

  distributionOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  // Live Prediction Stream
  liveStream: Array<{
    time: string;
    sampleId: string;
    prediction: 'Pass' | 'Fail';
    confidence: number;
    temperature: number;
    pressure: number;
    humidity: number;
  }> = [];

  private liveStreamSub?: Subscription;

  constructor(private router: Router, private simService: MockSimulationService) {}
  ngOnInit(): void {
  // Seed the table with 25 dummy rows on component load
  this.liveStream = Array.from({ length: 25 }, (_, i) => ({
    time: new Date().toLocaleTimeString(),
    sampleId: 'S' + Math.floor(Math.random() * 10000),
    prediction: Math.random() > 0.3 ? 'Pass' : 'Fail',
    confidence: +(Math.random() * 100).toFixed(1),
    temperature: +(20 + Math.random() * 10).toFixed(1),
    pressure: +(1000 + Math.random() * 50).toFixed(1),
    humidity: +(30 + Math.random() * 50).toFixed(1),
  }));
}


  runSimulation() {
    if (this.isRunning) return;

    if (this.resultsReady) {
      // Restart simulation - reset all states
      this.resetSimulation();
      return;
    }

    this.isRunning = true;
    this.progress = 0;
    this.resultsReady = false;

    this.predictedVsActual.labels = [];
    (this.predictedVsActual.datasets[0].data as number[]) = [];
    (this.predictedVsActual.datasets[1].data as number[]) = [];

    // Clear previous live stream if any
    this.liveStream = [];
    this.liveStreamSub?.unsubscribe();

    // Start live prediction stream emitting every second (dummy)
    this.liveStreamSub = interval(1000).subscribe(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      // generate dummy data
      const sampleId = 'S' + Math.floor(Math.random() * 10000);
      const prediction = Math.random() > 0.3 ? 'Pass' : 'Fail';
      const confidence = +(Math.random() * 100).toFixed(1);
      const temperature = +(20 + Math.random() * 10).toFixed(1);
      const pressure = +(1000 + Math.random() * 50).toFixed(1);
      const humidity = +(30 + Math.random() * 50).toFixed(1);

      this.liveStream.unshift({
        time: timeStr,
        sampleId,
        prediction,
        confidence,
        temperature,
        pressure,
        humidity,
      });

      // keep max 20 rows
      if (this.liveStream.length > 100) {
        this.liveStream.pop();
      }
    });

    // Run the mock simulation observable
    this.simService.runMockSimulation().subscribe({
      next: (update) => {
        this.progress = update.progress;
        this.predictedVsActual.labels!.push(`T${update.step}`);
        (this.predictedVsActual.datasets[0].data as number[]).push(update.actual);
        (this.predictedVsActual.datasets[1].data as number[]).push(update.predicted);
      },
      complete: () => {
        this.isRunning = false;
        this.resultsReady = true;

        // final dummy distribution
        this.distribution.datasets[0].data = [720, 280];

        // Stop live stream subscription
        this.liveStreamSub?.unsubscribe();
      }
    });
  }

  resetSimulation() {
    this.progress = 0;
    this.resultsReady = false;
    this.predictedVsActual.labels = [];
    (this.predictedVsActual.datasets[0].data as number[]) = [];
    (this.predictedVsActual.datasets[1].data as number[]) = [];
    this.distribution.datasets[0].data = [0, 0];
    this.liveStream = [];
    this.liveStreamSub?.unsubscribe();
  }

  finish() {
    alert('🎉 Workflow completed!');
    this.liveStreamSub?.unsubscribe();
    this.router.navigate(['/upload']);
  }

  ngOnDestroy() {
    this.liveStreamSub?.unsubscribe();
  }
  get totalSamples(): number {
  return this.liveStream.length;
}

get passCount(): number {
  return this.liveStream.filter(x => x.prediction === 'Pass').length;
}

get failCount(): number {
  return this.liveStream.filter(x => x.prediction === 'Fail').length;
}

get averageConfidence(): number {
  if (this.liveStream.length === 0) return 0;
  const sum = this.liveStream.reduce((acc, cur) => acc + cur.confidence, 0);
  return +(sum / this.liveStream.length).toFixed(1);
}

}
