import React, { Component } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import { CardHeader, CardContent } from '@material-ui/core';
import { Button } from '@material-ui/core';

import { gordonColors } from '../../../../theme';
import user from '../../../../services/user';
import session from '../../../../services/session';
import RequestsReceived from './components/RequestsReceived';
import RequestSent from './components/RequestSent';

export default class Requests extends Component {
  constructor(props) {
    super(props);

    this.handleExpandClick = this.handleExpandClick.bind(this);

    this.state = {
      requestsSent: [],
      involvementsLeading: [],
      open: false,
      loading: true,
    };
  }
  componentWillMount() {
    this.loadRequests();
  }

  async loadRequests() {
    this.setState({ loading: true });
    let requestsSent;
    let involvementsLeading;
    const id = user.getLocalInfo().id;
    involvementsLeading = await user.getLeaderPositions(user.getLocalInfo().id);
    const { SessionCode: sessionCode } = await session.getCurrent();

    requestsSent = await user.getSentMembershipRequests(id, sessionCode);

    this.setState({ requestsSent, involvementsLeading });
  }

  handleExpandClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    let receivedPanel;
    let received;
    let show;

    const button = {
      color: gordonColors.primary.cyan,
    };

    if (this.state.open === false) {
      show = 'Show';
    } else {
      show = 'Hide';
    }

    // For each involvement leading, render RequestsReceived component
    // which will render the individual requests
    received = this.state.involvementsLeading.map(involvement => (
      <Grid item>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title">{involvement.ActivityDescription}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RequestsReceived involvement={involvement} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    ));

    //If not a leader, don't render any RequestsReceived components
    if (this.state.involvementsLeading.length === 0) {
      receivedPanel = '';
    } else {
      receivedPanel = (
        <Grid item>
          <Grid container spacing={8} direction="column">
            <Grid item>
              <Typography variant="title">Requests Received</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="column">
                {received}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }

    // For each request sent, render RequestSent component
    let sent;
    if (this.state.requestsSent.length === 0) {
      sent = <Typography>No Requests to Show</Typography>;
    } else {
      sent = this.state.requestsSent.map(request => (
        <RequestSent member={request} key={request.RequestID} />
      ));
    }
    return (
      <Card>
        <CardHeader title="Membership Requests" />
        <CardContent>
          <Grid container direction="column" spacing={8}>
            {receivedPanel}
            <Grid item xs={12} sm={12}>
              <Grid container alignItems="baseline" direction="row" spacing={8}>
                <Grid item>
                  <Typography variant="title">Requests Sent </Typography>
                </Grid>
                <Grid item>
                  <Button size="small" style={button} onClick={this.handleExpandClick}>
                    {show}
                  </Button>
                </Grid>
              </Grid>
              <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                <Grid item xs={12} sm={12}>
                  {sent}
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
