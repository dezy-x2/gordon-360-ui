import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import GetAppIcon from '@material-ui/icons/GetApp';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { gordonColors } from '../../theme';
import './index.css';

// Button styles
let styles = {
  button: {
    cancel: {
      border: `1px solid ${gordonColors.primary.blue}`,
      color: gordonColors.primary.blue,
    },
    install: {
      border: `1px solid ${gordonColors.primary.blue}`,
      backgroundColor: gordonColors.primary.blue,
      color: 'white',
    },
  },
};

// Styles that are applied to the toggles of the device type and device platform
const toggleStyles = makeStyles({
  root: {
    backgroundColor: gordonColors.primary.blue,
    borderRadius: 10,
    color: 'white',
    height: 48,
    padding: '0 30px',
    '&:hover': {
      backgroundColor: `${gordonColors.primary.blueShades[400]} !important`,
    },
  },
  selected: {
    backgroundColor: `${gordonColors.primary.blueShades[700]} !important`,
    color: 'white !important',
  },
});

// Holds the instructions for every device with its corresponding pictures
const devices = {
  names: ['Desktop', 'Mobile'],
  Desktop: {
    names: [''],
    All: [
      [
        'Open Google Chrome and go to "360.gordon.edu". You may use other Chrome-based browsers such as Brave but Google Chrome is recommended. If you do not have Google Chrome installed,',
        'https://www.google.com/chrome/',
        require('./images/Desktop/Desktop-Open-Chrome.png'),
        'Desktop Installation of Gordon 360 Step 1',
      ],
      [
        `Re-click on the button "Install Gordon 360" and click on "Install" to receive a prompt from your browser (Skip to step 5 afterwards). If you do not see the "Install" button, go to the next step.`,
        require('./images/Desktop/Desktop-Installation.png'),
        'Desktop Installation Gordon 360 Step 2',
      ],
      [
        `Click on Google Chrome's menu which is located at the top right of the browser window (the three vertical dots).`,
        require('./images/Desktop/Desktop-Chrome-Menu.png'),
        'Desktop Installation Gordon 360 Step 3',
      ],
      [
        'Once the menu is opened, click on "Install Gordon 360" which is located on the lower-end of the menu.',
        require('./images/Desktop/Desktop-Chrome-Install-360.png'),
        'Android Installation Gordon 360 Step 4',
      ],
      [
        'Lastly, click "Install" to install Gordon 360 on your computer!',
        require('./images/Desktop/Desktop-Install-Button.png'),
        'Desktop Installation Gordon 360 Step 5',
      ],
    ],
  },
  Mobile: {
    names: ['Apple', 'Android'],
    Apple: [
      [
        'Open Safari and go to "360.gordon.edu".',
        require('./images/Mobile/Apple/iPhone-Open-Safari.png'),
        'Apple Installation Gordon 360 Step 1',
      ],
      [
        'Tap on the share button located at the bottom of the screen in the center.',
        require('./images/Mobile/Apple/iPhone-Share-Button.png'),
        'Apple Installation Gordon 360 Step 2',
      ],
      [
        'For users on iOS 12 and below, scroll the second column to the right and tap on "Add to Home Screen" (Skip to step 5 afterwards). For users on iOS 13 and above, go to the next step.',
        require('./images/Mobile/Apple/iPhone-AddToHomeScreen-Button-One.png'),
        'Apple Installation Gordon 360 Step 3',
      ],
      [
        'For users on iOS 13 and above, scroll down and tap on "Add to Home Screen".',
        require('./images/Mobile/Apple/iPhone-AddToHomeScreen-Button-Two.png'),
        'Apple Installation Gordon 360 Step 4',
      ],
      [
        'Lastly, tap on "Add" in the top right corner to install Gordon 360 on your home screen!',
        require('./images/Mobile/Apple/iPhone-Add-Button.png'),
        'Apple Installation Gordon 360 Step 5',
      ],
    ],
    Android: [
      [
        'Open Google Chrome and go to "360.gordon.edu". If you do not have Google Chrome installed,',
        'https://play.google.com/store/apps/details?id=com.android.chrome&hl=en_US',
        require('./images/Mobile/Android/Android-Open-Chrome.jpg'),
        'Android Installation Gordon 360 Step 1',
      ],
      [
        `Re-tap on "Install Gordon 360" and tap on "Install" to receive a prompt from your browser (Skip to step 5 afterwards).`,
        require('./images/Mobile/Android/Android-Install.png'),
        'Mac Installation Gordon 360 Step 2',
      ],
      [
        `If you do not see the "Install" button, make sure your browser is Google Chrome. If it is, tap on Google Chrome's menu which is located at the top right of the screen (the three vertical dots).`,
        require('./images/Mobile/Android/Android-Chrome-Menu.jpg'),
        'Android Installation Gordon 360 Step 3',
      ],
      [
        'Tap on "Add to Home screen".',
        require('./images/Mobile/Android/Android-Chrome-AddToHomeScreen.jpg'),
        'Android Installation Gordon 360 Step 4',
      ],
      [
        'Lastly, tap on "Add" to install Gordon 360 on your home screen!',
        require('./images/Mobile/Android/Android-Add-Button.jpg'),
        'Android Installation Gordon 360 Step 5',
      ],
    ],
  },
};

