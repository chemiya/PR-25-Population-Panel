import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestCountriesService } from '../../rest-countries-service/rest-countries.service';
import { Country } from '../../models/Country';
import { Chart } from 'chart.js';
import { MaxSliderService } from 'src/app/max-slider-service/max-slider.service';

@Component({
  selector: 'app-continent',
  templateUrl: './continent.component.html',
  styleUrls: ['./continent.component.scss']
})
export class ContinentComponent implements OnInit {
  constructor(private restCountriesService: RestCountriesService, private route: ActivatedRoute,private maxSliderService:MaxSliderService) { }
  countries: Country[] = [];
  countriesFilter: Country[] = [];
  showChart = "bar";
  chart: any;
  minSlider: number = 0;
  maxSlider: number = 1500000000;
  continent = "";
  maxPopulationCountry:number=0;

  ngOnInit() {
    this.continent = this.route.snapshot.params["continent"];
    this.dataOfContinent(this.continent)//we obtain the countries in the continent
  }

  dataOfContinent(continent: string) {
    this.restCountriesService.dataOfContinent(continent)
      .subscribe({
        next: (data) => {
          data.forEach((country: any) => {
            //in some cases the capital is not defined
            if (country.capital == undefined) {
              var countryElement = new Country(country.name.common, country.population, country.flags.png, "no data")
              this.countries.push(countryElement)
            } else {
              var countryElement = new Country(country.name.common, country.population, country.flags.png, country.capital[0])
              this.countries.push(countryElement)
            }
          })

          this.countriesFilter = this.countries;//we store the original data in another array to filter it
          this.createChart();//first, we create a bar char
          this.maxPopulationCountry=this.countries.reduce((max, object) => (object.population > max ? object.population : max), -Infinity);
          this.maxSliderService.setValue(this.maxPopulationCountry);
        },
        error: (e) => console.error(e)
      });
  }
  createChart() {
    //we obtain the names and populations of each country to show in the chart
    var countriesNames: string[];
    countriesNames = this.countriesFilter.map(item => item.name);
    var countriesPopulations: number[];
    countriesPopulations = this.countriesFilter.map(item => item.population);
    
    this.showChart = "bar";
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
            text: 'Country'
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
    //before creating the new chart, we destroy the previous one
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("chart", {
      type: "bar",
      data: data,
      options: options
    });
  }

  applySlider(event:any) {
    //we filter the continents that fulfill the conditions
    this.countriesFilter = this.countries.filter((country) => (country.population <= event[1] && country.population >= event[0]))
    if(this.showChart=="bar"){
      //we destroy the previous chart because if we don't destroy it, we will have conflicts
      this.chart.destroy();
      this.createChart()
    }
  }

  changeSelectChart(event: any) {
    this.showChart = event.target.value
    this.chart.destroy();
    if(this.showChart=="bar"){
      this.createChart()
    }
  }
}
