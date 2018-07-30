import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';
import SchoolIcon from '@material-ui/icons/School';
import HomeIcon from '@material-ui/icons/Home';
import CityIcon from '@material-ui/icons/LocationCity';
import BriefcaseIcon from 'react-icons/lib/fa/briefcase';
import BuildingIcon from 'react-icons/lib/fa/building';
import BookIcon from 'react-icons/lib/fa/book';
import GlobeIcon from 'react-icons/lib/fa/globe';
import { Typography } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import uniqBy from 'lodash/uniqBy';
import goStalk from '../../services/goStalk';
import Button from '@material-ui/core/Button';
import { gordonColors } from '../../theme';
import PeopleSearchResult from './components/PeopleSearchResult';
import GordonLoader from '../../components/Loader';
import './peopleSearch.css';

const styles = {
  FontAwesome: {
    fontSize: 20,
    marginLeft: 2,
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  CardContent: {
    marginLeft: 8,
  },
  headerStyle: {
    backgroundColor: gordonColors.primary.blue,
    color: '#FFF',
    padding: '10px',
  },
  colorSwitchBase: {
    color: gordonColors.neutral.lightGray,
    '&$colorChecked': {
      color: gordonColors.primary.cyan,
      '& + $colorBar': {
        backgroundColor: gordonColors.primary.cyan,
      },
    },
  },
  colorBar: {},
  colorChecked: {},
};

class PeopleSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nameExpanded: true,
      academicsExpanded: false,
      homeExpanded: false,
      offDepExpanded: false,

      // arrays of table data from backend
      majors: [],
      minors: [],
      states: [],
      countries: [],
      departments: [],
      buildings: [],

      // Keyboard string values
      firstNameSearchValue: '',
      lastNameSearchValue: '',
      homeCitySearchValue: '',
      // Drop-down menu values
      majorSearchValue: '',
      minorSearchValue: '',
      classTypeSearchValue: '',
      stateSearchValue: '',
      countrySearchValue: '',
      departmentSearchValue: '',
      buildingSearchValue: '',

      includeAlumni: false,
      peopleSearchResults: null,
      header: '',
    };
  }

  async componentWillMount() {
    try {
      const [majors, minors, states, countries, departments, buildings] = await Promise.all([
        goStalk.getMajors(),
        goStalk.getMinors(),
        goStalk.getStates(),
        goStalk.getCountries(),
        goStalk.getDepartments(),
        goStalk.getBuildings(),
      ]);
      this.setState({
        majors,
        minors,
        states,
        countries,
        departments,
        buildings,
      });
    } catch (error) {
      // error
    }
  }

  handleNameExpandClick = () => {
    this.setState(state => ({ nameExpanded: !state.nameExpanded }));
  };
  handleAcademicsExpandClick = () => {
    this.setState(state => ({ academicsExpanded: !state.academicsExpanded }));
  };
  handleHomeExpandClick = () => {
    this.setState(state => ({ homeExpanded: !state.homeExpanded }));
  };
  handleOffDepExpandClick = () => {
    this.setState(state => ({ offDepExpanded: !state.offDepExpanded }));
  };

  handleFirstNameInputChange = e => {
    this.setState({
      firstNameSearchValue: e.target.value,
    });
  };
  handleLastNameInputChange = e => {
    this.setState({
      lastNameSearchValue: e.target.value,
    });
  };
  handleMajorInputChange = e => {
    this.setState({
      majorSearchValue: e.target.value,
    });
  };
  handleMinorInputChange = e => {
    this.setState({
      minorSearchValue: e.target.value,
    });
  };
  handleClassInputChange = value => {
    this.setState({
      classSearchValue: value,
    });
  };
  handleHomeCityInputChange = e => {
    this.setState({
      homeCitySearchValue: e.target.value,
    });
  };
  handleStateInputChange = e => {
    this.setState({
      stateSearchValue: e.target.value,
    });
  };
  handleCountryInputChange = e => {
    this.setState({
      countrySearchValue: e.target.value,
    });
  };
  handleDepartmentInputChange = e => {
    this.setState({
      departmentSearchValue: e.target.value,
    });
  };
  handleBuildingInputChange = e => {
    this.setState({
      buildingSearchValue: e.target.value,
    });
  };

  handleChangeIncludeAlumni() {
    this.setState({ includeAlumni: !this.state.includeAlumni });
  }

  async search(
    includeAlumni,
    firstName,
    lastName,
    major,
    minor,
    classType,
    homeCity,
    state,
    country,
    building,
    department,
  ) {
    if (
      this.state.includeAlumni === false &&
      this.state.firstNameSearchValue === '' &&
      this.state.lastNameSearchValue === '' &&
      this.state.classTypeSearchValue === '' &&
      this.state.majorSearchValue === '' &&
      this.state.minorSearchValue === '' &&
      this.state.homeCitySearchValue === '' &&
      this.state.stateSearchValue === '' &&
      this.state.countrySearchValue === '' &&
      this.state.departmentSearchValue === '' &&
      this.state.buildingSearchValue === ''
    ) {
      // do not search
    } else {
      this.setState({ header: <GordonLoader />, peopleSearchResults: null });
      console.log(
        'Search params: includeAlumni ',
        includeAlumni,
        ' FirstName: ',
        firstName,
        ' LastName: ',
        lastName,
        ' Major: ',
        major,
        ' Minor: ',
        minor,
        ' Class: ',
        classType,
        ' Hometown: ',
        homeCity,
        ' State: ',
        state,
        ' Country: ',
        country,
        ' Dept: ',
        department,
        ' Building: ',
        building,
      );
      let peopleSearchResults = [];
      peopleSearchResults = await goStalk.search(
        includeAlumni,
        firstName,
        lastName,
        major,
        minor,
        classType,
        homeCity,
        state,
        country,
        department,
        building,
      );
      // peopleSearchResults = uniqBy(peopleSearchResults, 'AD_Username'); // Remove any duplicate entries
      if (peopleSearchResults.length === 0) {
        this.setState({
          peopleSearchResults: (
            <Grid item xs={12}>
              <Typography variant="headline" align="center">
                No results found.
              </Typography>
            </Grid>
          ),
          header: '',
        });
      } else {
        this.setState({
          peopleSearchResults: peopleSearchResults.map(person => (
            <PeopleSearchResult Person={person} />
          )),
          header: (
            <div style={styles.headerStyle}>
              <Grid container direction="row">
                <Grid item xs={1} />
                <Grid item xs={2}>
                  <Typography variant="body2" style={styles.headerStyle}>
                    FIRST NAME
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" style={styles.headerStyle}>
                    LAST NAME
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="body2" style={styles.headerStyle}>
                    TYPE
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" style={styles.headerStyle}>
                    CLASS/JOB TITLE
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" style={styles.headerStyle}>
                    EMAIL
                  </Typography>
                </Grid>
              </Grid>
            </div>
          ),
        });
      }
    }
  }

  handleEnterKeyPress = event => {
    if (event.key === 'Enter') {
      this.search(
        this.state.includeAlumni,
        this.state.firstNameSearchValue,
        this.state.lastNameSearchValue,
        this.state.majorSearchValue,
        this.search.minorSearchValue,
        this.state.classTypeSearchValue,
        this.state.homeCitySearchValue,
        this.state.stateSearchValue,
        this.state.countrySearchValue,
        this.state.departmentSearchValue,
        this.state.buildingSearchValue,
      );
    }
  };

  render() {
    const { classes } = this.props;

    const majorOptions = this.state.majors.map(major => (
      <MenuItem value={major} key={major}>
        {major}
      </MenuItem>
    ));

    const minorOptions = this.state.minors.map(minor => (
      <MenuItem value={minor} key={minor}>
        {minor}
      </MenuItem>
    ));

    const stateOptions = this.state.states.map(state => (
      <MenuItem value={state} key={state}>
        {state}
      </MenuItem>
    ));

    const countryOptions = this.state.countries.map(country => (
      <MenuItem value={country} key={country}>
        {country}
      </MenuItem>
    ));

    const departmentOptions = this.state.departments.map(department => (
      <MenuItem value={department} key={department}>
        {department}
      </MenuItem>
    ));

    const buildingOptions = this.state.buildings.map(building => (
      <MenuItem value={building} key={building}>
        {building}
      </MenuItem>
    ));

    return (
      <Grid container justify="center" spacing="16">
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent
              style={{
                marginLeft: 8,
                marginTop: 8,
              }}
            >
              <Typography variant="headline">Name</Typography>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <PersonIcon />
                </Grid>
                <Grid item xs={11}>
                  <TextField
                    id="first-name"
                    label="First Name"
                    max="3"
                    fullWidth
                    value={this.state.firstNameSearchValue}
                    onChange={this.handleFirstNameInputChange}
                    onKeyDown={this.handleEnterKeyPress}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <PersonIcon />
                </Grid>
                <Grid item xs={11}>
                  <TextField
                    id="last-name"
                    label="Last Name"
                    fullWidth
                    value={this.state.lastNameSearchValue}
                    onChange={this.handleLastNameInputChange}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <CardContent>
              <CardActions
                className={[classes.actions, 'card-expansion']}
                disableActionSpacing
                onClick={this.handleAcademicsExpandClick}
              >
                <Typography variant="headline">Academics</Typography>
                <IconButton
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: this.state.academicsExpanded,
                  })}
                  onClick={this.handleAcademicsExpandClick}
                  aria-expanded={this.state.academicsExpanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>

              <Collapse
                in={this.state.academicsExpanded}
                timeout="auto"
                unmountOnExit
                style={styles.CardContent}
              >
                <Grid container spacing={8} alignItems="baseline">
                  <Grid item>
                    <BookIcon style={styles.FontAwesome} />
                  </Grid>
                  <Grid item xs={11}>
                    <FormControl fullWidth>
                      <InputLabel>Major</InputLabel>
                      <Select
                        value={this.state.majorSearchValue}
                        onChange={this.handleMajorInputChange}
                        input={<Input id="major" />}
                      >
                        <MenuItem label="All Majors" value="">
                          <em>All</em>
                        </MenuItem>
                        {majorOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="baseline">
                  <Grid item>
                    <BookIcon style={styles.FontAwesome} />
                  </Grid>
                  <Grid item xs={11}>
                    <FormControl fullWidth>
                      <InputLabel>Minor</InputLabel>
                      <Select
                        value={this.state.minorSearchValue}
                        onChange={this.handleMinorInputChange}
                        input={<Input id="minor" />}
                      >
                        <MenuItem label="All Minors" value="">
                          <em>All</em>
                        </MenuItem>
                        {minorOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <SchoolIcon />
                  </Grid>
                  <Grid item xs={11}>
                    {/* 
                    TODO: 
                    THIS DOESN'T WORK YET I NEED TO FIGURE OUT HOW TO PASS THE VALUE OF THE 
                    SELECTED MENU ITEM TO THE SEARCH FUNCTION
                    
                    <FormControl fullWidth>
                      <InputLabel>Class</InputLabel>
                      <Select
                        // value={this.state.classTypeSearchValue}
                        // onChange={this.handleClassInputChange}
                        input={<Input id="class" />}
                      >
                        <MenuItem label="All Classes" value="">
                          <em>All</em>
                        </MenuItem >
                        <MenuItem value="1">
                        Freshman
                        </MenuItem>
                        <MenuItem onClick={this.handleClassInputChange.bind(this, '2')}>
                        Sophomore
                        </MenuItem>
                        <MenuItem value="3">
                        Junior
                        </MenuItem>
                        <MenuItem value="4">
                        Senior
                        </MenuItem>
                        <MenuItem value="5">
                        Graduate Student
                        </MenuItem>
                        <MenuItem value="6">
                        Undergraduate Conferred
                        </MenuItem>
                        <MenuItem value="7">
                        Graduate Conferred
                        </MenuItem>
                        <MenuItem value="0">
                        Unassigned
                        </MenuItem>
                      </Select>
                    </FormControl> */}
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>

            <CardContent>
              <CardActions
                className={[classes.actions, 'card-expansion']}
                disableActionSpacing
                onClick={this.handleHomeExpandClick}
              >
                <Typography variant="headline">Home</Typography>
                <IconButton
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: this.state.homeExpanded,
                  })}
                  onClick={this.handleHomeExpandClick}
                  aria-expanded={this.state.homeExpanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>

              <Collapse
                in={this.state.homeExpanded}
                timeout="auto"
                unmountOnExit
                style={styles.CardContent}
              >
                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <HomeIcon />
                  </Grid>
                  <Grid item xs={11}>
                    <TextField
                      id="hometown"
                      label="Hometown"
                      fullWidth
                      value={this.state.homeCitySearchValue}
                      onChange={this.handleHomeCityInputChange}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <CityIcon />
                  </Grid>
                  <Grid item xs={11}>
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        value={this.state.stateSearchValue}
                        onChange={this.handleStateInputChange}
                        input={<Input id="state" />}
                      >
                        <MenuItem label="All States" value="">
                          <em>All</em>
                        </MenuItem>
                        {stateOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="baseline">
                  <Grid item>
                    <GlobeIcon
                      style={{
                        fontSize: 22,
                        marginLeft: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={11}>
                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={this.state.countrySearchValue}
                        onChange={this.handleCountryInputChange}
                        input={<Input id="country" />}
                      >
                        <MenuItem label="All Countries" value="">
                          <em>All</em>
                        </MenuItem>
                        {countryOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>

            <CardContent>
              <CardActions
                className={[classes.actions, 'card-expansion']}
                disableActionSpacing
                onClick={this.handleOffDepExpandClick}
              >
                <Typography variant="headline">Building and Department</Typography>
                <IconButton
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: this.state.offDepExpanded,
                  })}
                  onClick={this.handleOffDepExpandClick}
                  aria-expanded={this.state.offDepExpanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>

              <Collapse
                in={this.state.offDepExpanded}
                timeout="auto"
                unmountOnExit
                style={styles.CardContent}
              >
                <Grid container spacing={8} alignItems="baseline">
                  <Grid item>
                    <BriefcaseIcon
                      style={{
                        fontSize: 22,
                        marginLeft: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={11}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={this.state.departmentSearchValue}
                        onChange={this.handleDepartmentInputChange}
                        input={<Input id="department-type" />}
                      >
                        <MenuItem label="All Departments" value="">
                          <em>All</em>
                        </MenuItem>
                        {departmentOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="baseline">
                  <Grid item>
                    <BuildingIcon
                      style={{
                        fontSize: 22,
                        marginLeft: 2,
                      }}
                    />
                  </Grid>

                  <Grid item xs={11}>
                    <FormControl fullWidth>
                      <InputLabel>Building</InputLabel>
                      <Select
                        value={this.state.buildingSearchValue}
                        onChange={this.handleBuildingInputChange}
                        input={<Input id="building-type" />}
                      >
                        <MenuItem label="All Buildings" value="">
                          <em>All</em>
                        </MenuItem>
                        {buildingOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
            <CardActions>
              <Grid container justify="center" alignItems="center">
                <Grid item xs={3}>
                  <Grid container justify="center" alignItems="center" direction="column">
                    <Switch
                      onChange={() => {
                        this.handleChangeIncludeAlumni();
                      }}
                      checked={this.state.includeAlumni}
                      classes={{
                        switchBase: classes.colorSwitchBase,
                        checked: classes.colorChecked,
                        bar: classes.colorBar,
                      }}
                    />
                    <Typography>
                      {this.state.includeAlumni ? 'Exclude Alumni' : 'Include Alumni'}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={9}>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.search(
                        this.state.includeAlumni,
                        this.state.firstNameSearchValue,
                        this.state.lastNameSearchValue,
                        this.state.majorSearchValue,
                        this.state.minorSearchValue,
                        this.state.classTypeSearchValue,
                        this.state.homeCitySearchValue,
                        this.state.stateSearchValue,
                        this.state.countrySearchValue,
                        this.state.departmentSearchValue,
                        this.state.buildingSearchValue,
                      );
                    }}
                    raised
                    fullWidth
                    variant="contained"
                  >
                    SEARCH
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
          <br />
          <Card>
            {this.state.header}
            {this.state.peopleSearchResults}
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PeopleSearch);
