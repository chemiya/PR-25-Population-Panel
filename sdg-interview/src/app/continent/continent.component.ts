import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestCountriesService } from '../rest-countries-service/rest-countries.service';
import { Country } from '../models/Country';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-continent',
  templateUrl: './continent.component.html',
  styleUrls: ['./continent.component.css']
})
export class ContinentComponent {
  constructor(private restCountriesService: RestCountriesService,private route: ActivatedRoute){}
  countries: Country[] = [];
  showCarts=false;
  chart: any;
  
  ngOnInit(){
    this.dataOfContinent(this.route.snapshot.params["continent"])
  }

  dataOfContinent(continent:string) {
    this.restCountriesService.dataOfContinent(continent)//busco el usuario
      .subscribe({
        next: (data) => {
          
          var contador=0;

          data.forEach((country:any)=>{
            var countryElement=new Country(country.name.common,country.population,country.flags.png,country.capital[0])
            
              this.countries.push(countryElement)
              
            
          })




          
          
          
          

          this.createChart("bar");

        },
        error: (e) => console.error(e)
      });



  }

  createChart(typeChart: any) {

   

    var countriesNames:string[];
    countriesNames= this.countries.map(item => item.name);
    var countriesPopulations:number[];
    countriesPopulations = this.countries.map(item => item.population);

    


    if (typeChart != "cards") {
      this.showCarts=false;
      var data = {
        labels: countriesNames,
        datasets: [{
          label: 'Population in country',
          data: countriesPopulations,
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
  changeSelectChart(event: any) {
    this.createChart(event.target.value)
  }

}
