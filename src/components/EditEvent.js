import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './EditEvent.css';

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, vendors, updateEvent } = useContext(EventContext);

  console.log('EditEvent ID:', eventId, 'Events:', events);
  const event = events.find((e) => e.id === eventId);
  const [formData, setFormData] = useState({
    title: '',
    eventType: '',
    date: '',
    location: '',
    budget: '',
    description: '',
    imageUrl: '',
    vendors: [],
  });
  const [imagePreview, setImagePreview] = useState('');
  const [selectedVendorType, setSelectedVendorType] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        eventType: event.eventType || '',
        date: event.date ? event.date.split('T')[0] : '',
        location: event.location || '',
        budget: event.budget || '',
        description: event.description || '',
        imageUrl: event.imageUrl || '',
        vendors: event.vendors || [],
      });
      setImagePreview(event.imageUrl || '');
      console.log('EditEvent loaded event:', event);
    }
  }, [event]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Image must be under 2MB');
    }
  };

  const handleVendorToggle = (vendorId) => {
    const currentVendors = formData.vendors || [];
    let updatedVendors;
    if (currentVendors.includes(vendorId)) {
      updatedVendors = currentVendors.filter((id) => id !== vendorId);
    } else {
      updatedVendors = [...currentVendors, vendorId];
    }

    const totalCost = updatedVendors.reduce((sum, id) => {
      const vendor = vendors.find((v) => v.id === id);
      return vendor ? sum + Number(vendor.cost) : sum;
    }, 0);

    const budget = Number(formData.budget);
    if (budget > 0 && totalCost > budget) {
      toast.error(`Selected vendors (₹${totalCost.toLocaleString('en-IN')}) exceed budget (₹${budget.toLocaleString('en-IN')})`);
      return;
    }

    setFormData({ ...formData, vendors: updatedVendors });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalCost = (formData.vendors || []).reduce((sum, id) => {
      const vendor = vendors.find((v) => v.id === id);
      return vendor ? sum + Number(vendor.cost) : sum;
    }, 0);
    const budget = Number(formData.budget);
    if (budget > 0 && totalCost > budget) {
      toast.error(`Cannot save event: Vendor costs (₹${totalCost.toLocaleString('en-IN')}) exceed budget (₹${budget.toLocaleString('en-IN')})`);
      return;
    }

    const updatedEvent = {
      ...event,
      ...formData,
      id: eventId,
    };
    console.log('Submitting updated event:', updatedEvent);
    const success = updateEvent(updatedEvent);
    if (success) {
      toast.success('Event updated successfully');
      navigate('/dashboard');
    } else {
      toast.error('Failed to update event');
    }
  };

  const filteredVendors = selectedVendorType
    ? vendors.filter(
        (vendor) =>
          vendor.type === selectedVendorType &&
          (!formData.eventType || vendor.eventTypes.includes(formData.eventType))
      )
    : vendors.filter(
        (vendor) => !formData.eventType || vendor.eventTypes.includes(formData.eventType)
      );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mt-4 edit-event"
    >
      <h2>Edit Event: {event.title}</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={
                  formData.eventType === 'birthday'
                    ? 'E.g., Mia’s 5th Birthday'
                    : 'E.g., My Event'
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="conference">Conference</option>
                <option value="sangeet">Sangeet</option>
                <option value="engagement">Engagement</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="E.g., Mumbai, Delhi"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Budget (₹)</Form.Label>
              <Form.Control
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="0"
                placeholder="E.g., ₹10000"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="E.g., Event details and theme"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    marginTop: '10px',
                    borderRadius: '8px',
                  }}
                />
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <h4>Choose Vendors</h4>
            <Form.Group className="mb-3">
              <Form.Label>Vendor Type</Form.Label>
              <Form.Select
                value={selectedVendorType}
                onChange={(e) => setSelectedVendorType(e.target.value)}
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
            <div
              className="vendor-list"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <Card key={vendor.id} className="mb-2">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <Form.Check
                          type="checkbox"
                          label={`${vendor.name} (₹${vendor.cost.toLocaleString('en-IN')})`}
                          checked={formData.vendors.includes(vendor.id)}
                          onChange={() => handleVendorToggle(vendor.id)}
                        />
                        <small>
                          {vendor.type.charAt(0).toUpperCase() +
                            vendor.type.slice(1)}{' '}
                          | {vendor.location}
                        </small>
                      </div>
                      <img
                        src={
                          vendor.imageUrl ||
                          'https://via.placeholder.com/50x50'
                        }
                        alt={vendor.name}
                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                      />
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No vendors available for this type.</p>
              )}
            </div>
          </Col>
        </Row>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </Form>
    </motion.div>
  );
};

export default EditEvent;
