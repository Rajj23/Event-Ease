import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './EventDetails.css';

const EventDetails = () => {
  // Fix: Extract 'id' parameter instead of 'eventId'
  const { id: eventId } = useParams();
  const { events, vendors } = useContext(EventContext);

  console.log('EventDetails ID:', eventId, 'Events:', events);
  // Convert both IDs to strings for reliable comparison
  const event = events.find((e) => String(e.id) === String(eventId));

  if (!event) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mt-4 text-center"
      >
        <h2>Event Not Found</h2>
        <p>The event may have been deleted or the ID is invalid.</p>
        <p className="text-muted">ID: {eventId}</p>
        <p className="text-muted">Available Events: {events.length}</p>
        <p className="text-muted">Available IDs: {events.map(e => e.id).join(', ')}</p>
        <Button as={Link} to="/dashboard" variant="primary">
          Back to Dashboard
        </Button>
      </motion.div>
    );
  }

  // Rest of the component remains the same
  const totalSpent = (event.vendors || []).reduce((sum, vid) => {
    const vendor = vendors.find(v => v.id === vid);
    return vendor ? sum + Number(vendor.cost) : sum;
  }, 0);
  const budgetStatus = totalSpent > Number(event.budget) ? 'text-danger' : 'text-success';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mt-4 event-details"
    >
      <h2>{event.title}</h2>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={
                event.imageUrl || 'https://placehold.co/400x250?text=Event+Image'
              }
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>Event Details</Card.Title>
              <Card.Text>
                <strong>Type:</strong>{' '}
                {event.eventType
                  ? event.eventType.charAt(0).toUpperCase() +
                    event.eventType.slice(1)
                  : 'Unknown'}
                <br />
                <strong>Date:</strong>{' '}
                {event.date
                  ? new Date(event.date).toLocaleDateString()
                  : 'Not set'}
                <br />
                <strong>Location:</strong> {event.location || 'Not specified'}
                <br />
                <strong>Budget:</strong> ₹{Number(event.budget || 0).toLocaleString('en-IN')}
                <br />
                <strong>Spent:</strong> <span className={budgetStatus}>₹{totalSpent.toLocaleString('en-IN')}</span>
                <br />
                <strong>Description:</strong>{' '}
                {event.description || 'No description'}
                {/* Donation Status */}
                <br />
                <strong>Food Donation:</strong>{' '}
                {event.donateFoodToNGO ? (
                  <span className="text-success">
                    <i className="fas fa-check-circle me-1"></i> Will donate leftovers to NGO
                  </span>
                ) : (
                  <span className="text-muted">No donation planned</span>
                )}
              </Card.Text>
              <Button
                as={Link}
                to={`/event/${eventId}/edit`}
                variant="outline-primary"
                className="me-2"
              >
                Edit Event
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <h4>Selected Vendors</h4>
          {event.vendors && event.vendors.length > 0 ? (
            <Row>
              {event.vendors.map((vendorId) => {
                const vendor = vendors.find((v) => v.id === vendorId);
                return vendor ? (
                  <Col md={6} key={vendor.id} className="mb-3">
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Card>
                        <Card.Img
                          variant="top"
                          src={
                            vendor.imageUrl ||
                            'https://placehold.co/400x250?text=Vendor+Image'
                          }
                          style={{ height: '100px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title>{vendor.name}</Card.Title>
                          <Card.Text>
                            <strong>Type:</strong>{' '}
                            {vendor.type.charAt(0).toUpperCase() +
                              vendor.type.slice(1)}
                            <br />
                            <strong>Cost:</strong> ₹{vendor.cost.toLocaleString('en-IN')}
                            <br />
                            <strong>Location:</strong> {vendor.location}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ) : null;
              })}
            </Row>
          ) : (
            <p>No vendors selected.</p>
          )}
          <Button
            as={Link}
            to={`/event/${eventId}/vendors`}
            variant="primary"
            className="mt-3"
          >
            Manage Vendors
          </Button>
        </Col>
      </Row>
      <Button
        as={Link}
        to="/dashboard"
        variant="secondary"
        className="mt-3"
      >
        Back to Dashboard
      </Button>
    </motion.div>
  );
};

export default EventDetails;