const PWAInstructions = (props) => {
  const [device, setDevice] = useState(null);
  const [platform, setPlatform] = useState(null);
  const classes = toggleStyles();

  // Handles which device is selected
  const handleDeviceChange = (event, selectedDevice) => {
    // Checks the selected device to prevent the user from deselecting a selected toggle
    if (selectedDevice === 'Desktop') {
      setDevice(selectedDevice);
      setPlatform('All');
    } else if (selectedDevice !== null) {
      setDevice(selectedDevice);
      // The platform is reset since a new device was selected
      setPlatform(null);
    }
  };

  // Handles which platform is selected
  const handlePlatformChange = (event, selectedPlatform) => {
    // Checks the selected platform to prevent the user from deselecting a selected toggle
    if (selectedPlatform !== null) setPlatform(selectedPlatform);
  };

  // Gets the instructions based upon the selected device type and device platform
  function getInstructions() {
    // Checks to see if the user is already using the required browser
    if (device && platform) {
      // Creates the pre-text of the device and platform chosen
      let preText = '';
      // Device : Desktop
      if (device === 'Desktop') {
        preText = 'All Desktops';
      }
      // Device: Mobile
      else {
        // Platform: Apple
        if (platform === 'Apple') {
          preText = 'iOS';
        }
        // Platform: Android
        else {
          preText = 'Android';
        }
      }

      return (
        <Grid
          container
          xs={12}
          justify="space-between"
          alignItems="center"
          className="pwa-instructions-content-container-toggles-instructions"
        >
          <Grid
            container
            xs={12}
            className="pwa-instructions-content-container-toggles-instructions-choice"
          >
            <Typography variant="h5">Instructions for {preText}</Typography>
          </Grid>
          {devices[device][platform].map((step, index) => {
            /**
             * The first step is processed differently from the rest in order to show a link to
             * download Google Chrome. This is for all platforms except "Apple" since the PWA can
             * only be installed through Safari with Apple
             */
            if (index === 0 && platform !== 'Apple') {
              return (
                <Grid container xs={12}>
                  <Grid
                    container
                    xs={12}
                    alignItems="center"
                    className="pwa-instructions-content-container-toggles-instructions-text"
                  >
                    <Typography
                      variant="h6"
                      className="pwa-instructions-content-container-toggles-instructions-text-step"
                    >
                      Step {index + 1}:&nbsp;
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      className="pwa-instructions-content-container-toggles-instructions-text-instruction"
                    >
                      {step[0]}&nbsp;
                      <a href={step[1]}>click here</a>.
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    xs={12}
                    className="pwa-instructions-content-container-toggles-instructions-image"
                  >
                    <img src={step[2]} alt={step[3]} />
                  </Grid>
                </Grid>
              );
            }
            // Creates the JSX of the current step containing the instruction and its corresponding image
            return (
              <Grid container xs={12}>
                <Grid
                  container
                  xs={12}
                  alignItems="center"
                  className="pwa-instructions-content-container-toggles-instructions-text"
                >
                  <Typography
                    variant="h6"
                    className="pwa-instructions-content-container-toggles-instructions-text-step"
                  >
                    Step {index + 1}:&nbsp;
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="pwa-instructions-content-container-toggles-instructions-text-instruction"
                  >
                    {step[0]}
                  </Typography>
                </Grid>
                <Grid
                  container
                  xs={12}
                  className="pwa-instructions-content-container-toggles-instructions-image"
                >
                  <img src={step[1]} alt={step[2]} />
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      );
    }
  }

  function createContent() {
    // If the browser has quick PWA installation capability
    if (props.deferredPWAPrompt) {
      return (
        <Grid container xs={12} justify="center" className="pwa-instructions-content-install">
          <Grid container xs={12} justify="center" alignItems="center">
            <Grid item xs={2} sm={1} justify="center" alignItems="center">
              <GetAppIcon fontSize="large" color="primary" />
            </Grid>
            <Grid item xs={10} sm={11} alignItems="center">
              <Typography className="pwa-instructions-content-install-text">
                Click install below and follow the prompt to install Gordon 360 on your device.
              </Typography>
            </Grid>
          </Grid>
          <Grid container className="pwa-instructions-content-install-buttons">
            <Button
              onClick={() => {
                // Exits out the dialog box
                props.handleDisplay();
              }}
              style={styles.button.cancel}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Calls the browser's default prompt to do a quick installation of the PWA
                props.deferredPWAPrompt.prompt();
              }}
              style={styles.button.install}
            >
              Install
            </Button>
          </Grid>
        </Grid>
      );
    }
    // If the browser doesn't have quick PWA installation capability
    else {
      return (
        <Grid container xs={12} className="pwa-instructions-content-container">
          <Grid container xs={12} className="pwa-instructions-content-container-toggles">
            {/* Selection of Device's Type */}
            <Grid
              container
              xs={12}
              justify="space-between"
              alignItems="center"
              className="pwa-instructions-content-container-toggles-platform"
            >
              <Grid
                container
                xs={12}
                sm={6}
                className="pwa-instructions-content-container-toggles-platform-text"
              >
                <Typography variant="h6" color="primary">
                  Select Device Type:
                </Typography>
              </Grid>
              <Grid
                container
                xs={12}
                sm={6}
                justify="flex-end"
                className="pwa-instructions-content-container-toggles-platform-toggles"
              >
                <ToggleButtonGroup
                  value={device}
                  exclusive
                  onChange={handleDeviceChange}
                  aria-label="text formatting"
                >
                  {devices.names.map((item) => {
                    return (
                      <ToggleButton
                        value={item}
                        aria-label={item}
                        classes={classes}
                        selected={device === item ? true : false}
                      >
                        <Typography>{item}</Typography>
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
              </Grid>
            </Grid>
            {/* Selection of Device's Platform */}
            {device && device === 'Mobile' && (
              <Grid
                container
                xs={12}
                justify="space-between"
                alignItems="center"
                className="pwa-instructions-content-container-toggles-platform"
              >
                <Grid
                  container
                  xs={12}
                  sm={6}
                  className="pwa-instructions-content-container-toggles-platform-text"
                >
                  <Typography variant="h6" color="primary">
                    Select Platform:
                  </Typography>
                </Grid>
                <Grid
                  container
                  xs={12}
                  sm={6}
                  justify="flex-end"
                  className="pwa-instructions-content-container-toggles-platform-toggles"
                >
                  <ToggleButtonGroup
                    value={platform}
                    exclusive
                    onChange={handlePlatformChange}
                    aria-label="text formatting"
                  >
                    {devices[device] &&
                      devices[device].names &&
                      devices[device].names.map((item) => {
                        return (
                          <ToggleButton
                            value={item}
                            aria-label={item}
                            classes={classes}
                            selected={platform === item ? true : false}
                            onClick={() => {
                              window.scroll({
                                top: 100,
                                left: 100,
                                behavior: 'smooth',
                              });
                            }}
                          >
                            <Typography>{item}</Typography>
                          </ToggleButton>
                        );
                      })}
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            )}
            {device && platform && getInstructions()}
          </Grid>
          <Grid container xs={12} className="pwa-instructions-content-container-button-cancel">
            <Button
              onClick={() => {
                // Exits out the dialog box
                props.handleDisplay();
              }}
              style={styles.button.cancel}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      );
    }
  }

  return (
    <Dialog
      open={props.open}
      disableBackdropClick
      fullWidth
      maxWidth="sm"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <Grid container className="pwa-instructions">
        <Grid container xs={12} justify="center" className="pwa-instructions-title">
          <Typography variant="h5">
            {props.deferredPWAPrompt
              ? 'Install Gordon 360'
              : ' Instructions to install Gordon 360 '}
          </Typography>
        </Grid>
        <DialogContent className="pwa-instructions-content">{createContent()}</DialogContent>
      </Grid>
    </Dialog>
  );
};

export default PWAInstructions;
