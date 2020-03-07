import React from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import NavBar from './ui/NavBar';
import UploadPanel from './ui/UploadPanel';
import ResultsPanel from './ui/ResultsPanel';
import UploadModal from './modals/UploadModal';

import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import cogoToast from 'cogo-toast';

import { Container as FabContainer, Button, Link } from 'react-floating-action-button';

import APIClient from './apiClient'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcodes: [],
      uploadModalOpen: false,
      images_sent: 0,
      barcodes_found: 0
    };

    this.apiClient = new APIClient();

    this.setBarcodes = this.setBarcodes.bind(this);
    this.openUploadModal = this.openUploadModal.bind(this);
    this.closeUploadModal = this.closeUploadModal.bind(this);
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
      images_sent: images_sent,
      barcodes_found: barcodes_found
    });
    cogoToast.info(barcodes_found + " barcodes were found in " + images_sent + " images.", {
      position: 'bottom-left'
    });
  }

  render() {
    const { classes } = this.props;
    return (
        <div>
          <NavBar />
          <Container fluid className='panels-container'>
            <Row>
              <Col xs={6}>
                <UploadPanel setBarcodes={this.setBarcodes} openUploadModal={this.openUploadModal} closeUploadModal={this.closeUploadModal} />
              </Col>
              <Col xs={6}>
                <ResultsPanel barcodes={this.state.barcodes} />
              </Col>
            </Row>
          </Container>

          <UploadModal open={this.state.uploadModalOpen} handleClose={this.closeUploadModal} />
          <FabContainer className="export-fab">
              <Link
               tooltip="Export Barcodes to PDF"
               href="/api/barcodes/pdf">
                 <FontAwesomeIcon icon={faDownload} size="lg" />
              </Link>
          </FabContainer>
        </div>
    );
  }
}

export default App;
