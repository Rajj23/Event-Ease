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
  const chartData = {
    labels: events.map(event => event.title || 'Untitled'),
    datasets: [
      {
        label: 'Budget (₹)',
        data: events.map(event => Number(event.budget) || 0),
        backgroundColor: 'rgba(129, 178, 154, 0.5)',
        borderColor: 'rgba(129, 178, 154, 1)',
        borderWidth: 1,
      },
      {
        label: 'Spent (₹)',
        data: events.map(event =>
          (event.vendors || []).reduce((sum, vid) => {
            const vendor = vendors.find(v => v.id === vid);
            return vendor ? sum + Number(vendor.cost) : sum;
          }, 0)
        ),
        backgroundColor: 'rgba(224, 122, 95, 0.5)',
        borderColor: 'rgba(224, 122, 95, 1)',
        borderWidth: 1,
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
          <Button as={Link} to="/create" variant="primary" className="mb-3">
            Create New Event
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Bar data={chartData} options={chartOptions} />
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
                      <Button
                        as={Link}
                        to={`/event/${event.id}`}
                        variant="primary"
                        size="sm"
                        className="me-2"
                        disabled={!event.id}
                        onClick={() => console.log('Navigating to details ID:', event.id)}
                      >
                        View Details
                      </Button>
                      <Button
                        as={Link}
                        to={`/event/${event.id}/edit`}
                        variant="warning"
                        size="sm"
                        className="me-2"
                        disabled={!event.id}
                        onClick={() => console.log('Navigating to edit ID:', event.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        as={Link}
                        to={`/event/${event.id}/vendors`}
                        variant="success"
                        size="sm"
                        className="me-2"
                        disabled={!event.id}
                        onClick={() => console.log('Navigating to vendors ID:', event.id)}
                      >
                        Vendors
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        disabled={!event.id}
                      >
                        Delete
                      </Button>
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