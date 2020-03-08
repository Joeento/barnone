import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './NavBar.css';

function NavBar(props) {
  return (
    <Navbar variant="dark" expand="lg">
      <Navbar.Brand href="#home">
        <FontAwesomeIcon icon={faBarcode} />
        {' '}
        Barnone
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Nav className="mr-auto">
      </Nav>
      <Form inline>
        <Button variant="success">Login</Button>
      </Form>

    </Navbar>
  );
}
export default NavBar;