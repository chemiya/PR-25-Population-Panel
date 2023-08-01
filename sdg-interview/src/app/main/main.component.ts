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
  constructor(private restCountriesService: RestCountriesService,private router: Router) { }
  allCountries: any = [];
  chart: any;
  showCarts=false;
  minSlider:number=0;
  maxSlider:number=7000000000;
  visibilityChart="show-chart"

 

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

  populationsFilter:Continent[]=[
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
    if(event.target.value=="cards"){
      this.visibilityChart="hide-chart"
      this.showCarts=true;
    }else{
      this.visibilityChart="show-chart"
      this.createChart(event.target.value)
    }


    
  }
  changeSelectContinent(event: any) {
    this.router.navigate(['/continent/'+event.target.value])
  }
  

  applySlider(){
    this.populationsFilter=this.populations.filter((continent)=>(continent.population<=this.maxSlider && continent.population>=this.minSlider))
    this.chart.destroy();
    this.createChart("bar")
  }

  inputChangeMin(event:any){
    this.minSlider=(event.target.value)
  }

  inputChangeMax(event:any){
    this.maxSlider=(event.target.value)
  }

  createChart(typeChart: any) {

    var populationsNames:string[];
    populationsNames= this.populationsFilter.map(item => item.name);
    var populationsNumbers:number[];
    populationsNumbers = this.populationsFilter.map(item => item.population);



   
      this.showCarts=false;
      var data = {
        labels: populationsNames,
        datasets: [{
          label: 'Population in continent',
          data: populationsNumbers,
          borderWidth: 1
        }]
      }
  
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

          this.populationsFilter=this.populations;
          this.createChart("bar");

        },
        error: (e) => console.error(e)
      });



  }


}
