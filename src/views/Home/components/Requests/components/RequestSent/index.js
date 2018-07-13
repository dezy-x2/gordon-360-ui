import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';

import { gordonColors } from '../../../../../../theme';
import membership from '../../../../../../services/membership';

export default class RequestSent extends Component {
  handleCancel(requestID) {
    membership.cancelRequest(requestID);
    window.location.reload();
  }

  render() {
    const button = {
      color: gordonColors.secondary.red,
    };

    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Grid container alignItems="center">
            <Grid item xs={6} sm={4} md={6} lg={4}>
              <Typography>{this.props.member.ActivityDescription}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={6} lg={4} align="center">
              <Typography>{this.props.member.ParticipationDescription}</Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={12} lg={4}>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={6} align="center">
                  <Typography>{this.props.member.RequestApproved} </Typography>
                </Grid>
                <Grid item xs={6} align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    style={button}
                    onClick={() => this.handleCancel(this.props.member.RequestID)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
      </Grid>
    );
  }
}
