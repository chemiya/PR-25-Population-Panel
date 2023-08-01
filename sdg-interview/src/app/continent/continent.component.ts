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
  countriesFilter: Country[] = [];
  showChart="bar";
  chart: any;
  minSlider:number=0;
  maxSlider:number=1500000000;
  continent="";
  visibilityChart="show-chart"
  
  ngOnInit(){
    this.continent=this.route.snapshot.params["continent"];
    this.dataOfContinent(this.continent)
  }

  dataOfContinent(continent:string) {
    this.restCountriesService.dataOfContinent(continent)//busco el usuario
      .subscribe({
        next: (data) => {
          
         

          data.forEach((country:any)=>{
          
            
            
            
            
            
            if(country.capital==undefined){
              var countryElement=new Country(country.name.common,country.population,country.flags.png,"no data")
            
              this.countries.push(countryElement)
            }else{
              var countryElement=new Country(country.name.common,country.population,country.flags.png,country.capital[0])
            
              this.countries.push(countryElement)
            }
            
              
            
          })




          this.countriesFilter=this.countries;
          
          this.initialChart();
          

          

        },
        error: (e) => console.error(e)
      });



  }

 

  initialChart(){
    var countriesNames:string[];
    countriesNames= this.countries.map(item => item.name);
    var countriesPopulations:number[];
    countriesPopulations = this.countries.map(item => item.population);



    this.showChart="bar";
    var data = {
      labels: countriesNames,
      datasets: [{
        label: 'Population in country',
        data: countriesPopulations,
        borderWidth: 1
      }]
    }

    var options: any;
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


    if (this.chart) {
      this.chart.destroy();
    }


    this.chart = new Chart("myChart", {
      type: "bar",
      data: data,
      options: options
    });

  }

  
  applySlider(){
    this.countriesFilter=this.countries.filter((country)=>(country.population<=this.maxSlider && country.population>=this.minSlider))
  console.log(this.countriesFilter)
  }

  inputChangeMin(event:any){
    this.minSlider=(event.target.value)
  }

  inputChangeMax(event:any){
    this.maxSlider=(event.target.value)
  }

  changeSelectChart(event: any) {
    if(event.target.value!="bar"){
      this.visibilityChart="hide-chart"
    }else{
      this.visibilityChart="show-chart"
    }
    
    this.showChart=event.target.value
    
    
  }

}
