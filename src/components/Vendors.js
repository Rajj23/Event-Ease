import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { EventContext } from '../EventContext';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Vendors.css';

const Vendors = () => {
  const { vendors } = useContext(EventContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') || '';
  const [filterType, setFilterType] = useState(initialType);

  const vendorTypes = [
    'photographer',
    'caterer',
    'venue',
    'event_planner',
    'entertainment',
    'decorator',
    'av_tech',
    'designer',
  ];

  const filteredVendors = filterType
    ? vendors.filter((vendor) => vendor.type === filterType)
    : vendors;

  useEffect(() => {
    setFilterType(initialType);
  }, [initialType]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mt-4 vendors"
    >
      <h2>Find Vendors</h2>
      <Form.Group className="mb-4" style={{ maxWidth: '300px' }}>
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
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card>
                  <Card.Img
                    variant="top"
                    src={vendor.imageUrl || 'https://placehold.co/400x250?text=Vendor+Image'}
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{vendor.name}</Card.Title>
                    <Card.Text>
                      <strong>Type:</strong>{' '}
                      {vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)}
                      <br />
                      <strong>Cost:</strong> ₹{vendor.cost}
                      <br />
                      <strong>Location:</strong> {vendor.location}
                    </Card.Text>
                    <Link to="/create" className="btn btn-primary">
                      Plan with Vendor
                    </Link>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <Col>
            <p>No vendors found for this type.</p>
          </Col>
        )}
      </Row>
    </motion.div>
  );
};

export default Vendors;
