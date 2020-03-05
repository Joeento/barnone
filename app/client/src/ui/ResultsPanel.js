import React from 'react'
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import './ResultsPanel.css';

class ResultsPanel extends React.Component {
  render() {
    return (
      <Card className='results-card'>
        <Card.Body>
          <Row>
            {this.props.barcodes.map(tile => (
              <Col key={tile._id} md={4}>
                <div className='barcode-image-container'>
                  <img className='barcode-image' src={'/public/barcodes/' + tile._id + '/result.png'} alt={tile.value} />
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default ResultsPanel;
