import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './EditEvent.css';

const EditEvent = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { events, vendors, updateEvent } = useContext(EventContext);
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(null);
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
  const [imageUpdating, setImageUpdating] = useState(false);

  // Log for debugging
  console.log('EditEvent component initialized');
  console.log('EventId from URL:', eventId);
  console.log('Events available:', events.map(e => ({ id: e.id, title: e.title })));

  // Use this effect to find and set the event
  useEffect(() => {
    console.log('EditEvent useEffect running, events length:', events.length);
    
    // Delay lookup slightly to ensure context is fully loaded
    const timer = setTimeout(() => {
      if (events.length > 0) {
        // Convert both IDs to strings for reliable comparison
        const foundEvent = events.find(e => String(e.id) === String(eventId));
        console.log('Looking for event with ID:', eventId);
        console.log('Found event:', foundEvent);
        
        if (foundEvent) {
          setEvent(foundEvent);
          setFormData({
            title: foundEvent.title || '',
            eventType: foundEvent.eventType || '',
            date: foundEvent.date ? foundEvent.date.split('T')[0] : '',
            location: foundEvent.location || '',
            budget: foundEvent.budget || '',
            description: foundEvent.description || '',
            imageUrl: foundEvent.imageUrl || '',
            vendors: foundEvent.vendors || [],
          });
          setImagePreview(foundEvent.imageUrl || '');
        } else {
          console.error('Event not found. Available IDs:', events.map(e => e.id));
        }
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [events, eventId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Image handling function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size <= 2 * 1024 * 1024) {
      setImageUpdating(true);
      
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTimeout(() => {
            try {
              const eventBeforeUpdate = events.find(e => String(e.id) === String(eventId));
              if (eventBeforeUpdate) {
                setEvent(eventBeforeUpdate);
              }
              
              setFormData(prev => ({ ...prev, imageUrl: reader.result }));
              setImagePreview(reader.result);
            } finally {
              setImageUpdating(false);
            }
          }, 500);
        };
        
        reader.onerror = () => {
          toast.error('Error reading image file');
          setImageUpdating(false);
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error in image handling:', error);
        toast.error('Failed to process image');
        setImageUpdating(false);
      }
    } else {
      toast.error('Image must be under 2MB');
    }
  };

  // Handle vendor selection
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!event) {
      toast.error('Cannot update: Event not found');
      return;
    }
    
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
      id: eventId, // Ensure ID stays the same
    };
    
    console.log('Submitting updated event:', updatedEvent);
    updateEvent(updatedEvent);
    toast.success('Event updated successfully');
    navigate('/dashboard');
  };

  // Loading states
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mt-4 text-center"
      >
        <h2>Loading Event...</h2>
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </motion.div>
    );
  }

  if (imageUpdating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mt-4 text-center"
      >
        <h2>Updating Image...</h2>
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </motion.div>
    );
  }

  // Event not found state
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

  const filteredVendors = selectedVendorType
    ? vendors.filter(
        (vendor) =>
          vendor.type === selectedVendorType &&
          (!formData.eventType || vendor.eventTypes.includes(formData.eventType))
      )
    : vendors.filter(
        (vendor) => !formData.eventType || vendor.eventTypes.includes(formData.eventType)
      );

  // Main render
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mt-4 edit-event"
    >
      <h2 className="text-center mb-4">Edit Event: {event.title}</h2>
      
      <Card className="shadow-sm mb-5">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Left Column - Event Details */}
              <Col md={6} className="pe-md-4">
                <h4 className="mb-3">Event Details</h4>
                
                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    required
                  />
                </Form.Group>
                
                {/* Event Type */}
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
                
                {/* Date and Budget */}
                <Row>
                  <Col sm={6}>
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
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Budget (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="₹10000"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Location */}
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                  />
                </Form.Group>
                
                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Event description"
                  />
                </Form.Group>
                
                {/* Image */}
                <Form.Group className="mb-3">
                  <Form.Label>Event Image</Form.Label>
                  <div className="image-upload-container">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    {imagePreview && (
                      <div className="position-relative d-flex justify-content-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            maxWidth: '50%', // Reduced from 100% to 50%
                            height: 'auto',
                            marginTop: '10px',
                            borderRadius: '8px',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              
              {/* Right Column - Vendor Selection */}
              <Col md={6} className="ps-md-4 mt-4 mt-md-0">
                <h4 className="mb-3">Select Vendors</h4>
                
                {/* Vendor Type Filter */}
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Vendor Type</Form.Label>
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
                
                {/* Vendor List */}
                <div className="vendor-list p-3 border rounded bg-light">
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <Card key={vendor.id} className="mb-2 border-0 shadow-sm">
                          <Card.Body className="d-flex justify-content-between align-items-center p-2">
                            <div className="d-flex align-items-center">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={formData.vendors.includes(vendor.id)}
                                  onChange={() => handleVendorToggle(vendor.id)}
                                  id={`vendor-${vendor.id}`}
                                />
                              </div>
                              <div className="ms-2">
                                <div className="fw-bold">{vendor.name}</div>
                                <div style={{ color: "#64B5AE" }}>₹{vendor.cost.toLocaleString('en-IN')}</div>
                                <small className="text-muted">
                                  <span className="me-2">{vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)}</span>
                                  <span>{vendor.location}</span>
                                </small>
                              </div>
                            </div>
                            <img
                              src={vendor.imageUrl || 'https://placehold.co/60x60?text=Vendor'}
                              alt={vendor.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center py-3">No vendors match your criteria</p>
                    )}
                  </div>
                </div>
                
                {/* Total Cost Display */}
                <div className="mt-3 mb-4">
                  <h5>Cost Summary</h5>
                  <p>
                    <strong>Budget:</strong> ₹{Number(formData.budget || 0).toLocaleString('en-IN')}
                  </p>
                  <p>
                    <strong>Vendor Total:</strong> ₹
                    {formData.vendors
                      .reduce((sum, id) => {
                        const vendor = vendors.find((v) => v.id === id);
                        return vendor ? sum + Number(vendor.cost) : sum;
                      }, 0)
                      .toLocaleString('en-IN')}
                  </p>
                </div>
              </Col>
            </Row>
            
            <div className="mt-4 text-center">
              <Button type="submit" variant="primary" className="me-2 px-4">
                Save Changes
              </Button>
              <Button as={Link} to="/dashboard" variant="secondary" className="px-4">
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default EditEvent;
