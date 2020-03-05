import React from 'react';
import Modal from 'react-bootstrap/Modal';

import './UploadModal.css'

class UploadModal extends React.Component {
  render() {
    return (
      <Modal className='upload-modal' show={this.props.open} onHide={this.props.handleClose}>
        <Modal.Header>
          <Modal.Title>Uploading Your Image(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p variant="subtitle1" id="simple-modal-description">
              Your file(s) are being uploaded and processed.  If any barcodes are found, they will appear in the right panel.
            </p>
            <div>
              <img className='loading-image' src="images/loading.gif" alt="Loading..." />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default UploadModal;