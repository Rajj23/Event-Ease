import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import './CreateEvent.css';

const CreateEvent = () => {
  const { addEvent, vendors } = useContext(EventContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: uuidv4(),
    title: '',
    eventType: '',
    date: '',
    location: '',
    budget: '',
    description: '',
    imageUrl: '',
    vendors: [],
    donateFoodToNGO: false, // Add this new field
  });
  const [imagePreview, setImagePreview] = useState('');
  const [selectedVendorType, setSelectedVendorType] = useState('');

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
      toast.error(`Cannot create event: Vendor costs (₹${totalCost.toLocaleString('en-IN')}) exceed budget (₹${budget.toLocaleString('en-IN')})`);
      return;
    }

    addEvent(formData);
    toast.success('Event created successfully');
    setFormData({
      id: uuidv4(),
      title: '',
      eventType: '',
      date: '',
      location: '',
      budget: '',
      description: '',
      imageUrl: '',
      vendors: [],
    });
    setImagePreview('');
    navigate('/dashboard'); 
  };
  
  // Calculate the total cost of selected vendors
  const totalCost = (formData.vendors || []).reduce((sum, id) => {
    const vendor = vendors.find((v) => v.id === id);
    return vendor ? sum + Number(vendor.cost) : sum;
  }, 0);

  const filteredVendors = selectedVendorType
    ? vendors.filter(
        (vendor) =>
          vendor.type === selectedVendorType &&
          (!formData.eventType || vendor.eventTypes.includes(formData.eventType))
      )
    : vendors;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 12,
        duration: 0.6 
      }}
      className="container mt-4 create-event"
    >
      <h2 className="text-center mb-4 fw-bold" style={{ color: "#64B5AE" }}>Create Your Event</h2>
      <Card className="shadow-lg p-4 mb-5 bg-white rounded border-0">
        <Card.Body>
          <Form onSubmit={handleSubmit} className="modern-form">
            <Row>
              <Col md={6} className="pe-md-4">
                <div className="form-section-header mb-3">
                  <span className="badge me-2" style={{ backgroundColor: "#64B5AE" }}>1</span>
                  <span className="fw-bold fs-5">Event Details</span>
                </div>
                
                <Form.Group className="mb-4 form-floating">
                  <Form.Control
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder=" "
                    className="modern-input"
                    required
                  />
                  <Form.Label htmlFor="title">Event Title</Form.Label>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="text-muted small">Event Type</Form.Label>
                  <Form.Select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="modern-input"
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
                
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="text-muted small">Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="modern-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="text-muted small">Budget (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="₹10000"
                        className="modern-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label className="text-muted small">Location</Form.Label>
                  <div className="location-input-container position-relative">
                    <i className="fas fa-map-marker-alt position-absolute" 
                       style={{ color: "#64B5AE", top: "12px", left: "12px", zIndex: "4" }}></i>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Amritsar, Ludhiana, Patiala, Jalandhar, Chandigarh, etc."
                      className="modern-input ps-4"
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="text-muted small">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={
                      formData.eventType === 'conference'
                        ? 'E.g., Agenda and key speakers'
                        : 'E.g., Event details and theme'
                    }
                    className="modern-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        <i className="fas fa-hand-holding-heart text-success fa-2x"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">Give Back to Community</h5>
                        <p className="mb-0 text-muted small">Would you like to donate leftover food from your event to a local NGO?</p>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-center mt-2">
                      <Button
                        type="button"
                        variant={formData.donateFoodToNGO ? "success" : "outline-success"}
                        className="me-2 px-4"
                        onClick={() => setFormData({...formData, donateFoodToNGO: true})}
                      >
                        <i className="fas fa-check-circle me-1"></i> Yes, I'll Donate
                      </Button>
                      <Button
                        type="button"
                        variant={!formData.donateFoodToNGO ? "secondary" : "outline-secondary"}
                        className="px-4"
                        onClick={() => setFormData({...formData, donateFoodToNGO: false})}
                      >
                        <i className="fas fa-times-circle me-1"></i> No, Thanks
                      </Button>
                    </div>
                    
                    {formData.donateFoodToNGO && (
                      <div className="mt-3">
                        <div className="text-center text-success small mb-2">
                          <i className="fas fa-heart me-1"></i> Thank you for choosing to donate! You're making a difference.
                        </div>
                        <div className="d-flex justify-content-center">
                          <Form.Check 
                            type="checkbox" 
                            id="remember-donation" 
                            label="Remember my choice for future events" 
                            className="small text-muted"
                            onChange={(e) => {
                              if (e.target.checked) {
                                localStorage.setItem('defaultDonate', formData.donateFoodToNGO.toString());
                              } else {
                                localStorage.removeItem('defaultDonate');
                              }
                            }} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="text-muted small">Event Image</Form.Label>
                  <div className="image-upload-container">
                    {!imagePreview ? (
                      <div className="upload-placeholder">
                        <i className="fas fa-cloud-upload-alt mb-2"></i>
                        <p>Drag & drop or click to upload</p>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file-input"
                        />
                      </div>
                    ) : (
                      <div className="image-preview-container" style={{ 
  width: '100%', 
  height: '250px', 
  position: 'relative', 
  overflow: 'hidden',
  borderRadius: '8px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
}}>
  <img
    src={imagePreview}
    alt="Preview"
    className="image-preview"
    style={{ 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover', 
      objectPosition: 'center',
      transition: 'transform 0.3s ease'
    }}
    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
  />
  <div className="image-overlay" style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    padding: '15px 10px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <span className="text-white">Event Image Preview</span>
    <button 
      type="button" 
      className="btn btn-sm btn-outline-light"
      onClick={() => {
        setImagePreview('');
        setFormData({...formData, imageUrl: ''});
      }}
    >
      <i className="fas fa-times me-1"></i> Remove
    </button>
  </div>
</div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={6} className="ps-md-4 mt-4 mt-md-0">
                <div className="form-section-header mb-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge me-2" style={{ backgroundColor: "#64B5AE" }}>2</span>
                    <span className="fw-bold fs-5">Choose Vendors</span>
                  </div>
                  {formData.vendors.length > 0 && (
                    <span className="badge rounded-pill" style={{ backgroundColor: "#64B5AE" }}>
                      {formData.vendors.length} selected
                    </span>
                  )}
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label className="text-muted small">Vendor Type</Form.Label>
                  <div className="position-relative">
                    <i className="fas fa-filter position-absolute" style={{ color: "#64B5AE", top: "12px", left: "12px", zIndex: "4" }}></i>
                    <Form.Select
                      value={selectedVendorType}
                      onChange={(e) => setSelectedVendorType(e.target.value)}
                      className="modern-input ps-4"
                    >
                      <option value="">All Types</option>
                      {vendorTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').charAt(0).toUpperCase() +
                            type.replace('_', ' ').slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              

                
                <div className="vendor-list p-3 border rounded bg-light">
                  <div className="vendor-scroll" style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                                <div className="fw-bold" style={{ color: "#64B5AE" }}>₹{vendor.cost.toLocaleString('en-IN')}</div>
                                <small className="text-muted d-flex align-items-center">
                                  <i className="fas fa-tag me-1"></i> 
                                  {vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)}
                                  <i className="fas fa-map-marker-alt ms-2 me-1"></i> 
                                  {vendor.location}
                                </small>
                              </div>
                            </div>
                            <img
                              src={vendor.imageUrl || 'https://placehold.co/50x50?text=Vendor'}
                              alt={vendor.name}
                              className="vendor-image"
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
                      <div className="text-center py-4">
                        <i className="fas fa-search fa-2x text-muted mb-2"></i>
                        <p>No matching vendors found</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="cost-summary mt-4 mb-3 p-3 border rounded bg-white shadow-sm">
                  <h5 className="mb-3">
                    <i className="fas fa-calculator me-2" style={{ color: "#64B5AE" }}></i>
                    Budget Summary
                  </h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Budget:</span>
                    <span className="fw-bold">₹{Number(formData.budget || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Vendor Total:</span>
                    <span className="fw-bold" style={{ color: totalCost > Number(formData.budget) && formData.budget > 0 ? "#dc3545" : "#198754" }}>
                      ₹{totalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Remaining:</span>
                    <span className={Number(formData.budget) - totalCost < 0 && formData.bbudget > 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                      ₹{(Number(formData.budget || 0) - totalCost).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {formData.budget && (
  <div className="mt-1">
    <div className="progress" style={{ height: '8px' }}>
      <div 
        className="progress-bar" 
        role="progressbar"
        style={{ 
          width: `${Math.min(totalCost / Number(formData.budget) * 100, 100)}%`,
          backgroundColor: totalCost / Number(formData.budget) > 0.9 ? 
            "#dc3545" : totalCost / Number(formData.budget) > 0.7 ? 
            "#ffc107" : "#64B5AE"
        }}
        aria-valuenow={totalCost} 
        aria-valuemin="0" 
        aria-valuemax={formData.budget}
      ></div>
    </div>
    <div className="d-flex justify-content-between mt-1">
      <span className="text-muted small">₹0</span>
      <span className={`small ${totalCost > Number(formData.budget) ? 'text-danger' : 'text-muted'}`}>
        {totalCost > Number(formData.budget) ? 'Over budget!' : `${Math.round(totalCost / Number(formData.budget) * 100)}% used`}
      </span>
      <span className="text-muted small">₹{Number(formData.budget).toLocaleString('en-IN')}</span>
    </div>
  </div>
)}

                <div className="text-center mt-5">
                  <Button 
                    type="submit" 
                    className="btn-lg px-5 py-2 fw-bold"
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ backgroundColor: "#64B5AE", borderColor: "#64B5AE" }}
                  >
                    <i className="fas fa-check-circle me-2"></i> Create Event
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default CreateEvent;