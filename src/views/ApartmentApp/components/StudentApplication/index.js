//Main apartment application page
import React, { Component } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Button,
  Typography,
} from '@material-ui/core/';
import GordonLoader from '../../../../components/Loader';
import AlertDialogBox from '../../../../components/AlertDialogBox';
import SimpleSnackbar from '../../../../components/Snackbar';
import ApplicantList from '../../../../components/ApartmentApplicantList';
import user from '../../../../services/user';
import housing from '../../../../services/housing';
import '../../apartmentApp.css';
const MAX_NUM_APPLICANTS = 8;
// const MIN_NUM_APPLICANTS = 2;

const renderInstructionsCard = () => {
  return (
    <Card>
      <CardHeader title="Apartment Application Instructions" className="card-header" />
      <CardContent>
        <Typography variant="body1">Placeholder Text</Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde
          suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
          dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default class StudentApplication extends Component {
  constructor(props) {
    super(props);
    this.peopleSearch = React.createRef();
    this.state = {
      loading: true,
      saving: false,
      network: 'online',
      applicationCardsOpen: false,
      submitDialogOpen: false, // Use this for saving app (later feature)
      editDialogOpen: false,
      applicationID: -1, // Default value of -1 indicate to backend that the application ID number is not yet known
      primaryUsername: null, // The username of the primary applicant
      applicants: [],
    };
    this.editDialogText = '';
    this.snackbarText = '';
    this.snackbarSeverity = '';
    this.saveButtonAlertTimeout = null;
  }

  componentDidMount() {
    this.loadProfile();
    this.loadHousingInfo();
    this.loadSavedApplication();
  }

  /**
   * Loads the user's profile info only once (at start)
   */
  async loadProfile() {
    this.setState({ loading: true });
    try {
      const profile = await user.getProfileInfo();
      this.setState({ userProfile: profile });
      let applicants = this.state.applicants;
      applicants.push(profile);
      this.setState({ applicants });
      this.setState({ loading: false });
    } catch (error) {
      // Do Nothing
    }
    // DEBUG
    // this.handleSearchSubmit('Gahngnin.Kim');
    // this.handleSearchSubmit('Christian.Kunis');
    // this.handleSearchSubmit('Nick.Noormand');
    // this.handleSearchSubmit('Joshua.Rogers');
  }

  /**
   * Loads the user's saved apartment application, if one exists
   */
  async loadHousingInfo() {
    this.setState({ loading: true });
    try {
      /**
       * TODO: Once saving application has been implemented in the backend,
       * TODO: this will be replaced with a call to the load the application info.
       * TODO: The getHousingInfo was made obsolete after the Hello World
       */
      let housingInfo = await housing.getHousingInfo();
      let onOffCampus = String(housingInfo[0].OnOffCampus);
      let onCampusRoom = String(housingInfo[0].OnCampusRoom);
      this.setState({ onOffCampus, onCampusRoom, loading: false });
    } catch (error) {
      // Do Nothing
    }
  }

  async loadSavedApplication() {
    // TODO: Implement this once save/load of application data has been implemented in the backend
    if (!this.state.primaryUsername) {
      this.setState({ primaryUsername: this.props.userProfile.AD_Username });
    }
  }

  handleOpenNewApplication = () => {
    this.setState({ applicationCardsOpen: true });
  };

  handleSubmitApplication = () => {
    //! Placeholder
    this.setState({ applicationCardsOpen: false });
  };

  /**
   * Callback for apartment people search submission
   * @param {String} searchSelection Username for student
   */
  handleSearchSubmit = (searchSelection) => {
    this.setState({ updating: true });
    if (searchSelection) {
      // The method is separated from callback because user API service must be handled inside an async method
      this.addApplicant(searchSelection);
    }
    this.setState({ updating: false });
  };

  /**
   * Add an applicant to the list, identified by username
   * @param {String} username Username for student
   */
  async addApplicant(username) {
    let applicants = this.state.applicants; // make a separate copy of the array
    try {
      // Get the profile of the selected user
      let applicantProfile = await user.getProfileInfo(username);
      if (applicants.length >= MAX_NUM_APPLICANTS) {
        // Display an error if the user try to add an applicant when the list is full
        this.snackbarText = 'You cannot add more than ' + MAX_NUM_APPLICANTS + ' applicants';
        this.snackbarSeverity = 'warning';
        this.setState({ snackbarOpen: true });
      } else if (!String(applicantProfile.PersonType).includes('stu')) {
        // Display an error if the selected user is not a student
        this.snackbarText =
          'Could not add ' + String(applicantProfile.fullName) + ' because they are not a student.';
        this.snackbarSeverity = 'warning';
        this.setState({ snackbarOpen: true });
      } else if (applicants.some((applicant) => applicant.AD_Username === username)) {
        // Display an error if the selected user is already in the list
        this.snackbarText = String(applicantProfile.fullName) + ' is already in the list.';
        this.snackbarSeverity = 'info';
        this.setState({ snackbarOpen: true });
      } else {
        // Add the profile object to the list of applicants
        applicants.push(applicantProfile);
        this.setState({ applicants });
        if (this.state.applicants.some((applicant) => applicant.AD_Username === username)) {
          this.snackbarText =
            String(applicantProfile.fullName) + ' was successfully added to the list.';
          this.snackbarSeverity = 'success';
          this.setState({ snackbarOpen: true });
        }
      }
    } catch (error) {
      this.snackbarText = 'Something went wrong while trying to add this person. Please try again.';
      this.snackbarSeverity = 'error';
      this.setState({ snackbarOpen: true });
    }
  }

  /**
   * Callback for changing the primary applicant
   * @param {StudentProfileInfo} profile The StudentProfileInfo object for the person who is to be made the primary applicant
   */
  handleChangePrimary = (profile) => {
    this.setState({ updating: true });
    if (profile) {
      if (this.state.applicants.includes(profile)) {
        this.setState({ newPrimaryApplicant: profile, editDialogOpen: true });
      }
    }
  };

  handleChangePrimaryAccepted = () => {
    if (this.state.newPrimaryApplicant) {
      try {
        this.setState({ primaryUsername: this.state.newPrimaryApplicant.AD_Username });
        this.saveApplication(this.state.primaryUsername, this.state.applicants);
      } catch (error) {
        this.snackbarText = 'Something went wrong while trying to save the new primary applicant.';
        this.snackbarSeverity = 'error';
        this.setState({ snackbarOpen: true, saving: 'failed' });
      }
      this.handleCloseOkay();
    }
  };

  /**
   * Callback for applicant list remove button
   * @param {String} profileToRemove Username for student
   */
  handleRemove = (profileToRemove) => {
    this.setState({ updating: true });
    if (profileToRemove) {
      let applicants = this.state.applicants; // make a separate copy of the array
      let index = applicants.indexOf(profileToRemove);
      if (index !== -1) {
        applicants.splice(index, 1);
        this.setState({ applicants });
      }
    }
    this.setState({ updating: false });
  };

  /**
   * Callback for apartment application save button
   */
  handleSaveButtonClick = () => {
    let debugMessage = 'DEBUG: Save button was clicked'; //! DEBUG
    console.log(debugMessage); //! DEBUG
    // The method is separated from callback because the housing API service must be handled inside an async method
    this.saveApplication(
      this.state.applicationID,
      this.state.primaryUsername,
      this.state.applicants,
    );
  };

  /**
   * Save the current state of the application to the database
   * @param {Number} applicationID the application ID number if it is known, else it is -1
   * @param {String} primaryUsername the student username of the person filling out the application
   * @param {StudentProfileInfo[]} applicants Array of StudentProfileInfo objects
   */
  async saveApplication(applicationID, primaryUsername, applicants) {
    this.setState({ saving: true });
    this.saveButtonAlertTimeout = null;
    let result = null;
    try {
      result = await housing.saveApartmentApplication(applicationID, primaryUsername, applicants);
    } catch {
      result = false;
    }
    if (result !== null) {
      console.log(result); //! DEBUG
      this.setState({ applicationID: result, saving: 'success' });
    } else {
      this.snackbarText = 'Something went wrong while trying to save the application.';
      this.snackbarSeverity = 'error';
      this.setState({ snackbarOpen: true, saving: 'failed' });
    }
    if (this.saveButtonAlertTimeout === null) {
      // Shows the success icon for 6 seconds and then returns back to normal button
      this.saveButtonAlertTimeout = setTimeout(() => {
        this.saveButtonAlertTimeout = null;
        this.setState({ saving: false });
      }, 6000);
    }
  }

  handleCloseSnackbar = (event, reason) => {
    // Prevent the snackbar from closing if the user clicks outside the snackbar
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  handleCloseDialog = (event, reason) => {
    // Prevent the dialog box from closing if the user clicks outside the dialog box
    if (reason === 'clickaway') {
      return;
    }
    this.handleCloseOkay();
  };

  handleCloseOkay = () => {
    this.setState({ submitDialogOpen: false, editDialogOpen: false });
  };

  render() {
    if (this.props.authentication) {
      /**
       * Used to re-render the page when the network connection changes.
       * this.state.network is compared to the message received to prevent
       * multiple re-renders that creates extreme performance lost.
       * The origin of the message is checked to prevent cross-site scripting attacks
       */
      window.addEventListener('message', (event) => {
        if (
          event.data === 'online' &&
          this.state.network === 'offline' &&
          event.origin === window.location.origin
        ) {
          this.setState({ network: 'online' });
        } else if (
          event.data === 'offline' &&
          this.state.network === 'online' &&
          event.origin === window.location.origin
        ) {
          this.setState({ network: 'offline' });
        }
      });

      const primaryApplicantAlertText = (
        <span>
          If you change the primary applicant, you will no longer be able to edit this application
          yourself.
          <br />
          Are you sure you want to change the primary applicant?
        </span>
      );

      /**
       * Gets status of current network connection for online/offline rendering
       * Defaults to online in case of PWA not being possible
       */
      const networkStatus = JSON.parse(localStorage.getItem('network-status')) || 'online';

      if (networkStatus === 'online' && this.props.authentication) {
        // TODO: if (this.props.userProfile.AD_Username !== this.state.primaryUsername) {display the page but all as read-only (not editable)}
        return (
          <div>
            {this.state.loading ? (
              <GordonLoader />
            ) : (
              <div className="apartment-application">
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={12} lg={10}>
                    <Card>
                      <CardContent>
                        <Grid container direction="row" justify="flex-end">
                          <Grid item xs={3}>
                            <Typography variant="body1">Placeholder Text</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Button
                              variant="contained"
                              onClick={this.handleOpenNewApplication}
                              color="primary"
                              disabled={this.state.applicationCardsOpen}
                            >
                              Create a new application
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    {/* <Collapse in={!this.state.applicationCardsOpen} timeout="auto" unmountOnExit>
                      {renderInstructionsCard()}
                    </Collapse> */}
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Collapse in={!this.state.applicationCardsOpen} timeout="auto" unmountOnExit>
                      {renderInstructionsCard()}
                    </Collapse>
                  </Grid>
                  <Grid item>
                    <Collapse in={this.state.applicationCardsOpen} timeout="auto" unmountOnExit>
                      <Grid container direction="row-reverse" justify="center" spacing={2}>
                        <Grid item xs={12} md={4}>
                          {renderInstructionsCard()}
                        </Grid>
                        <Grid container item xs={12} md={8} lg={6} direction="column" spacing={2}>
                          <Grid item>
                            <ApplicantList
                              maxNumApplicants={MAX_NUM_APPLICANTS}
                              userProfile={this.props.userProfile}
                              primaryUsername={this.state.primaryUsername}
                              applicants={this.state.applicants}
                              saving={this.state.saving}
                              savingSuccess={this.state.savingSuccess}
                              onSearchSubmit={this.handleSearchSubmit}
                              onChangePrimary={this.handleChangePrimary}
                              onApplicantRemove={this.handleRemove}
                              onSaveButtonClick={this.handleSaveButtonClick}
                              authentication={this.props.authentication}
                            />
                            <AlertDialogBox
                              open={this.state.editDialogOpen}
                              onClose={this.handleCloseDialog}
                              severity={'warning'}
                              title={'Change primary applicant?'}
                              text={primaryApplicantAlertText}
                              cancelButtonClicked={this.handleCloseOkay}
                              cancelButtonName={'Cancel'}
                              confirmButtonClicked={this.handleChangePrimaryAccepted}
                              confirmButtonName={'Accept'}
                            />
                            <SimpleSnackbar
                              text={this.snackbarText}
                              severity={this.snackbarSeverity}
                              open={this.state.snackbarOpen}
                              onClose={this.handleCloseSnackbar}
                            />
                          </Grid>
                          <Grid item>
                            <Card>
                              <CardHeader title="Preferred Halls" className="card-header" />
                              <CardContent>
                                <Typography variant="body1">Placeholder text</Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item>
                            <Card>
                              <CardContent>
                                <Typography variant="h5">Hello World:</Typography>

                                <h3>{'You name: ' + this.props.userProfile.fullName}</h3>
                                <h3>{'On/Off Campus: ' + this.state.onOffCampus}</h3>
                                <h3>{'Your room number: ' + this.state.onCampusRoom}</h3>
                                <br />
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} lg={10}>
                          <Card>
                            <CardContent>
                              <Grid container direction="row" justify="flex-end">
                                <Grid item xs={3}>
                                  <Typography variant="body1">Placeholder Text</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Button
                                    variant="contained"
                                    onClick={this.handleSubmitApplication}
                                    color="primary"
                                    disabled={!this.state.applicationCardsOpen}
                                  >
                                    Submit Application
                                  </Button>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Collapse>
                  </Grid>
                </Grid>
              </div>
            )}
          </div>
        );
      }
    } else {
      // The user is not logged in
      return (
        <Grid container justify="center">
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent
                style={{
                  margin: 'auto',
                  textAlign: 'center',
                }}
              >
                <h1>You are not logged in.</h1>
                <br />
                <h4>You must be logged in to use the Apartment Applications page.</h4>
                <br />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    window.location.pathname = '';
                  }}
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }
  }
}
