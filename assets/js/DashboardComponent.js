import * as crossfilter from 'crossfilter2';
import NumberOfAthletesPerYearChart from './charts/NumberOfAthletesPerYearChart';
import WeightHeightChart from './charts/WeightHeightChart';
import AgeYearChart from './charts/AgeYearChart';

export default class DashboardComponent {
  constructor (athletes) {
    this.athletes = crossfilter(athletes);
  }

  init () {
    this.initYearAndAthletesCountChart();
    this.initWeightAndHeightChart();
    this.initAgeYearChart();
  }

  initYearAndAthletesCountChart () {
    let numberOfAthletesPerYearChart = new NumberOfAthletesPerYearChart(this.athletes);
    numberOfAthletesPerYearChart.render();
  }

  initWeightAndHeightChart () {
    let weightAndHeightChart = new WeightHeightChart(this.athletes);
    weightAndHeightChart.render();
  }

  initAgeYearChart () {
    let ageYearChart = new AgeYearChart(this.athletes);
    ageYearChart.render();
  }
}
