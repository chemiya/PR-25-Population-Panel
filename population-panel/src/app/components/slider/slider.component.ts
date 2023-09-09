import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaxSliderService } from 'src/app/max-slider-service/max-slider.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  minSlider: number = 0;
  maxSlider: number = 0;
  @Output() valuesSlider = new EventEmitter<number[]>();
  maxLimit:number=0;

  constructor(private maxSliderService: MaxSliderService) { }

  ngOnInit() {
    this.maxSliderService.getValue().subscribe((max) => {
      this.maxSlider = max//we receive the max value
      this.maxLimit=max
    });
  }

  inputChangeMin(event: any) {
    this.minSlider = event.target.value
  }

  inputChangeMax(event: any) {
    this.maxSlider = event.target.value
  }

  applySlider() {
    this.valuesSlider.emit([this.minSlider, this.maxSlider]);
  }
}
