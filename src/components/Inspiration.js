import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { inspirationEvents } from '../inspirationEvents';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Inspiration.css';

const Inspiration = () => {
  const [filterType, setFilterType] = useState('');
  const [filterStyle, setFilterStyle] = useState('');

  const eventTypes = ['wedding', 'sangeet', 'engagement', 'birthday', 'conference', 'other'];
  const styles = ['colorful', 'modern', 'traditional', 'romantic', 'luxury'];

  const filteredEvents = inspirationEvents.filter((event) => {
    const matchesType = filterType ? event.eventType === filterType : true;
    const matchesStyle = filterStyle ? event.style === filterStyle : true;
    return matchesType && matchesStyle;
  });

  // Add custom card styles to ensure fixed height
  const cardStyle = {
    height: '400px', // Fixed height for all cards
    display: 'flex',
    flexDirection: 'column'
  };

  const cardBodyStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mt-4 inspiration"
    >
      <h2>Event Inspiration</h2>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Event Type</Form.Label>
            <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Style</Form.Label>
            <Form.Select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)}>
              <option value="">All Styles</option>
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Col md={4} key={event.id} className="mb-4">
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
                      <strong>Type:</strong>{' '}
                      {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                      <br />
                      <strong>Style:</strong>{' '}
                      {event.style.charAt(0).toUpperCase() + event.style.slice(1)}
                      <br />
                      {event.description.slice(0, 100)}...
                    </Card.Text>
                    <Button as={Link} to={`/inspiration/${event.id}`} variant="primary">
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <Col>
            <p>No inspiration found for this filter.</p>
          </Col>
        )}
      </Row>
      <div className="text-center">
        <Button as={Link} to="/create" variant="primary">
          Plan Your Event
        </Button>
      </div>
    </motion.div>
  );
};

export default Inspiration;