import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  standalone: true
})
export class AppComponent {
  title = 'intelliinspect-frontend';
  currentStep = 1;
  //   steps = [
//   { number: 1, title: 'Upload' },
//   { number: 2, title: 'Ranges' },
//   { number: 3, title: 'Train' },
//   { number: 4, title: 'Simulate' }
// ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      if (url.includes('upload')) this.currentStep = 1;
      else if (url.includes('date-ranges')) this.currentStep = 2;
      else if (url.includes('model-training')) this.currentStep = 3;
      else if (url.includes('simulation')) this.currentStep = 4;
      else this.currentStep = 1;
    });
  }
}

