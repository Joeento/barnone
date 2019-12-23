import React, {useCallback} from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import APIClient from '../apiClient'

import Dropzone from 'react-dropzone'

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '80vh'
  
  },
  dropzone_container: {
    height: '100%'
  },
  dropzone_box: {
    height: '100%',
    position: 'relative',
    backgroundColor: '#EFEFEF',
    border: '2px dashed rgba(0, 0, 0, 0.54)',
    borderRadius: '10px'
  },
  dropzone_text: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translateY(-50%)',
    fontSize: '1.5em'
  }
});

class UploadPanel extends React.Component {
  constructor(props) {
    super(props);

    this.apiClient = new APIClient();
    this.handleUpload = this.handleUpload.bind(this);
  }


  handleUpload(acceptedFiles) {
    let self = this;

    self.props.openUploadModal();

    let formData = new FormData();
    for (let i = 0; i < acceptedFiles.length; i++) {
      formData.append('images[]', acceptedFiles[i]);
    }
    self.apiClient.createBarcode(formData).then(function(data) {
      self.props.setBarcodes(data.barcodes);
      self.props.closeUploadModal(data.images_sent, data.barcodes_found);
    });
    
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <Dropzone  onDrop={this.handleUpload}>
          {({getRootProps, getInputProps}) => (
            <section className={classes.dropzone_container}>
              <div className={classes.dropzone_box} {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={classes.dropzone_text}>Drag 'n' drop some files here, or click to select files</div>
              </div>
            </section>
          )}
        </Dropzone>
      </Paper>
    );
  }
}

UploadPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadPanel);
