import React, { useState, useContext } from 'react';
import { EventContext } from '../EventContext';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './EInvite.css';

const EInvite = () => {
  const { events } = useContext(EventContext);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [invite, setInvite] = useState({
    template: 'classic',
    message: '',
    imageUrl: '',
  });
  const [preview, setPreview] = useState(null);

  // const templates = [
  //   { id: 'classic', name: 'Classic', image: 'https://placehold.co/400x600?text=Classic+Invite' },
  //   { id: 'floral', name: 'Floral', image: 'https://placehold.co/400x600?text=Floral+Invite' },
  //   { id: 'modern', name: 'Modern', image: 'https://placehold.co/400x600?text=Modern+Invite' },
  // ];
  const templates = [
    { id: 'classic', name: 'Classic', image: '/assets/invite/classic.jpg' },
    { id: 'floral', name: 'Floral', image: '/assets/invite/formal.jpg' },
    { id: 'modern', name: 'Modern', image: '/assets/invite/modern.jpg' },
  ];

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvite({ ...invite, imageUrl: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Image must be under 2MB');
    }
  };

  const handleSave = () => {
    if (!selectedEvent || !invite.message) {
      toast.error('Select an event and add a message');
      return;
    }
    // Mock save (store in localStorage or context later)
    toast.success('Invite saved! Ready to share.');
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mt-4 einvite"
    >
      <h2>Create E-Invite</h2>
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Event</Form.Label>
              <Form.Select
                value={selectedEvent}
                onChange={e => setSelectedEvent(e.target.value)}
              >
                <option value="">Choose an event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Template</Form.Label>
              <Form.Select
                value={invite.template}
                onChange={e => setInvite({ ...invite, template: e.target.value })}
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Custom Image (Optional)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={invite.message}
                onChange={e => setInvite({ ...invite, message: e.target.value })}
                placeholder="Join us for our special day..."
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSave}>
              Save Invite
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <h4>Preview</h4>
          <Card className="invite-preview">
            <Card.Img
              variant="top"
              src={
                invite.imageUrl ||
                templates.find(t => t.id === invite.template)?.image ||
                'https://placehold.co/400x600?text=Invite'
              }
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>
                {selectedEventData?.title || 'Your Event'}
              </Card.Title>
              <Card.Text>
                {invite.message || 'Join us for our special day...'}
                <br />
                <strong>Date:</strong>{' '}
                {selectedEventData?.date
                  ? new Date(selectedEventData.date).toLocaleDateString()
                  : 'TBD'}
                <br />
                <strong>Location:</strong>{' '}
                {selectedEventData?.location || 'TBD'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default EInvite;