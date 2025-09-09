import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockSimulationService {
  runMockSimulation(): Observable<any> {
    return new Observable((observer) => {
      const steps = 20;
      let step = 0;

      const interval = setInterval(() => {
        step++;

        // dummy values
        const actual = Math.round(Math.random() * 100);
        const predicted = actual + Math.round((Math.random() - 0.5) * 10);

        observer.next({
          step,
          progress: Math.round((step / steps) * 100),
          actual,
          predicted
        });

        if (step >= steps) {
          clearInterval(interval);
          observer.complete();
        }
      }, 300);
    });
  }
}
