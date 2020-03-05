import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import APIClient from '../apiClient';

import Dropzone from 'react-dropzone';

import './UploadPanel.css';

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
    return (
      <Card className='upload-card'>
        <Dropzone  onDrop={this.handleUpload}>
          {({getRootProps, getInputProps}) => (
            <section className='dropzone-container' >
              <div className='dropzone-box' {...getRootProps()}>
                <input {...getInputProps()} />
                <div className='dropzone-text'>Drag 'n' drop some files here, or click to select files</div>
              </div>
            </section>
          )}
        </Dropzone>
      </Card>
    );
  }
}

export default UploadPanel;
