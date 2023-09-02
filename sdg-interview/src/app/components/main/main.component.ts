import { Component, OnInit } from '@angular/core';
import { RestCountriesService } from '../../rest-countries-service/rest-countries.service';

import { Chart, registerables } from 'chart.js';
import { Continent } from '../../models/Continent';
import { Router } from '@angular/router';
import { CONTINENTS } from "./../../constants/continents.constants";
import { MaxSliderService } from 'src/app/max-slider-service/max-slider.service';


Chart.register(...registerables);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(private restCountriesService: RestCountriesService, private router: Router, private maxSliderService: MaxSliderService) { }
  allCountries: any = [];
  chart: any;
  showCarts = false;
  maxPopulationContinent: number = 0;

  actualChart = "bar"
  CONTINENTS_EXCEPT_LAST = CONTINENTS.slice(0, CONTINENTS.length - 1);


  populations: Continent[] = [
    { name: CONTINENTS[0], population: 0 },
    { name: CONTINENTS[1], population: 0 },
    { name: CONTINENTS[2], population: 0 },
    { name: CONTINENTS[3], population: 0 },
    { name: CONTINENTS[4], population: 0 },
    { name: CONTINENTS[5], population: 0 },
    { name: CONTINENTS[6], population: 0 }

  ];

  populationsFilter: Continent[] = [
    { name: CONTINENTS[0], population: 0 },
    { name: CONTINENTS[1], population: 0 },
    { name: CONTINENTS[2], population: 0 },
    { name: CONTINENTS[3], population: 0 },
    { name: CONTINENTS[4], population: 0 },
    { name: CONTINENTS[5], population: 0 },
    { name: CONTINENTS[6], population: 0 }

  ];

  ngOnInit() {
    this.fetchDataContinents();
  }

  changeSelectChart(event: any) {
    this.actualChart = event.target.value
    if (this.actualChart == "cards") {
      this.chart.destroy();//we destroy the chart that is previously created
      this.showCarts = true;
    } else {
      this.showCarts = false;//we hide cars and create the chart depending of its type
      this.createChart(this.actualChart)
    }
  }

  changeSelectContinent(event: any) {
    if (event.target.value != "Select continent") {
      this.router.navigate(['/continent/' + event.target.value])
    }
  }

  applySlider(event: any) {
    //we filter the continents that fulfill the conditions 
    this.populationsFilter = this.populations.filter((continent) => (continent.population <= event[1] && continent.population >= event[0]))
    if (this.actualChart == "bar" || this.actualChart == "pie") {
      this.chart.destroy();
      this.createChart(this.actualChart)
    }
  }

  createChart(typeChart: any) {
    //we obtain the names and populations of each continent
    var populationsNames: string[];
    populationsNames = this.populationsFilter.map(item => item.name);
    var populationsNumbers: number[];
    populationsNumbers = this.populationsFilter.map(item => item.population);
    var data = {
      labels: populationsNames,
      datasets: [{
        label: 'Population in continent',
        data: populationsNumbers,
        borderWidth: 1
      }]
    }
    //we define the options of the chart depending of the type of char we want to make
    var options: any;
    if (typeChart == "bar") {

      options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Continent'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Inhabitants'
            }

          }
        }
      }
    } else if (typeChart == "pie") {
      options = {
        responsive: true,
        maintainAspectRatio: false
      };
    }
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("chart", {
      type: typeChart,
      data: data,
      options: options
    });
  }

  fetchDataContinents() {
    var data = localStorage.getItem('continents')//we obtain data from cache
    if (data) {
      const continentsData = JSON.parse(data);
      this.populations = continentsData
      this.initView()
    } else {
      this.restCountriesService.getDataContinents()
        .subscribe({
          next: (data) => {
            this.allCountries = data;
            this.allCountries.forEach((country: any) => {

              switch (country.continents[0]) {
                case CONTINENTS[0]:
                  this.populations[0].population += country.population;
                  break;
                case CONTINENTS[1]:
                  this.populations[1].population += country.population;
                  break;

                case CONTINENTS[2]:
                  this.populations[2].population += country.population;
                  break;

                case CONTINENTS[3]:
                  this.populations[3].population += country.population;
                  break;

                case CONTINENTS[4]:
                  this.populations[4].population += country.population;
                  break;
                case CONTINENTS[5]:
                  this.populations[5].population += country.population;
                  break;
                case CONTINENTS[6]:
                  this.populations[6].population += country.population;
                  break;
                default:
                  console.log(country.continents[0])
              }
            });
            this.initView()
            localStorage.setItem('continents', JSON.stringify(this.populations));//we store data in cache
          },
          error: (e) => console.error(e)
        });
      }
  }

  initView(){
    this.populationsFilter = this.populations;//we store the original data in another array to filter it
    this.createChart("bar");
    this.maxPopulationContinent = this.populations.reduce((max, object) => (object.population > max ? object.population : max), -Infinity);
    this.maxSliderService.setValue(this.maxPopulationContinent);
  }
}
