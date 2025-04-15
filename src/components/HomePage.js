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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ color: '#fff9c4' }}>Your Event, Our Plan</h1>
          <p>From birthdays to conferences, create unforgettable moments.</p>
          <Button as={Link} to="/create" variant="primary" size="lg">
            Start Planning
          </Button>
        </motion.section>

      {/* Featured Carousel */}
      <motion.section
        className="carousel-section my-5"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
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
        className="categories-section my-5"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Container>
          <h2 className="text-center mb-4">Find Vendors for Any Event</h2>
          <Row>
            {vendorTypes.map((type) => (
              <Col md={3} key={type} className="mb-4">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                  <Card>
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
        className="inspiration-section my-5"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Container>
          <h2 className="text-center mb-4">Event Inspiration</h2>
          <Row>
            {inspirationEvents.slice(0, 4).map((event) => (
              <Col md={3} key={event.id} className="mb-4">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                  <Card>
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
          <div className="text-center">
            <Button as={Link} to="/inspiration" variant="outline-primary">
              Explore More Ideas
            </Button>
          </div>
        </Container>
      </motion.section>

      {/* All Events */}
      <motion.section
        className="events-section my-5"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Container>
          <h2 className="text-center mb-4">Your Events</h2>
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
            <p className="text-center text-muted">
              No events yet. <Link to="/create">Create one now!</Link>
            </p>
          ) : (
            <Row>
              {filteredEvents.map((event) => (
                <Col md={4} key={event.id} className="mb-4">
                  <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                    <Card>
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
        className="vendors-section my-5"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Container>
          <h2 className="text-center mb-4">Top Vendors for Any Event</h2>
          <Row>
            {vendors.slice(0, 3).map((vendor) => (
              <Col md={4} key={vendor.id} className="mb-4">
                <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                  <Card>
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

      {/* Planning Tools */}
      <motion.section
        className="tools-section my-5"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Container>
          <h2 className="text-center mb-4">Tools for Every Event</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Checklist</Card.Title>
                  <Card.Text>
                    Organize tasks for birthdays, conferences, and more.
                  </Card.Text>
                  <Button as={Link} to="/checklist" variant="primary">
                    Get Started
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>E-Invites</Card.Title>
                  <Card.Text>
                    Design invites for any occasion in minutes.
                  </Card.Text>
                  <Button as={Link} to="/einvite" variant="primary">
                    Design Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Inspiration</Card.Title>
                  <Card.Text>
                    Get ideas for all types of events.
                  </Card.Text>
                  <Button as={Link} to="/inspiration" variant="primary">
                    Explore
                  </Button>
                </Card.Body>

              </Card>
            </Col>
          </Row>
        </Container>
      </motion.section> 
      {/* Footer Section */}
      <footer className="mt-5" style={{ backgroundColor: '#fce4ec', padding: '40px 20px' }}>
        <Container>
          
          <Row>
            <Col md={4}>
              <h5>EventEase - Your Personal Event Planner</h5>
              <p>Plan your event with us</p>
              <p>
                EventEase is your go-to event planning website where you can find top vendors and
                tools for every type of celebration. Whether it's a wedding or a birthday bash, we’ve got you!
              </p>
            </Col>
            <Col md={3}>
              <h5>Contact Us</h5>
              <p><strong>For Vendors:</strong><br /> vendors@eventease.com<br /> 0124-6812346</p>
              <p><strong>For Users:</strong><br /> info@eventease.com<br /> 0124-6812345</p>
            </Col>
            <Col md={2}>
              <h5>Follow Us</h5>
              <p><a href="https://www.facebook.com/" style={{ color: '#c2185b' }}>Facebook</a></p>
              <p><a href="https://www.instagram.com/" style={{ color: '#c2185b' }}>Instagram</a></p>
              <p><a href="https://www.pinterest.com/" style={{ color: '#c2185b' }}>Pinterest</a></p>
              <p><a href="https://x.com/" style={{ color: '#c2185b' }}>X</a></p>
            </Col>
            <Col md={4} className="mb-4">
              <Card size="sm" className="text-center">
                {/* <Card.Body> */}
                  <Button as={Link} to="/register-vendor" variant="primary">
                  Register as Vendor
                  </Button>
                {/* </Card.Body> */}
              </Card>
            </Col>
            <Col md={3}>
              <h5>Get Our App</h5>
              <img src="/assets/app.png" alt="App Store" style={{ width: '140px', marginBottom: '10px' }} />
              <img src="/assets/play.png" alt="Google Play" style={{ width: '140px' , marginBottom: '10px'}} />
            </Col>
          </Row>
          <hr />
          <p className="text-center mt-3">© {new Date().getFullYear()} EventEase. All rights reserved.</p>
        </Container>
      </footer>
    </div>
    
  );
};

export default HomePage;
