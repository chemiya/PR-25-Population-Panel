import { Component } from '@angular/core';
import { RestCountriesService } from '../rest-countries-service/rest-countries.service';

import { Chart, registerables } from 'chart.js';
import { Continent } from '../models/Continent';

Chart.register(...registerables);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(private restCountriesService: RestCountriesService) { }
  allCountries: any = [];
  chart: any;
  showCarts=false;

  //populations: number[] = [0, 0, 0, 0, 0, 0, 0];

  /*populations = {
    "Europe": 0,
    "Asia": 0,
    "Africa": 0,
    "Oceania": 0,
    "North America": 0,
    "South America": 0,
    "Antarctica": 0
  }*/
  populations:Continent[]=[
    {name:"Europe",population:0},
    {name:"Asia",population:0},
    {name:"Africa",population:0},
    {name:"Oceania",population:0},
    {name:"North America",population:0},
    {name:"South America",population:0},
    {name:"Antarctica",population:0}

  ];

  ngOnInit() {
    this.fetchData();



  }
  changeSelectChart(event: any) {
    this.createChart(event.target.value)
  }
  getObjectKeys(obj: any): any[] {
    return Object.entries(obj);
  }

  createChart(typeChart: any) {





    if (typeChart != "cards") {
      this.showCarts=false;
      var data = {
        labels: ["Europe", "Asia", "Africa", "Oceania", "North America", "South America", "Antarctica"],
        datasets: [{
          label: 'Population in continent',
          data: [this.populations[0].population,this.populations[1].population,this.populations[2].population,this.populations[3].population,this.populations[4].population,this.populations[5].population,this.populations[6].population],
          borderWidth: 1
        }]
      }
  
      var options: any;
      if (typeChart == "bar") {
        options = {
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
                text: 'Population'
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
  
  
      this.chart = new Chart("myChart", {
        type: typeChart,
        data: data,
        options: options
      });
    }else{
      this.showCarts=true;
    }
    


  }


  fetchData() {
    this.restCountriesService.getData()//busco el usuario
      .subscribe({
        next: (data) => {
          this.allCountries = data;
          

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

          this.createChart("bar");

        },
        error: (e) => console.error(e)
      });



  }


}
