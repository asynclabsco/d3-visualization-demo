import * as crossfilter from 'crossfilter2';
import NumberOfAthletesPerYearChart from './charts/NumberOfAthletesPerYearChart';
import WeightHeightChart from './charts/WeightHeightChart';

export default class DashboardComponent {
  constructor (athletes) {
    this.athletes = crossfilter(athletes);
  }

  init () {
    this.initYearAndAthletesCountChart();
    this.initWeightAndHeightChart();
  }

  initYearAndAthletesCountChart () {
    let numberOfAthletesPerYearChart = new NumberOfAthletesPerYearChart(this.athletes);
    numberOfAthletesPerYearChart.render();
  }

  initWeightAndHeightChart () {
    let weightAndHeightChart = new WeightHeightChart(this.athletes);
    weightAndHeightChart.render();
  }
}
