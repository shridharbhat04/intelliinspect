import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
    UploadComponent,
   HeaderComponent,
  FooterComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'intelliinspect-frontend';
  steps = [
  { number: 1, title: 'Upload' },
  { number: 2, title: 'Ranges' },
  { number: 3, title: 'Train' },
  { number: 4, title: 'Simulate' }
];
currentStep = 1; // Change this as user navigates steps

}
