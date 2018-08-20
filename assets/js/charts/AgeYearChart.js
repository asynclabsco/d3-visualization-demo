export default class AgeYearChart {
  constructor (athletes) {
    this.ageGroup = 3;
    this.dimension = athletes.dimension((athlete) => {
      return athlete.year;
    });

    this.createGroupFromDimension();
    this.chartContainer = d3.select('#ageYearChart');
    this.chart = null;
    this.chartWidth = 960;
    this.chartHeight = 960;
    this.margin = 50;
    this.chartWidthWithoutMargin = this.chartWidth - this.margin;
    this.chartHeightWithoutMargin = this.chartHeight - this.margin;
    this.yearScale = null;
    this.colorScale = null;
    this.countBottomToTopScale = null;
    this.tooltipContainer = null;
  }

  getAthleteAgeGroup (age) {
    age = age || 0;
    return age - age % this.ageGroup;
  }

  createGroupFromDimension () {
    this.group = this.dimension.group()
      .reduce(
        // reduceAdd()
        (output, input) => {
          output.count++;
          output.year = input.year;

          let currentAgeGroup = this.getAthleteAgeGroup(input.age);

          if (!output.ageGroup.hasOwnProperty(currentAgeGroup)) {
            output.ageGroup[currentAgeGroup] = {
              ageGroup: currentAgeGroup,
              count: 0,
              year: input.year,
              stackPosition: 0
            };
          }

          output.ageGroup[currentAgeGroup].count++;
          output.ageGroup[currentAgeGroup].stackPosition = 0;

          return output;
        },
        // reduceRemove()
        (output, input) => {
          output.count--;
          output.year = input.year;
          output.ageGroup = this.getAthleteAgeGroup(input.age);

          if (!output.ageGroup.hasOwnProperty(currentAgeGroup)) {
            output.ageGroup[currentAgeGroup] = {
              ageGroup: currentAgeGroup,
              count: 0,
              year: input.year,
              stackPosition: 0
            };
          }

          output.ageGroup[currentAgeGroup].count--;

          return output;
        },
        // reduceInitial()
        () => {
          return {count: 0, year: null, ageGroup: []};
        }
      )
      .order((p) => {
        return p.year;
      });

    console.log(this.group.top(Infinity));
  }

  render () {
    this.createSvg();
    this.initScales();
    this.drawAxes();
    this.drawBars();
  }

  createSvg () {
    this.chart = this.chartContainer
      .append('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);
  }

  initScales () {
    this.group.order((p) => {
      return p.count;
    });

    let maxCount = this.group.top(1)[0].value.count;
    console.log(maxCount);
    this.countWithMarginScale = d3.scaleLinear().domain([0, maxCount]).range(
      [this.margin, this.chartWidthWithoutMargin]);
    this.countScale = d3.scaleLinear().domain([0, maxCount]).range([0, this.chartWidth - this.margin * 2]);
    this.yearScale = d3.scaleLinear().domain([1894, 2018]).range([this.chartHeightWithoutMargin, this.margin]);
    this.colorScale = d3.scaleOrdinal(d3.schemeAccent);
  }

  drawAxes () {
    let yearAxis = d3.axisLeft(this.yearScale).ticks(30);
    let countAxis = d3.axisBottom(this.countWithMarginScale);

    this.chart
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', 'translate(' + this.margin + ' ,0)')
      .call(yearAxis);

    this.chart
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', 'translate(0, ' + this.chartHeightWithoutMargin + ')')
      .call(countAxis);
  }

  getBarsData () {
    let barData = this.group.top(Infinity);

    for (let i = 0; i < barData.length; i++) {
      let ageGroupArray = barData[i].value.ageGroup;

      for (let j = 0; j < ageGroupArray.length; j++) {
        let currentAgeGroup = barData[i].value.ageGroup[j];

        if (currentAgeGroup === undefined) {
          continue;
        }

        for (let k = 0; k < ageGroupArray.length; k++) {
          let checkingAgeGroup = ageGroupArray[k];

          if (checkingAgeGroup === undefined || checkingAgeGroup.ageGroup >= currentAgeGroup.ageGroup) {
            continue;
          }

          barData[i].value.ageGroup[j].stackPosition += checkingAgeGroup.count;
        }
      }
    }

    return barData;
  }

  drawBars () {
    let barData = this.getBarsData();

    this.chart
      .append('g')
      .attr('transform', 'translate(' + this.margin + ' ,0)')
      .selectAll('g')
      .attr('class', 'c-bars')
      .data(barData)
      .enter()
      .selectAll('rect')
      .data((d) => {
        return Object.values(d.value.ageGroup);
      })
      .enter()
      .append('rect')
      .attr('x', (d) => {
        return this.countScale(d.stackPosition);
      })
      .attr('y', (d) => {
        return this.yearScale(d.year);
      })
      .attr('height', (d) => {
        return '10px';
      })
      .attr('width', (d) => {
        return this.countScale(d.count);
      })
      .style('fill', (d) => {
        return this.colorScale(d.ageGroup / 100);
      })
      .on('mouseover', (d) => {
        this.showTooltip(
          'Year: ' + d.year + '<br>Age: ' + d.ageGroup + '-' + (d.ageGroup + this.ageGroup) + '<br>Count: ' + d.count,
          d3.event.pageX,
          d3.event.pageY
        );
      })
      .on('mouseout', (d) => {
        this.hideTooltip();
      });
  }

  createTooltipIfDoesntExist () {
    this.tooltipContainer = this.chartContainer
      .append('div')
      .attr('class', 'c-tooltip');
  }

  showTooltip (content, left, top) {
    this.createTooltipIfDoesntExist();

    this.tooltipContainer
      .html(content)
      .style('left', left + 'px')
      .style('top', top + 'px');

    this.tooltipContainer
      .transition()
      .duration(200)
      .style('opacity', 1);
  }

  hideTooltip () {
    this.createTooltipIfDoesntExist();

    d3.selectAll('.c-tooltip').remove();
    this.tooltipContainer = null;
  }
}