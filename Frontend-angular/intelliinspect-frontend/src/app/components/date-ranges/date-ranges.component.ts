import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatasetService } from '../../services/dataset.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-date-ranges',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './date-ranges.component.html',
  styleUrls: ['./date-ranges.component.scss']
})
export class DateRangesComponent {
  constructor(
    private router: Router, 
    private datasetService: DatasetService,
  private uploadService: UploadService) {}

  trainStart!: Date;
  trainEnd!: Date;
  testStart!: Date;
  testEnd!: Date;
  simStart!: Date;
  simEnd!: Date;

  goBack() {
    this.router.navigate(['/upload']);
  }
  rangesValid = false;
  
  ngOnInit() {
  const meta = this.datasetService.getMetadata();
  if (meta) {
    this.trainStart = new Date(meta.earliestTimestamp);
    this.simEnd = new Date(meta.latestTimestamp);

    // simple prefill: training = first 3 months, testing = next 3, simulation = rest
    const totalDuration = this.simEnd.getTime() - this.trainStart.getTime();
    const oneThird = totalDuration / 3;

    this.trainEnd = new Date(this.trainStart.getTime() + oneThird);
    this.testStart = new Date(this.trainEnd.getTime() + 1);
    this.testEnd = new Date(this.testStart.getTime() + oneThird);
    this.simStart = new Date(this.testEnd.getTime() + 1);
  }
}
  validationResult: any = null;
  errorMessage: string | null = null;

  validateRanges() {
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
  },
  error: (err) => {
    const msg = err.error?.message || err.error || "Unknown error";
    this.errorMessage = msg;
    this.validationResult = null;
    this.rangesValid = false;
  }
});

}

  goNext() {
    this.router.navigate(['/model-training']); // stub for next screen
  }


}