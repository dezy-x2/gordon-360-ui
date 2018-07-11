import About from './views/About';
import ActivitiesAll from './views/ActivitiesAll';
import ActivityEdit from './views/ActivityEdit';
import ActivityProfile from './views/ActivityProfile';
import Home from './views/Home';
import Help from './views/Help';
import CoCurricularTranscript from './views/CoCurricularTranscript';
import Events from './views/Events';
import EventsAttended from './views/EventsAttended';
import Profile from './views/Profile';
import MyProfile from './views/MyProfile';

// Route order must be from most specific to least specific (i.e. `/user/:username` before `/user`)
export default [
  {
    name: 'Home',
    path: '/',
    exact: true,
    component: Home,
  },
  {
    name: 'About',
    path: '/about',
    component: About,
  },
  {
    name: 'Edit Activity',
    path: '/activity/:activityId/edit',
    component: ActivityEdit,
  },
  {
    name: 'Activity Profile',
    path: '/activity/:sessionCode/:activityCode',
    component: ActivityProfile,
  },
  {
    name: 'Activities',
    path: '/activities',
    component: ActivitiesAll,
  },
  {
    name: 'Help',
    path: '/help',
    component: Help,
  },
  {
    name: 'Transcript',
    path: '/transcript',
    component: CoCurricularTranscript,
  },
  {
    name: 'Events',
    path: '/events',
    component: Events,
  },
  {
    name: 'Attended',
    path: '/attended',
    component: EventsAttended,
  },
  {
    name: 'Profile',
    path: '/profile/:username',
    component: Profile,
  },
  {
    name: 'My Profile',
    path: '/myprofile/:username',
    component: MyProfile,
  },
];
