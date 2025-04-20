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
  const [setPreview] = useState(null);

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
      // Make card size smaller
      document.querySelectorAll('.invite-preview').forEach(card => {
        card.style.maxWidth = '50%'; // Reduced from 70% to 50%
        card.style.margin = '0 auto';
      });
      
      // Reduce the preview card image size by 30%
      document.querySelectorAll('.invite-preview .card-img-top').forEach(img => {
        img.style.maxWidth = '70%';
        img.style.margin = '0 auto';
      });
      
      reader.onloadend = () => {
        setInvite({ ...invite, imageUrl: reader.result });
        
        // Make the preview card responsive to the screen size
        document.querySelectorAll('.invite-preview').forEach(card => {
          card.style.maxWidth = '100%';
          card.style.width = 'auto';
          card.style.margin = '0 auto';
        });
        
        // Make the image responsive within the card
        document.querySelectorAll('.invite-preview .card-img-top').forEach(img => {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.objectFit = 'contain';
        });
        // Make the preview card responsive to screen size
        document.querySelectorAll('.invite-preview').forEach(card => {
          card.style.maxWidth = '100%';
          card.style.width = 'auto';
          card.style.height = 'auto';
        });
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
  
  // Add a share invite feature
  const handleShareInvite = () => {
    if (!selectedEvent || !invite.message) {
      toast.error('Please complete your invite before sharing');
      return;
    }
    
    // Mock share functionality
    toast.info('Share feature would open here with options for social media, email, etc.');
    // In a real implementation, you could use the Web Share API or custom sharing options
  };

  // Add download invite feature
  const handleDownload = () => {
    if (!selectedEvent || !invite.message) {
      toast.error('Please complete your invite first');
      return;
    }
    
    // This is a placeholder for actual download functionality
    toast.success('Your invite would download as an image here');
    // In a real implementation, you'd use html-to-image or similar library
  };

  // Add animation variants for template selection
  const templateVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 }
    }
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
          <div className="preview-container">
            <h4>Preview</h4>
            {selectedEvent && (
              <Card className="invite-preview">
                <Card.Img 
                  variant="top" 
                  src={invite.imageUrl || templates.find(t => t.id === invite.template)?.image} 
                  alt="Invitation Template" 
                />
                <Card.Body className="text-center">
                  <h3>{selectedEventData?.title}</h3>
                  <p className="invite-message">{invite.message}</p>
                  <p><strong>Date:</strong> {selectedEventData?.date}</p>
                  <p><strong>Location:</strong> {selectedEventData?.location}</p>
                </Card.Body>
              </Card>
            )}
            <div className="d-flex justify-content-center mt-3 gap-2">
              <Button variant="outline-primary" onClick={handleShareInvite}>
                Share Invite
              </Button>
              <Button variant="outline-success" onClick={handleDownload}>
                Download
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default EInvite;