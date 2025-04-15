import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const VendorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vendorType: '',
    businessName: '',
    location: '',
    password: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send data to backend API here
    console.log('Vendor Registered:', formData);
    setSubmitted(true);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4" style={{ color: '#c2185b' }}>
        Vendor Registration
      </h2>
      {submitted && <Alert variant="success">Registration successful! Redirecting...</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Your Full Name</Form.Label>
          <Form.Control type="text" name="name" required value={formData.name} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Business Name</Form.Label>
          <Form.Control type="text" name="businessName" required value={formData.businessName} onChange={handleChange} />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" required value={formData.email} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Vendor Type</Form.Label>
          <Form.Select name="vendorType" required value={formData.vendorType} onChange={handleChange}>
            <option value="">Select</option>
            <option value="photographer">Photographer</option>
            <option value="caterer">Caterer</option>
            <option value="venue">Venue</option>
            <option value="event_planner">Event Planner</option>
            <option value="entertainment">Entertainment</option>
            <option value="decorator">Decorator</option>
            <option value="av_tech">AV Technician</option>
            <option value="designer">Designer</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Business Location</Form.Label>
          <Form.Control type="text" name="location" required value={formData.location} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" required value={formData.password} onChange={handleChange} />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default VendorRegister;
