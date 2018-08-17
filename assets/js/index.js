import 'style/style.scss';
import DashboardComponent from 'DashboardComponent';

(function () {
  d3.dsv(',', 'dist/data/athlete_events.csv', function (row) {
    return {
      name: row['Name'],
      sex: row['Sex'],
      age: row['Age'] !== 'NA' ? +row['Age'] : null,
      height: row['Height'] !== 'NA' ? +row['Height'] : null,
      weight: row['Weight'] !== 'NA' ? +row['Weight'] : null,
      team: row['Team'],
      games: row['Games'],
      year: +row['Year'],
      season: row['Season'],
      sport: row['Sport'],
      event: row['Event'],
      medal: row['Medal']
    };
  }).then(function (athletes) {
    let dashboard = new DashboardComponent(athletes);
    dashboard.init();
  });
})();