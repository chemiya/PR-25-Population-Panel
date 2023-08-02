import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  minSlider: number = 0;
  maxSlider: number = 7000000000;
  @Output() valuesSlider = new EventEmitter<number[]>();
  @Input() max: number=0;


ngOnInit(){
  this.maxSlider=this.max//we receive the max value
}

  //when the min value of the slider change, we store the new value
  inputChangeMin(event: any) {
    this.minSlider = event.target.value
  }

  //when the max value of the slider change, we store the new value
  inputChangeMax(event: any) {
    this.maxSlider = event.target.value
  }

  //when the user press the button, we emit the event to apply the slider
  applySlider(){
    this.valuesSlider.emit([this.minSlider,this.maxSlider]);
  }
}
