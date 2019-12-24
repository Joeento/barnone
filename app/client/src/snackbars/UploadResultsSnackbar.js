import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  snackbar: {
    backgroundColor: green[600],
  },
  close: {
    padding: theme.spacing(0.5),
  },
});

class UploadResultsSnackbar extends React.Component {
  render() {
    const classes = this.props.classes;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.props.open}
        onClose={this.props.handleClose}
      >
        <SnackbarContent
          aria-describedby="message-id"
          className={classes.snackbar}
          message={<div id="message-id"> {this.props.barcodes_found} barcodes were found in {this.props.images_sent} images.</div>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.props.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

UploadResultsSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadResultsSnackbar);