import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockModelService {
  trainModelMock(): Observable<any> {
    return new Observable((observer) => {
      const epochs = 12;
      let epoch = 0;

      const interval = setInterval(() => {
        epoch++;

        // fake metrics
        const acc = +(0.5 + (epoch / epochs) * 0.45).toFixed(3);
        const loss = +(1.2 - (epoch / epochs) * 1.0).toFixed(3);

        observer.next({
          epoch,
          progress: Math.round((epoch / epochs) * 100),
          accuracy: acc,
          loss: loss,
        });

        if (epoch >= epochs) {
          clearInterval(interval);
          observer.complete();
        }
      }, 500);
    });
  }
}
