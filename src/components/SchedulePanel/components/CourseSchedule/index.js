import React, { Component, Fragment } from 'react';
import Moment, { Now } from 'moment';

import Calendar from 'react-big-calendar/dist/react-big-calendar';
import MomentLocalizer from 'react-big-calendar/lib/localizers/moment';

import GordonLoader from '../../../../components/Loader';
import schedule from './../../../../services/schedule';

import './courseschedule.css';

export default class CourseSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.courseInfo = null;
  }

  componentWillMount() {
    this.loadData();
  }

  async loadData() {
    const courseEventsPromise = schedule.makeScheduleCourses();
    const courseInfo = await courseEventsPromise;
    this.courseInfo = courseInfo;

    console.log('Schedule :', this.courseInfo);

    this.setState({ loading: false });
  }

  render() {
    const resourceMap = [
      { resourceId: 1, resourceTitle: 'Sunday' },
      { resourceId: 2, resourceTitle: 'Monday' },
      { resourceId: 3, resourceTitle: 'Tuesday' },
      { resourceId: 4, resourceTitle: 'Wednesday' },
      { resourceId: 5, resourceTitle: 'Thursday' },
      { resourceId: 6, resourceTitle: 'Friday' },
      { resourceId: 7, resourceTitle: 'Saturday' },
    ];

    // Localizer is always required for react-big-calendar initialization
    let formats = {
      dayHeaderFormat: (date, localizer = MomentLocalizer(Moment)) =>
        localizer.format(date, 'MMMM YYYY'),
    };

    const dayStart = new Date();
    dayStart.setHours(6, 0, 0, 0);

    const dayEnd = new Date();
    dayEnd.setHours(22, 0, 0, 0);

    let content;
    if (this.state.loading) {
      content = <GordonLoader />;
    } else {
      let Resource = ({ localizer = MomentLocalizer(Moment) }) => (
        <Calendar
          events={this.courseInfo}
          localizer={localizer}
          min={dayStart}
          max={dayEnd}
          step={15}
          timeslots={4}
          defaultView="day"
          view={['day']}
          onSelectEvent={this.handleRemoveButton}
          defaultDate={Now.date}
          resources={resourceMap}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          formats={formats}
        />
      );
      content = Resource(MomentLocalizer(Moment));
    }

    return <Fragment>{content}</Fragment>;
  }
}
