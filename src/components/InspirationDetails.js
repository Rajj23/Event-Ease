import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { inspirationEvents } from '../inspirationEvents';
import { Card, Row, Col, Button, Carousel } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './InspirationDetails.css';

const InspirationDetails = () => {
  const { id } = useParams();
  const event = inspirationEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mt-4 text-center"
      >
        <h2>Inspiration Not Found</h2>
        <p>The inspiration event may not exist.</p>
        <Button as={Link} to="/inspiration" variant="primary">
          Back to Inspiration
        </Button>
      </motion.div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mt-4 inspiration-details"
    >
      <h2>{event.title}</h2>
      <Row>
        <Col md={6}>
          <Carousel>
            {event.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`${event.title} ${index + 1}`}
                  style={{ height: '300px', objectFit: 'cover', borderRadius: '12px' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={6}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card>
              <Card.Body>
                <Card.Title>Event Details</Card.Title>
                <Card.Text>
                  <strong>Type:</strong>{' '}
                  {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  <br />
                  <strong>Style:</strong>{' '}
                  {event.style.charAt(0).toUpperCase() + event.style.slice(1)}
                  <br />
                  <strong>Location:</strong> {event.location}
                  <br />
                  <strong>Description:</strong> {event.description}
                </Card.Text>
                <Button as={Link} to="/create" variant="primary">
                  Plan Similar Event
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
      <Button as={Link} to="/inspiration" variant="secondary" className="mt-3">
        Back to Inspiration
      </Button>
    </motion.div>
  );
};

export default InspirationDetails;