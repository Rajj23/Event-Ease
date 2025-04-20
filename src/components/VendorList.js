import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { Card, Row, Col, Button, Form, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './VendorList.css';

const VendorList = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { events, vendors, updateEvent } = useContext(EventContext);
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedVendorType, setSelectedVendorType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Log for debugging
  console.log('VendorList component initialized');
  console.log('EventId from URL:', eventId);

  useEffect(() => {
    console.log('VendorList useEffect running');
    
    if (events.length > 0) {
      // Convert both IDs to strings for reliable comparison
      const foundEvent = events.find(e => String(e.id) === String(eventId));
      console.log('Found event:', foundEvent);
      
      if (foundEvent) {
        setEvent(foundEvent);
        setSelectedVendors(foundEvent.vendors || []);
      }
    }
    setIsLoading(false);
  }, [events, eventId]);

  // Define vendor types
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

  const handleVendorToggle = (vendorId) => {
    setSelectedVendors(prev => {
      if (prev.includes(vendorId)) {
        return prev.filter(id => id !== vendorId);
      } else {
        return [...prev, vendorId];
      }
    });
  };

  const handleSave = () => {
    if (!event) {
      toast.error('Cannot update: Event not found');
      return;
    }
    
    const totalCost = selectedVendors.reduce((sum, id) => {
      const vendor = vendors.find(v => v.id === id);
      return vendor ? sum + Number(vendor.cost) : sum;
    }, 0);
    
    const budget = Number(event.budget);
    if (budget > 0 && totalCost > budget) {
      toast.warning(`Selected vendors (₹${totalCost.toLocaleString('en-IN')}) exceed budget (₹${budget.toLocaleString('en-IN')})`);
    }
    
    const updatedEvent = {
      ...event,
      vendors: selectedVendors
    };
    
    updateEvent(updatedEvent);
    toast.success('Vendors updated successfully');
    navigate(`/event/${eventId}`);
  };

  // Filter vendors based on type and search term
  const filteredVendors = vendors.filter(vendor => {
    const matchesType = !selectedVendorType || vendor.type === selectedVendorType;
    const matchesSearch = !searchTerm || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = !event?.eventType || vendor.eventTypes.includes(event.eventType);
    
    return matchesType && matchesSearch && matchesEventType;
  });

  // Calculate total cost
  const totalCost = selectedVendors.reduce((sum, id) => {
    const vendor = vendors.find(v => v.id === id);
    return vendor ? sum + Number(vendor.cost) : sum;
  }, 0);

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mt-4 text-center"
      >
        <h2>Loading Vendors...</h2>
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
        <Button as={Link} to="/dashboard" variant="primary">
          Back to Dashboard
        </Button>
      </motion.div>
    );
  }

  return (
    <Container className="mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Vendors: {event.title}</h2>
          <Button as={Link} to={`/event/${eventId}`} variant="outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>Back to Event
          </Button>
        </div>

        <Row>
          {/* Vendor List */}
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                {/* Filter Controls */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Filter by Type</Form.Label>
                      <Form.Select
                        value={selectedVendorType}
                        onChange={(e) => setSelectedVendorType(e.target.value)}
                      >
                        <option value="">All Types</option>
                        {vendorTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Search Vendors</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search by name or location"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-3">Available Vendors</h5>
                <div className="vendor-list" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <motion.div
                        key={vendor.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="mb-3 vendor-card">
                          <Card.Body className="p-0">
                            <Row className="g-0">
                              <Col xs={3} md={2}>
                                <img
                                  src={vendor.imageUrl || 'https://placehold.co/100x100?text=Vendor'}
                                  alt={vendor.name}
                                  className="img-fluid rounded-start"
                                  style={{ height: '100%', objectFit: 'cover' }}
                                />
                              </Col>
                              <Col xs={9} md={10}>
                                <div className="d-flex justify-content-between align-items-center h-100 px-3 py-2">
                                  <div>
                                    <h5 className="mb-1">{vendor.name}</h5>
                                    <p className="mb-1 text-muted">
                                      <i className="fas fa-tag me-1"></i>
                                      {vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)} | 
                                      <i className="fas fa-map-marker-alt mx-1"></i>
                                      {vendor.location}
                                    </p>
                                    <p className="mb-0" style={{ color: "#64B5AE" }}>
                                      <strong>₹{vendor.cost.toLocaleString('en-IN')}</strong>
                                    </p>
                                  </div>
                                  <Form.Check
                                    type="checkbox"
                                    id={`vendor-${vendor.id}`}
                                    checked={selectedVendors.includes(vendor.id)}
                                    onChange={() => handleVendorToggle(vendor.id)}
                                    label="Select"
                                    className="fs-5"
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-search fa-3x text-muted mb-3"></i>
                      <h5>No vendors match your criteria</h5>
                      <p className="text-muted">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Summary Panel */}
          <Col lg={4}>
            <Card className="shadow-sm sticky-top" style={{ top: '1rem', zIndex: 100 }}>
              <Card.Body>
                <h5 className="mb-3">Selected Vendors</h5>
                <p className="mb-2">
                  <strong>{selectedVendors.length}</strong> vendors selected
                </p>
                <div className="mb-3 pb-3 border-bottom">
                  {selectedVendors.length > 0 ? (
                    selectedVendors.map((id) => {
                      const vendor = vendors.find(v => v.id === id);
                      return vendor ? (
                        <div key={id} className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <span>{vendor.name}</span>
                            <small className="d-block text-muted">{vendor.type}</small>
                          </div>
                          <div>
                            <span className="me-2">₹{vendor.cost.toLocaleString('en-IN')}</span>
                            <Button 
                              size="sm" 
                              variant="outline-danger" 
                              onClick={() => handleVendorToggle(id)}
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p className="text-muted text-center py-3">No vendors selected</p>
                  )}
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Budget:</span>
                  <span>₹{Number(event.budget || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total Cost:</span>
                  <span className={totalCost > Number(event.budget) ? 'text-danger' : 'text-success'}>
                    ₹{totalCost.toLocaleString('en-IN')}
                  </span>
                </div>

                <Button 
                  onClick={handleSave} 
                  className="w-100" 
                  variant="primary"
                  size="lg"
                >
                  Save Vendor Selection
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default VendorList;