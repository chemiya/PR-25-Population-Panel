import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  minSlider: number = 0;
  maxSlider: number = 7000000000;
  @Output() valuesSlider = new EventEmitter<number[]>();
  @Input() max: number=0;


ngOnInit(){
  this.maxSlider=this.max//we receive the max value
}

  inputChangeMin(event: any) {
    this.minSlider = event.target.value
  }

  inputChangeMax(event: any) {
    this.maxSlider = event.target.value
  }

  applySlider(){
    this.valuesSlider.emit([this.minSlider,this.maxSlider]);
  }
}
