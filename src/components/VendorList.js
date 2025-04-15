import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './VendorList.css';

const VendorList = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, vendors, updateEvent } = useContext(EventContext);

  console.log('VendorList ID:', eventId, 'Events:', events);
  const event = events.find((e) => e.id === eventId);
  const [selectedVendors, setSelectedVendors] = useState(event?.vendors || []);
  const [filterType, setFilterType] = useState('');

  if (!event) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        Animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mt-4 text-center"
      >
        <h2>Event Not Found</h2>
        <p>The event may have been deleted or the ID is invalid.</p>
        <Button as={Link} to="/dashboard" variant="primary">
          Back to Dashboard
        </Button>
      </motion.div>
    );
  }

  const vendorTypes = [
    'photographer',
    'caterer',
    'venue',
    'event_planner',
    'entertainment',
    'decorator',
    'av_tech',
    'designer',
    'bridal_wear',
    'makeup_artist',
    'mehendi_artist',
    'jewellery',
    'pandit',
    'choreographer',
    'cake_artist',
    'trousseau',
    'cinematographer',
    'dj',
    'planner',
  ];

  const filteredVendors = filterType
    ? vendors.filter(
        (vendor) =>
          vendor.type === filterType &&
          (!event.eventType || vendor.eventTypes.includes(event.eventType))
      )
    : vendors.filter(
        (vendor) => !event.eventType || vendor.eventTypes.includes(event.eventType)
      );

  const handleVendorToggle = (vendorId) => {
    let updatedVendors;
    if (selectedVendors.includes(vendorId)) {
      updatedVendors = selectedVendors.filter((id) => id !== vendorId);
    } else {
      updatedVendors = [...selectedVendors, vendorId];
    }

    const totalCost = updatedVendors.reduce((sum, id) => {
      const vendor = vendors.find((v) => v.id === id);
      return vendor ? sum + Number(vendor.cost) : sum;
    }, 0);

    const budget = Number(event.budget);
    if (budget > 0 && totalCost > budget) {
      toast.error(`Vendor costs (₹${totalCost.toLocaleString('en-IN')}) exceed budget (₹${budget.toLocaleString('en-IN')})`);
      return;
    }

    setSelectedVendors(updatedVendors);
  };

  const handleSave = () => {
    const totalCost = selectedVendors.reduce((sum, id) => {
      const vendor = vendors.find((v) => v.id === id);
      return vendor ? sum + Number(vendor.cost) : sum;
    }, 0);
    const budget = Number(event.budget);
    if (budget > 0 && totalCost > budget) {
      toast.error(`Cannot save: Vendor costs (₹${totalCost.toLocaleString('en-IN')}) exceed budget (₹${budget.toLocaleString('en-IN')})`);
      return;
    }

    const updatedEvent = { ...event, vendors: selectedVendors };
    console.log('Saving vendors for event ID:', eventId, 'Event:', updatedEvent);
    const success = updateEvent(updatedEvent);
    if (success) {
      toast.success('Vendors updated successfully');
      navigate(`/event/${eventId}`);
    } else {
      toast.error('Failed to update vendors');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mt-4 vendor-list"
    >
      <h2>Vendors for {event.title}</h2>
      <p>
        Budget: <Badge bg="primary">₹{Number(event.budget).toLocaleString('en-IN')}</Badge> | Current Cost:{' '}
        <Badge bg="secondary">
          ₹{
            selectedVendors.reduce((sum, id) => {
              const vendor = vendors.find((v) => v.id === id);
              return vendor ? sum + Number(vendor.cost) : sum;
            }, 0).toLocaleString('en-IN')
          }
        </Badge>
      </p>
      <Form.Group className="mb-3">
        <Form.Label>Vendor Type</Form.Label>
        <Form.Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {vendorTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ').charAt(0).toUpperCase() +
                type.replace('_', ' ').slice(1)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Row>
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <Col md={4} key={vendor.id} className="mb-4">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                  hover: { scale: 1.05 },
                }}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <Card.Img
                    variant="top"
                    src={
                      vendor.imageUrl ||
                      'https://placehold.co/400x250?text=Vendor+Image'
                    }
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{vendor.name}</Card.Title>
                    <Card.Text>
                      <strong>Type:</strong>{' '}
                      {vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)}
                      <br />
                      <strong>Cost:</strong> ₹{vendor.cost.toLocaleString('en-IN')}
                      <br />
                      <strong>Location:</strong> {vendor.location}
                    </Card.Text>
                    <Form.Check
                      type="checkbox"
                      label="Select"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => handleVendorToggle(vendor.id)}
                    />
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <Col>
            <p>No vendors available for this event type.</p>
          </Col>
        )}
      </Row>
      <Button variant="primary" onClick={handleSave} className="mt-3">
        Save Vendors
      </Button>
      <Button
        variant="secondary"
        as={Link}
        to={`/event/${eventId}`}
        className="mt-3 ms-2"
      >
        Cancel
      </Button>
    </motion.div>
  );
};

export default VendorList;