import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaxSliderService {

  private maxValue = new BehaviorSubject<any>(null);

  setValue(value: any): void {
    this.maxValue.next(value);
  }

  getValue(): Observable<any> {
    return this.maxValue.asObservable();
  }
}
