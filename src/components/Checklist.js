import React, { useState, useContext } from 'react';
import { EventContext } from '../EventContext';
import { Button, Form, ListGroup, Badge, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Checklist.css';

const Checklist = () => {
  const { events } = useContext(EventContext);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [tasks, setTasks] = useState([
    { id: 'task1', text: 'Book Venue', completed: false, dueDate: null },
    { id: 'task2', text: 'Hire Photographer', completed: false, dueDate: null },
    { id: 'task3', text: 'Send Invitations', completed: false, dueDate: null },
  ]);
  const [newTask, setNewTask] = useState('');
  const [showShare, setShowShare] = useState(false);

  const handleAddTask = () => {
    if (!newTask) {
      toast.error('Task cannot be empty');
      return;
    }
    setTasks([
      ...tasks,
      { id: `task${tasks.length + 1}`, text: newTask, completed: false, dueDate: null },
    ]);
    setNewTask('');
    toast.success('Task added!');
  };

  const handleToggleTask = id => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleShare = () => {
    // Mock sharing (copy to clipboard)
    const checklistText = tasks
      .map(task => `${task.completed ? '[x]' : '[ ]'} ${task.text}`)
      .join('\n');
    navigator.clipboard.writeText(checklistText);
    toast.success('Checklist copied to share!');
    setShowShare(false);
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);
  const countdown =
    selectedEventData && selectedEventData.date
      ? Math.ceil(
          (new Date(selectedEventData.date) - new Date()) / (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mt-4 checklist"
    >
      <h2>Event Checklist</h2>
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

      {selectedEvent && countdown !== null && (
        <h4 className="text-center mb-4">
          Countdown: <Badge bg="primary">{countdown} days left</Badge>
        </h4>
      )}

      <Form className="mb-3 d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Add new task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddTask}>
          Add Task
        </Button>
      </Form>

      <ListGroup className="mb-4">
        {tasks.map(task => (
          <ListGroup.Item
            key={task.id}
            className="d-flex justify-content-between align-items-center"
          >
            <Form.Check
              type="checkbox"
              label={task.text}
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
            />
            {task.dueDate && (
              <Badge bg="secondary">{new Date(task.dueDate).toLocaleDateString()}</Badge>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Button variant="success" onClick={() => setShowShare(true)}>
        Share Checklist
      </Button>

      <Modal show={showShare} onHide={() => setShowShare(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share Checklist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Click below to copy the checklist to your clipboard and share it with family!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShare(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleShare}>
            Copy Checklist
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default Checklist;