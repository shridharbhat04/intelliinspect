import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../services/upload.service';
import { Router } from '@angular/router';
import { DatasetService } from '../../services/dataset.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFile: File | null = null;
  metadata: any;

  constructor(private uploadService: UploadService, private router: Router, private datasetService: DatasetService) {}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
       this.onUpload(); 
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;
    this.uploadService.uploadDataset(this.selectedFile).subscribe({
      next: (res) => {this.metadata = res, this.datasetService.setMetadata(res)},
      error: (err) => alert('Upload failed: ' + err.message)
    });
  }
  // Reset metadata and selected file to show upload card again
  onReset(): void {
    this.metadata = null;
    this.selectedFile = null;
  }
  goNext(): void {
  this.router.navigate(['/date-ranges']);
}

}