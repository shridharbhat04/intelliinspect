import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatasetService } from '../../services/dataset.service';
import { UploadService } from '../../services/upload.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-date-ranges',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    BaseChartDirective
  ],
  providers: [provideNativeDateAdapter(),
     provideCharts(withDefaultRegisterables())  // ✅ chart.js integration
  ],
  templateUrl: './date-ranges.component.html',
  styleUrls: ['./date-ranges.component.scss']
})
export class DateRangesComponent implements OnInit {
  trainStart!: Date;
  trainEnd!: Date;
  testStart!: Date;
  testEnd!: Date;
  simStart!: Date;
  simEnd!: Date;

  validationResult: any = null;
  errorMessage: string | null = null;
  rangesValid = false;

  // computed summary objects for easy template binding
  trainingSummary: { start: Date; end: Date; durationDays: number; count: number } | null = null;
  testingSummary: { start: Date; end: Date; durationDays: number; count: number } | null = null;
  simulationSummary: { start: Date; end: Date; durationDays: number; count: number } | null = null;

  // Chart state
chartData: ChartConfiguration<'bar'>['data'] = {
  labels: [], // months
  datasets: [
    { label: 'Training', data: [], backgroundColor: '#10b981' }, // green
    { label: 'Testing', data: [], backgroundColor: '#f59e0b' },  // amber
    { label: 'Simulation', data: [], backgroundColor: '#3b82f6'  } // blue
  ]
};

chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    }
  }
};


  constructor(
    private router: Router,
    private datasetService: DatasetService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    // prefill from uploaded dataset metadata if available
    const meta = this.datasetService.getMetadata();
    if (meta && meta.earliestTimestamp && meta.latestTimestamp) {
      this.trainStart = new Date(meta.earliestTimestamp);
      this.simEnd = new Date(meta.latestTimestamp);

      // simple 3-way split prefill (first third training, second third testing, last third simulation)
      const totalDuration = this.simEnd.getTime() - this.trainStart.getTime();
      const oneThird = Math.floor(totalDuration / 3);

      this.trainEnd = new Date(this.trainStart.getTime() + oneThird);
      this.testStart = new Date(this.trainEnd.getTime() + 1000); // +1 second gap
      this.testEnd = new Date(this.testStart.getTime() + oneThird);
      this.simStart = new Date(this.testEnd.getTime() + 1000);
    } else {
      // fallback defaults (so UI is never empty)
      this.trainStart = new Date('2021-01-01T00:00:00');
      this.trainEnd = new Date('2021-03-31T23:59:59');
      this.testStart = new Date('2021-04-01T00:00:00');
      this.testEnd = new Date('2021-06-30T23:59:59');
      this.simStart = new Date('2021-07-01T00:00:00');
      this.simEnd = new Date('2021-12-31T23:59:59');
    }
  }

  goBack() {
    this.router.navigate(['/upload']);
  }

  validateRanges() {
    // guard (shouldn't happen because button disabled), but safe
    if (!this.trainStart || !this.trainEnd || !this.testStart || !this.testEnd || !this.simStart || !this.simEnd) {
      this.errorMessage = 'Please fill all date fields.';
      return;
    }

    const payload = {
      trainStart: this.trainStart,
      trainEnd: this.trainEnd,
      testStart: this.testStart,
      testEnd: this.testEnd,
      simStart: this.simStart,
      simEnd: this.simEnd
    };

    this.uploadService.validateRanges(payload).subscribe({
      next: (res) => {
        this.validationResult = res;
        this.errorMessage = null;
        this.rangesValid = true;
        this.populateSummaryFromResult(res);
      },
      error: (err) => {
        // browser can send ProgressEvent if CORS blocked; pick meaningful message
        const msg = err?.error?.message || err?.error || err?.message || 'Validation failed (unknown error)';
        this.errorMessage = msg;
        this.validationResult = null;
        this.rangesValid = false;

        // clear previous summaries
        this.trainingSummary = this.testingSummary = this.simulationSummary = null;
      }
    });
  }

  private daysInclusive(start: Date, end: Date) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
  }

  private toNumberSafe(v: any): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  private populateSummaryFromResult(res: any) {
    // backend can return a few shapes; handle common ones (robust)
    // 1) flat keys: { status, trainingRecords, testingRecords, simulationRecords }
    // 2) PascalCase: { Status, TrainingRecords, TestingRecords, SimulationRecords }
    // 3) nested: { Training: { Count: X, Start:..., End:... }, ... }
    const trainingCount =
      this.toNumberSafe(res.trainingRecords ?? res.TrainingRecords ?? (res.Training?.Count ?? res.Training?.count));
    const testingCount =
      this.toNumberSafe(res.testingRecords ?? res.TestingRecords ?? (res.Testing?.Count ?? res.Testing?.count));
    const simulationCount =
      this.toNumberSafe(res.simulationRecords ?? res.SimulationRecords ?? (res.Simulation?.Count ?? res.Simulation?.count));

    // If backend sent nested Start/End values, prefer those for display. Otherwise use the pickers' dates.
    const tStart = res.Training?.Start ? new Date(res.Training.Start) : this.trainStart;
    const tEnd = res.Training?.End ? new Date(res.Training.End) : this.trainEnd;
    const teStart = res.Testing?.Start ? new Date(res.Testing.Start) : this.testStart;
    const teEnd = res.Testing?.End ? new Date(res.Testing.End) : this.testEnd;
    const sStart = res.Simulation?.Start ? new Date(res.Simulation.Start) : this.simStart;
    const sEnd = res.Simulation?.End ? new Date(res.Simulation.End) : this.simEnd;

    this.trainingSummary = {
      start: tStart,
      end: tEnd,
      durationDays: this.daysInclusive(tStart, tEnd),
      count: trainingCount
    };

    this.testingSummary = {
      start: teStart,
      end: teEnd,
      durationDays: this.daysInclusive(teStart, teEnd),
      count: testingCount
    };

    this.simulationSummary = {
      start: sStart,
      end: sEnd,
      durationDays: this.daysInclusive(sStart, sEnd),
      count: simulationCount
    };

    // --- Fake monthly counts for now (replace with backend later) ---
this.chartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
this.chartData.datasets[0].data = [800, 700, 650]; // training months
this.chartData.datasets[1].data = [500, 600, 900]; // testing months
this.chartData.datasets[2].data = [1000, 1200, 1100, 1300, 1250, 1400]; // simulation months


  }

  goNext() {
    if (this.rangesValid) {
      this.router.navigate(['/model-training']);
    }
  }
}