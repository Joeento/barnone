import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  loadingImage: {
    display: 'block',
    margin: 'auto'
  }
});

class UploadModal extends React.Component {
  render() {
    const classes = this.props.classes;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        onClose={this.props.handleClose}
      >
        <div className={`${classes.paper} ${classes.modal}`}>
          <Typography variant="h6" id="modal-title">
            Uploading Your Image(s)
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            Your file(s) are being uploaded and processed.  If any barcodes are found, they will appear in the right panel.
          </Typography>
          <div>
            <img className={classes.loadingImage} src="images/loading.gif" alt="Loading..." />
          </div>
        </div>
      </Modal>
    );
  }
}

UploadModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadModal);