import React from 'react';
import './App.css';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import NavBar from './ui/NavBar';
import UploadPanel from './ui/UploadPanel';
import ResultsPanel from './ui/ResultsPanel';
import UploadModal from './modals/UploadModal';
import UploadResultsSnackbar from './snackbars/UploadResultsSnackbar';
import Fab from '@material-ui/core/Fab';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Tooltip from '@material-ui/core/Tooltip';
import red from '@material-ui/core/colors/red';

import APIClient from './apiClient'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#d6d6d6',
    height: '100vh',
  },
  
  grid_container: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
    color: theme.palette.common.white,
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[600],
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcodes: [],
      uploadModalOpen: false,
      uploadSnackbarOpen: false,
      images_sent: 0,
      barcodes_found: 0
    };

    this.apiClient = new APIClient();

    this.setBarcodes = this.setBarcodes.bind(this);
    this.openUploadModal = this.openUploadModal.bind(this);
    this.closeUploadModal = this.closeUploadModal.bind(this);
    this.closeUploadSnackbar = this.closeUploadSnackbar.bind(this);
  }

  componentDidMount() {
    let self = this;
    self.apiClient.getBarcodes().then(function(data) {
      self.setBarcodes(data);
    });
  }

  setBarcodes(barcodes) {
    this.setState({
      barcodes: barcodes
    });
  }

  openUploadModal() {
    this.setState({
      uploadModalOpen: true
    });
  }
  closeUploadModal(images_sent, barcodes_found) {
    this.setState({
      uploadModalOpen: false
    });
    this.setState({
      uploadSnackbarOpen: true,
      images_sent: images_sent,
      barcodes_found: barcodes_found
    });
  }

  closeUploadSnackbar() {
    this.setState({
      uploadSnackbarOpen: false
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <div className={classes.root}>
          <NavBar />
          <div className={classes.grid_container}>
            <Grid  container spacing={2} >
              <Grid item xs={6}>
                <UploadPanel setBarcodes={this.setBarcodes} openUploadModal={this.openUploadModal} closeUploadModal={this.closeUploadModal} />
              </Grid>
              <Grid item xs={6}>
                <ResultsPanel barcodes={this.state.barcodes} />
              </Grid>
            </Grid>
          </div>
          <UploadResultsSnackbar open={this.state.uploadSnackbarOpen} images_sent={this.state.images_sent} barcodes_found={this.state.barcodes_found} handleClose={this.closeUploadSnackbar} />
          <UploadModal open={this.state.uploadModalOpen} handleClose={this.closeUploadModal} />
          <Tooltip title="Export Barcodes to PDF">
            <Fab href="/api/barcodes/pdf" className={classes.fab} color='primary'>
              <SaveAltIcon />
            </Fab>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
