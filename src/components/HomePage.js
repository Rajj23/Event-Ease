import React, { useContext, useState } from 'react';
import { EventContext } from '../EventContext';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Carousel, Container, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { inspirationEvents } from '../inspirationEvents';
import './HomePage.css';



const HomePage = () => {
  const { events, vendors } = useContext(EventContext);
  const [filterType, setFilterType] = useState('');

  const featuredItems = [
    {
      id: '1',
      title: 'Unforgettable Birthday',
      description: 'Celebrate with vibrant themes and entertainment.',
      image: '/assets/birthday/birthday_1.jpg',
      link: '/create',
    },
    {
      id: '2',
      title: 'Professional Conference',
      description: 'Host seamless events with top tech and catering.',
      image: '/assets/corporate/corporate_12.jpg',
      link: '/create',
    },
    {
      id: '3',
      title: 'Lively Sangeet',
      description: 'Plan a night of dance and music.',
      image: '/assets/mehndi/mehndi_2.jpg',
      link: '/create',
    },
  ];

  const vendorTypes = [
    'photographer',
    'caterer',
    'venue',
    'event_planner',
    'entertainment',
    'decorator',
    'av_tech',
    'designer',
  ];

  const eventTypes = ['wedding', 'sangeet', 'engagement', 'birthday', 'conference'];

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const filteredEvents = filterType
    ? events.filter((event) => event.eventType === filterType)
    : events;

    const bgUrl = `${process.env.PUBLIC_URL}/assets/background.png`;

    return (
      <div className="homepage">
        {/* Hero Section */}
        <motion.section
          className="hero-section text-center"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            style={{ color: '#fff9c4' }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Your Event, Our Ease
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            From birthdays to conferences, create unforgettable moments.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button as={Link} to="/create" variant="primary" size="lg" className="pulse-button">
              Start Planning
            </Button>
          </motion.div>
        </motion.section>

        {/* Featured Carousel */}
        <motion.section
          className="carousel-section my-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Container>
            <Carousel>
              {featuredItems.map((item) => (
                <Carousel.Item key={item.id}>
                  <img
                    className="d-block w-100"
                    src={item.image}
                    alt={item.title}
                    style={{ height: '400px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                  <Carousel.Caption>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <Button as={Link} to={item.link} variant="light">
                      Plan Now
                    </Button>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
        </motion.section>

        {/* Vendor Categories */}
        <motion.section
          className="categories-section my-5 section-padding"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Container className="themed-container">
            <motion.h2 
              className="text-center mb-4 section-title"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Find Vendors for Any Event
            </motion.h2>
            <Row>
              {vendorTypes.map((type, index) => (
                <Col md={3} key={type} className="mb-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                    viewport={{ once: true }}
                  >
                    <Card className="card-hover">
                      <Card.Body>
                        <Card.Title>
                          {type.replace('_', ' ').charAt(0).toUpperCase() +
                            type.replace('_', ' ').slice(1)}
                        </Card.Title>
                        <Button
                          as={Link}
                          to={`/vendors?type=${type}`}
                          variant="outline-primary"
                        >
                          Browse
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </motion.section>

        {/* Event Inspiration */}
        <motion.section
          className="inspiration-section my-5 section-padding"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Container className="themed-container">
            <motion.h2 
              className="text-center mb-4 section-title"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Event Inspiration
            </motion.h2>
            <Row>
              {inspirationEvents.slice(0, 4).map((event, index) => (
                <Col md={3} key={event.id} className="mb-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                    viewport={{ once: true }}
                    className="h-100"
                  >
                    <Card className="card-hover h-100">
                      <Card.Img
                        variant="top"
                        src={event.images[0]}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Card.Body>
                        <Card.Title>{event.title}</Card.Title>
                        <Card.Text>
                          <strong>{event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}</strong>
                          <br />
                          {event.description.slice(0, 80)}...
                        </Card.Text>
                        <Button as={Link} to="/inspiration" variant="primary">
                          See More
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
            <motion.div 
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button as={Link} to="/inspiration" variant="outline-primary" className="explore-button">
                Explore More Ideas
              </Button>
            </motion.div>
          </Container>
        </motion.section>

        {/* All Events */}
        <motion.section
          className="events-section my-5 section-padding"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Container className="themed-container">
            <motion.h2 
              className="text-center mb-4 section-title"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Your Events
            </motion.h2>
            <Form.Group className="mb-4" style={{ maxWidth: '300px', margin: '0 auto' }}>
              <Form.Label>Filter by Event Type</Form.Label>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {filteredEvents.length === 0 ? (
              <motion.p 
                className="text-center text-muted"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                No events yet. <Link to="/create">Create one now!</Link>
              </motion.p>
            ) : (
              <Row>
                {filteredEvents.map((event, index) => (
                  <Col md={4} key={event.id} className="mb-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                      viewport={{ once: true }}
                    >
                      <Card className="card-hover">
                        <Card.Img
                          variant="top"
                          src={event.imageUrl || '/assets/event_planner/event_planner_2.jpg'}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title>{event.title}</Card.Title>
                          <Card.Text>
                            <strong>Type:</strong>{' '}
                            {event.eventType
                              ? event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)
                              : 'Custom Event'}
                            <br />
                            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                            <br />
                            <strong>Budget:</strong> ₹{event.budget}
                            <br />
                            <strong>Location:</strong> {event.location || 'Not specified'}
                            <br />
                            <strong>Vendors:</strong> {event.vendors?.length || 0} selected
                          </Card.Text>
                          <Button as={Link} to={`/event/${event.id}`} variant="primary">
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </motion.section>

        {/* Vendor Highlights */}
        <motion.section
          className="vendors-section my-5 section-padding"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Container className="themed-container">
            <motion.h2 
              className="text-center mb-4 section-title"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Top Vendors for Any Event
            </motion.h2>
            <Row>
              {vendors.slice(0, 3).map((vendor, index) => (
                <Col md={4} key={vendor.id} className="mb-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                    viewport={{ once: true }}
                  >
                    <Card className="card-hover">
                      <Card.Img
                        variant="top"
                        src={vendor.imageUrl}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Card.Body>
                        <Card.Title>{vendor.name}</Card.Title>
                        <Card.Text>
                          <strong>Type:</strong>{' '}
                          {vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)}
                          <br />
                          <strong>Cost:</strong> ₹{vendor.cost}
                        </Card.Text>
                        <Button as={Link} to={`/vendors/${vendor.id}`} variant="primary">
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </motion.section>

        {/* Tools for Every Event Section - Fixed height cards */}
        <motion.section
          className="tools-section my-5 section-padding"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Container className="themed-container">
            <motion.h2 
              className="text-center mb-4 section-title"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Tools for Every Event
            </motion.h2>
            <Row className="equal-height-row">
              {['Checklist', 'E-Invites', 'Inspiration'].map((tool, index) => (
                <Col md={4} className="mb-4 d-flex" key={tool}>
                  <motion.div 
                    className="w-100"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                    viewport={{ once: true }}
                  >
                    <Card className="card-hover tool-card h-100 d-flex flex-column">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{tool}</Card.Title>
                        <Card.Text className="flex-grow-1">
                          {tool === 'Checklist' && 'Organize tasks for birthdays, conferences, and more.'}
                          {tool === 'E-Invites' && 'Design invites for any occasion in minutes.'}
                          {tool === 'Inspiration' && 'Get ideas for all types of events.'}
                        </Card.Text>
                        <div className="mt-auto">
                          <Button 
                            as={Link} 
                            to={`/${tool === 'E-Invites' ? 'einvite' : tool.toLowerCase()}`} 
                            variant="primary"
                          >
                            {tool === 'Checklist' && 'Get Started'}
                            {tool === 'E-Invites' && 'Design Now'}
                            {tool === 'Inspiration' && 'Explore'}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </motion.section>

        {/* Footer Section */}
        <footer className="mt-5 footer-section">
          <Container>
            <Row>
              <Col md={4}>
                <h5>EventEase - Your Personal Event Planner</h5>
                <p>Plan your event with us</p>
                <p>
                  EventEase is your go-to event planning website where you can find top vendors and
                  tools for every type of celebration. Whether it's a wedding or a birthday bash, we've got you!
                </p>
              </Col>
              <Col md={3}>
                <h5>Contact Us</h5>
                <p><strong>For Vendors:</strong><br /> vendors@eventease.com<br /> 0124-6812346</p>
                <p><strong>For Users:</strong><br /> info@eventease.com<br /> 0124-6812345</p>
              </Col>
              <Col md={2}>
                <h5>Follow Us</h5>
                <p><a href="https://www.facebook.com/">Facebook</a></p>
                <p><a href="https://www.instagram.com/">Instagram</a></p>
                <p><a href="https://www.pinterest.com/">Pinterest</a></p>
                <p><a href="https://x.com/">X</a></p>
              </Col>
              <Col md={3}>
                <div className="mb-4 vendor-register">
                  <Button as={Link} to="/register-vendor" variant="primary" className="w-100">
                    Register as Vendor
                  </Button>
                </div>
                <h5>Get Our App</h5>
                <div className="app-badges">
                  <img src="/assets/app.png" alt="App Store" style={{ height: '40px', marginRight: '10px' }} />
                  <img src="/assets/play.png" alt="Google Play" style={{ height: '40px' }} />
                </div>
              </Col>
            </Row>
            <hr />
            <p className="text-center copyright">© {new Date().getFullYear()} EventEase. All rights reserved.</p>
          </Container>
        </footer>

        {/* Add smooth scroll to top button */}
        <motion.div 
          className="scroll-to-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
        >
          <i className="fa fa-arrow-up"></i>
        </motion.div>
      </div>
    );
};

export default HomePage;
