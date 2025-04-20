import { useContext } from 'react';
import { EventContext } from '../EventContext';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { events, vendors, deleteEvent } = useContext(EventContext);
  console.log('Dashboard events:', events);

  // Chart data
  // Chart data with improved styling
  const chartData = {
    labels: events.map(event => {
      const title = event.title || 'Untitled';
      // Truncate long titles for better display
      return title.length > 15 ? title.substring(0, 15) + '...' : title;
    }),
    datasets: [
      {
        label: 'Budget (₹)',
        data: events.map(event => Number(event.budget) || 0),
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(53, 162, 235, 0.9)',
      },
      {
        label: 'Spent (₹)',
        data: events.map(event =>
          (event.vendors || []).reduce((sum, vid) => {
            const vendor = vendors.find(v => v.id === vid);
            return vendor ? sum + Number(vendor.cost) : sum;
          }, 0)
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.9)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Budget vs. Spent per Event' },
    },
  };

  const handleDelete = (eventId) => {
    console.log('Dashboard delete ID:', eventId);
    const success = deleteEvent(eventId);
    if (success) {
      toast.success('Event deleted successfully');
    } else {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="container mt-4 dashboard">
      <h2>My Events Dashboard</h2>
      <Row className="mb-4">
        <Col>
          <Link to="/create">
            <Button variant="primary" className="mb-3">
              Create New Event
            </Button>
          </Link>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body style={{ height: '400px' }}> {/* Increased height by 10% from 300px */}
              <Bar data={chartData} options={{
                ...chartOptions,
                maintainAspectRatio: false // Allow chart to fit container height
              }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {events.length === 0 ? (
        <p className="text-muted">
          No events yet. <Link to="/create">Create one now!</Link>
        </p>
      ) : (
        <Row>
          {events.map((event, index) => {
            const totalSpent = (event.vendors || []).reduce((sum, vid) => {
              const vendor = vendors.find(v => v.id === vid);
              return vendor ? sum + Number(vendor.cost) : sum;
            }, 0);
            const budgetStatus = totalSpent > Number(event.budget) ? 'text-danger' : 'text-success';
            return (
              <Col md={4} key={event.id || `event-${index}`} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <Card.Img
                      variant="top"
                      src={event.imageUrl || 'https://placehold.co/300x200?text=Event+Image'}
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title>{event.title || 'Untitled'}</Card.Title>
                      <Card.Text>
                        <strong>Type:</strong>{' '}
                        {event.eventType
                          ? event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)
                          : 'Unknown'}
                        <br />
                        <strong>Budget:</strong> ₹{Number(event.budget || 0).toLocaleString('en-IN')}
                        <br />
                        <strong>Spent:</strong> <span className={budgetStatus}>₹{totalSpent.toLocaleString('en-IN')}</span>
                        <br />
                        <strong>Date:</strong>{' '}
                        {event.date ? new Date(event.date).toLocaleDateString() : 'Not set'}
                      </Card.Text>
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {event.id ? (
                          <Link to={`/event/${event.id}`}>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => console.log('Navigating to details ID:', event.id)}
                            >
                              View Details
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled
                            onClick={() => toast.error('Event ID is missing')}
                          >
                            View Details
                          </Button>
                        )}
                        
                        {event.id ? (
                          <Link to={`/event/${event.id}/edit`}>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => console.log('Navigating to edit ID:', event.id)}
                            >
                              Edit
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="warning"
                            size="sm"
                            disabled
                            onClick={() => toast.error('Event ID is missing')}
                          >
                            Edit
                          </Button>
                        )}
                        
                        {event.id ? (
                          <Link to={`/event/${event.id}/vendors`}>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => console.log('Navigating to vendors ID:', event.id)}
                            >
                              Vendors
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="success"
                            size="sm"
                            disabled
                            onClick={() => toast.error('Event ID is missing')}
                          >
                            Vendors
                          </Button>
                        )}
                        
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          disabled={!event.id}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default Dashboard;