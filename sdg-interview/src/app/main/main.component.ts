import { Component } from '@angular/core';
import { RestCountriesService } from '../rest-countries-service/rest-countries.service';

import { Chart, registerables } from 'chart.js';
import { Continent } from '../models/Continent';
import { Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(private restCountriesService: RestCountriesService, private router: Router) { }
  allCountries: any = [];
  chart: any;
  showCarts = false;
  minSlider: number = 0;
  maxSlider: number = 7000000000;
  actualChart="bar"


  populations: Continent[] = [
    { name: "Europe", population: 0 },
    { name: "Asia", population: 0 },
    { name: "Africa", population: 0 },
    { name: "Oceania", population: 0 },
    { name: "North America", population: 0 },
    { name: "South America", population: 0 },
    { name: "Antarctica", population: 0 }

  ];

  populationsFilter: Continent[] = [
    { name: "Europe", population: 0 },
    { name: "Asia", population: 0 },
    { name: "Africa", population: 0 },
    { name: "Oceania", population: 0 },
    { name: "North America", population: 0 },
    { name: "South America", population: 0 },
    { name: "Antarctica", population: 0 }

  ];

  ngOnInit() {
    this.fetchDataContinents();



  }
  //to manage when the user change the chart
  changeSelectChart(event: any) {
    this.actualChart=event.target.value
    if (this.actualChart == "cards") {
      this.chart.destroy();//if cards are selected, we destroy the chart and show carts
      this.showCarts = true;
    } else {
      this.showCarts = false;//else, we hide cars and create the chart depending of its type
      this.createChart(this.actualChart)
    }



  }

  //when a continent is selected, we go to continent-view
  changeSelectContinent(event: any) {
    if(event.target.value!="Select continent"){
      this.router.navigate(['/continent/' + event.target.value])
    }
    
  }

  //to apply the filter of population with the values of the slider
  applySlider() {
    //we filter the continents that fulfill the conditions
    this.populationsFilter = this.populations.filter((continent) => (continent.population <= this.maxSlider && continent.population >= this.minSlider))
    if(this.actualChart=="bar"){
      this.chart.destroy();
      this.createChart("bar")
    }else if(this.actualChart=="pie"){
      this.chart.destroy();
      this.createChart("pie")
    }
    
    
  }

  //when the min value of the slider change, we store the new value
  inputChangeMin(event: any) {
    this.minSlider = event.target.value
  }

  //when the max value of the slider change, we store the new value
  inputChangeMax(event: any) {
    this.maxSlider = event.target.value
  }

  createChart(typeChart: any) {

    //we obtain the names and populations of each continent
    var populationsNames: string[];
    populationsNames = this.populationsFilter.map(item => item.name);
    var populationsNumbers: number[];
    populationsNumbers = this.populationsFilter.map(item => item.population);

    


    //we define the data of the chart
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
    this.restCountriesService.getDataContinents()
      .subscribe({
        next: (data) => {
          this.allCountries = data;

          //we obtain all the data from the countries and we group it by continents
          this.allCountries.forEach((country: any) => {

            switch (country.continents[0]) {
              case "Europe":
                this.populations[0].population += country.population;
                break;
              case "Asia":
                this.populations[1].population += country.population;
                break;

              case "Africa":
                this.populations[2].population += country.population;
                break;

              case "Oceania":
                this.populations[3].population += country.population;
                break;

              case "North America":
                this.populations[4].population += country.population;
                break;
              case "South America":
                this.populations[5].population += country.population;
                break;
              case "Antarctica":
                this.populations[6].population += country.population;
                break;
              default:
                console.log(country.continents[0])
            }


          });

          this.populationsFilter = this.populations;//we store the original data in another array to filter it
          this.createChart("bar");//first, we create a bar char

        },
        error: (e) => console.error(e)
      });



  }


}
