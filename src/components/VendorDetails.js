import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { Card, Button, ListGroup } from 'react-bootstrap';

const VendorDetails = () => {
  const { id } = useParams();
  const { vendors } = useContext(EventContext);
  const vendor = vendors.find(v => v.id === id);

  if (!vendor) {
    return (
      <div className="container mt-4 text-center">
        <h2>Vendor not found</h2>
        <Button as={Link} to="/vendors" variant="primary">
          Back to Vendors
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>{vendor.name}</h2>
      <Card>
        <Card.Img
          variant="top"
          src={`https://placehold.co/600x400?text=${vendor.name}`}
          style={{ height: '300px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>{vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)}</Card.Title>
          <Card.Text>
            <strong>Cost:</strong> ${vendor.cost}
            <br />
            <strong>Location:</strong> {vendor.location}
            <br />
            <strong>Rating:</strong> {vendor.rating || 'N/A'}/5
            <br />
            <strong>Events:</strong> {vendor.eventTypes.join(', ')}
          </Card.Text>
        </Card.Body>
      </Card>
      <h4 className="mt-4">Reviews</h4>
      <ListGroup>
        {(vendor.reviews || []).map((review, index) => (
          <ListGroup.Item key={index}>
            <strong>{review.user}</strong>: {review.comment} ({review.rating}/5)
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button as={Link} to="/vendors" variant="secondary" className="mt-3">
        Back to Vendors
      </Button>
    </div>
  );
};

export default VendorDetails;