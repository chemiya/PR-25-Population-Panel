import { Component } from '@angular/core';
import { RestCountriesService } from '../rest-countries-service/rest-countries.service';

import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(private restCountriesService: RestCountriesService) { }
  allCountries: any = [];
  //populations: number[] = [0, 0, 0, 0, 0, 0, 0];

  populations={
    "Europe":0,
    "Asia":0,
    "Africa":0,
    "Oceania":0,
    "North America":0,
    "South America":0,
    "Antarctica":0
  }

  ngOnInit() {
    this.fetchData();
   


  }

  chart(){
    
    

    var data= {
      labels: ["Europe","Asia","Africa","Oceania","North America","South America","Antarctica"],
      datasets: [{
        label: 'Population in continent',
        data: [this.populations["Europe"],this.populations["Asia"],this.populations["Africa"],this.populations["Oceania"],this.populations["North America"],this.populations["South America"],this.populations["Antarctica"]],
        borderWidth: 1
      }]
    }

    var options= {
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

  /*
  var options = {
    responsive: true,
    maintainAspectRatio: false
};*/

    var chart = new Chart("myChart", {
      type: "bar",//pie
      data: data,
      options: options
  });
  }


  fetchData() {
    this.restCountriesService.getData()//busco el usuario
      .subscribe({
        next: (data) => {
          this.allCountries = data;

          this.allCountries.forEach((country: any) => {

            switch (country.continents[0]) {
              case "Europe":
                this.populations["Europe"] += country.population;
                break;
              case "Asia":
                this.populations["Asia"] += country.population;
                break;

              case "Africa":
                this.populations["Africa"] += country.population;
                break;

              case "Oceania":
                this.populations["Oceania"] += country.population;
                break;

              case "North America":
                this.populations["North America"] += country.population;
                break;
              case "South America":
                this.populations["South America"] += country.population;
                break;
              case "Antarctica":
                this.populations["Antarctica"] += country.population;
                break;
              default:
                console.log(country.continents[0])
            }


          });

          this.chart();

        },
        error: (e) => console.error(e)
      });

      
      
  }


}
