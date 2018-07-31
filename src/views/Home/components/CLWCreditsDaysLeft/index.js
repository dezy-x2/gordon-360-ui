import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Doughnut, defaults } from 'react-chartjs-2';

import { gordonColors } from '../../../../theme';
import user from '../../../../services/user';
import session from '../../../../services/session';
import GordonLoader from '../../../../components/Loader';

import './CLWChart.css';
import { Tooltip } from '@material-ui/core';

export default class CLWCreditsDaysLeft extends Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);

    this.state = {
      daysLeft: [],
      chapelCredits: {},
      error: null,
      loading: true,
      currSessionDescription: '',
    };
  }

  componentWillMount() {
    this.loadData();
  }

  async loadData() {
    this.setState({ loading: true });
    try {
      const daysLeftPromise = session.getDaysLeft();
      const chapelCreditsPromise = user.getChapelCredits();
      const currSessionPromise = session.getCurrent();
      const daysLeft = await daysLeftPromise;
      const chapelCredits = await chapelCreditsPromise;
      const currSession = await currSessionPromise;
      const currSessionDescription = currSession.SessionDescription.replace(
        /(Academic Year)|(Grad)/gm,
        '',
      );
      this.setState({ loading: false, daysLeft, chapelCredits, currSessionDescription });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      throw this.state.error;
    }

    defaults.global.legend.display = false;
    let content;
    if (this.state.loading === true) {
      content = <GordonLoader />;
    } else {
      const daysLeft = this.state.daysLeft[0];
      const pastDays = this.state.daysLeft[1] - daysLeft;

      const options = {
        cutoutPercentage: 25,
        tooltips: {
          // Allow different tooltips for different datasets within the same pie;
          callbacks: {
            // Code taken from https://github.com/chartjs/Chart.js/issues/1417
            label: function(item, data) {
              return (
                data.datasets[item.datasetIndex].label[item.index] +
                ': ' +
                data.datasets[item.datasetIndex].data[item.index]
              );
            },
          },
        },
        legend: false,
      };

      const { current, required } = this.state.chapelCredits;
      const remaining = current > required ? 0 : required - current;

      const data = {
        legendEntries: ['Days Finished', 'CL&W Credits'],
        legendColors: [gordonColors.primary.blue, gordonColors.primary.cyan],
        datasets: [
          {
            label: ['Days Finished', 'Days Remaining'],
            data: [pastDays, daysLeft],
            backgroundColor: [gordonColors.primary.blue, gordonColors.neutral.lightGray],
          },
          {
            label: ['CL&W Credits Earned', 'CL&W Credits Remaining'],
            data: [current, remaining],
            backgroundColor: [gordonColors.primary.cyan, gordonColors.neutral.lightGray],
          },
        ],
      };

      content = (
        <div>
          <Grid
            container
            justify="space-around"
            spacing={0}
            style={{ paddingTop: 5, paddingBottom: 10 }}
          >
            <Grid item>
              <Typography variant="body1" style={{ color: 'gray', textAlign: 'center' }}>
                {`${daysLeft} Days Left`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" style={{ color: 'gray', textAlign: 'center' }}>
                {`${current} CL&W Credit` + (current === 1 ? '' : 's')}
              </Typography>
            </Grid>
          </Grid>
          {/* <Grid container justify="center">
            <Grid item>
              <div class="legend">
                <div class="entry">
                  <span class="entry-label" style={{ background: gordonColors.primary.blue }} />
                  <span class="entry-text">Days Finished</span>
                </div>
                <div class="entry">
                  <span class="entry-label" style={{ background: gordonColors.primary.cyan }} />
                  <span class="entry-text">CL&amp;W Credits</span>
                </div>
              </div>
            </Grid>
          </Grid> */}
          <Doughnut data={data} height={175} options={options} />
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Tooltip
                id="tooltip-days-finished"
                classes={{ tooltip: 'tooltip' }}
                title="Days Finished in Semester"
              >
                <div className="label-text" style={{ color: gordonColors.primary.blue }}>
                  {pastDays}
                </div>
              </Tooltip>
              <div class="entry-text">Days Finished</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Tooltip
                id="tooltip-chapel-credits"
                classes={{ tooltip: 'tooltip' }}
                title="CL&W Credits Earned"
              >
                <div className="label-text" style={{ color: gordonColors.primary.cyan }}>
                  {current}
                </div>
              </Tooltip>
              <div class="entry-text">CL&W Credits</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="headline" style={{ textAlign: 'center', paddingTop: 5 }}>
            {this.state.currSessionDescription}
          </Typography>
          {content}
        </CardContent>
      </Card>
    );
  }
}
