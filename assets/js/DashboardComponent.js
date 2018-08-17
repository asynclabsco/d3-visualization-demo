import * as crossfilter from 'crossfilter2';
import NumberOfAthletesPerYearChart from './charts/NumberOfAthletesPerYearChart';

export default class DashboardComponent {
  constructor (athletes) {
    this.athletes = crossfilter(athletes);
  }

  init () {
    this.initYearAndAthletesCountChart();
  }

  initYearAndAthletesCountChart () {
    let numberOfAthletesPerYearChart = new NumberOfAthletesPerYearChart(this.athletes);
    numberOfAthletesPerYearChart.render();
  }
}
