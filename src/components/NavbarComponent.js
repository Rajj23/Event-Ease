import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './NavbarComponent.css';



const NavbarComponent = () => {
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            {/* Logo Image */}
            <img
              src="/assets/logo.jpeg" // Path to your logo
              alt="Event Ease Logo"
              style={{ height: '45px', marginRight: '15px' }} // Adjust size and margin as needed
            />
            Event Ease
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/create">
                Create Event
              </Nav.Link>
              <Nav.Link as={NavLink} to="/vendors">
                Vendors
              </Nav.Link>
              <Nav.Link as={NavLink} to="/inspiration">
                Inspiration
              </Nav.Link>
              <Nav.Link as={NavLink} to="/checklist">
                Checklist
              </Nav.Link>
              <Nav.Link as={NavLink} to="/einvite">
                E-Invite
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default NavbarComponent;
