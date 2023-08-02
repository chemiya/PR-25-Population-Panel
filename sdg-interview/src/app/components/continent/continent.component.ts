import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestCountriesService } from '../../rest-countries-service/rest-countries.service';
import { Country } from '../../models/Country';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-continent',
  templateUrl: './continent.component.html',
  styleUrls: ['./continent.component.css']
})
export class ContinentComponent {
  constructor(private restCountriesService: RestCountriesService, private route: ActivatedRoute) { }
  countries: Country[] = [];
  countriesFilter: Country[] = [];
  showChart = "bar";
  chart: any;
  minSlider: number = 0;
  maxSlider: number = 1500000000;
  continent = "";


  ngOnInit() {
    this.continent = this.route.snapshot.params["continent"];//we obtain the name of the continent
    this.dataOfContinent(this.continent)//we obtain the countries in the continent
  }

  dataOfContinent(continent: string) {
    this.restCountriesService.dataOfContinent(continent)
      .subscribe({
        next: (data) => {


          //we obtain all the data from the countries in the continent
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




        },
        error: (e) => console.error(e)
      });



  }



  createChart() {
    //we obtain the names and populations of each country
    var countriesNames: string[];
    countriesNames = this.countriesFilter.map(item => item.name);
    var countriesPopulations: number[];
    countriesPopulations = this.countriesFilter.map(item => item.population);


    //we define the chart
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


    if (this.chart) {
      this.chart.destroy();
    }


    this.chart = new Chart("chart", {
      type: "bar",
      data: data,
      options: options
    });

  }

//to apply the filter of population with the values of the slider
  applySlider(event:any) {
    //we filter the continents that fulfill the conditions
    this.countriesFilter = this.countries.filter((country) => (country.population <= event[1] && country.population >= event[0]))
    if(this.showChart=="bar"){//if bar chart is selected, we create a new one with the new data
      this.chart.destroy();
      this.createChart()
    }
  }

  

  //to manage when the user change the chart
  changeSelectChart(event: any) {
  
    this.showChart = event.target.value//we store the type of chart
    this.chart.destroy();
    if(this.showChart=="bar"){//if the user wants a bar chart, we create a new one
      
      this.createChart()
    }


  }

}
