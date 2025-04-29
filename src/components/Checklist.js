import React, { useState, useContext } from 'react';
import { EventContext } from '../EventContext';
import { Button, Form, ListGroup, Badge, Modal, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import './Checklist.css';

const Checklist = () => {
  const { events } = useContext(EventContext);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [tasks, setTasks] = useState([
    { 
      id: 'task1', 
      text: 'Book Venue', 
      completed: false, 
      dueDate: null, 
      priority: 'high',
      icon: '🏛️'
    },
    { 
      id: 'task2', 
      text: 'Hire Photographer', 
      completed: false, 
      dueDate: null,
      priority: 'medium',
      icon: '📸'
    },
    { 
      id: 'task3', 
      text: 'Send Invitations', 
      completed: false, 
      dueDate: null,
      priority: 'low',
      icon: '✉️'
    },
  ]);
  // Add these category options
  const taskCategories = [
    { name: 'Venue', color: '#FF6B6B', icon: '🏛️' },
    { name: 'Vendor', color: '#4ECDC4', icon: '🛒' },
    { name: 'Guest', color: '#7D7ABC', icon: '👥' },
    { name: 'Decoration', color: '#FFD166', icon: '🎉' },
    { name: 'Food', color: '#F7A072', icon: '🍽️' },
    { name: 'Other', color: '#95A3B3', icon: '📝' }
  ];
  // Modify newTask to be an object
  const [newTask, setNewTask] = useState({
    text: '',
    priority: 'medium',
    category: 'Other',
    dueDate: null
  });
  const [showShare, setShowShare] = useState(false);

  // Add these additional states
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [editingTask, setEditingTask] = useState(null);
  // Add this state
  const [showEditModal, setShowEditModal] = useState(false);

  // Add these helper functions
  const getColorByPriority = (priority) => {
    switch(priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#198754';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isTaskOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  // Add task filtering and sorting
  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'all') return true;
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'priority': 
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const handleAddTask = () => {
    if (!newTask.text) {
      toast.error('Task description cannot be empty');
      return;
    }
    
    const category = taskCategories.find(cat => cat.name === newTask.category);
    
    setTasks([
      ...tasks,
      { 
        id: `task${Date.now()}`, 
        text: newTask.text, 
        completed: false, 
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        category: newTask.category,
        icon: category?.icon || '📝',
        color: category?.color || '#95A3B3'
      },
    ]);
    
    setNewTask({
      text: '',
      priority: 'medium',
      category: 'Other',
      dueDate: null
    });
    
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

  // Add these handler functions
  const handleEditTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setEditingTask(taskToEdit);
    setShowEditModal(true);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted!');
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setShowEditModal(false);
    toast.success('Task updated!');
  };

  // Add this function and button
  const templateTasks = {
    wedding: [
      { text: 'Book ceremony venue', category: 'Venue', priority: 'high', icon: '🏛️' },
      { text: 'Book reception venue', category: 'Venue', priority: 'high', icon: '🏛️' },
      { text: 'Hire photographer', category: 'Vendor', priority: 'high', icon: '📸' },
      { text: 'Hire caterer', category: 'Food', priority: 'high', icon: '🍽️' },
      { text: 'Send invitations', category: 'Guest', priority: 'medium', icon: '✉️' },
      { text: 'Arrange flowers', category: 'Decoration', priority: 'medium', icon: '💐' }
    ],
    birthday: [
      { text: 'Book party venue', category: 'Venue', priority: 'high', icon: '🏛️' },
      { text: 'Order cake', category: 'Food', priority: 'high', icon: '🎂' },
      { text: 'Send invitations', category: 'Guest', priority: 'medium', icon: '✉️' },
      { text: 'Buy decorations', category: 'Decoration', priority: 'medium', icon: '🎈' }
    ],
    conference: [
      { text: 'Book conference hall', category: 'Venue', priority: 'high', icon: '🏛️' },
      { text: 'Arrange catering', category: 'Food', priority: 'medium', icon: '🍽️' },
      { text: 'Set up tech equipment', category: 'Other', priority: 'high', icon: '💻' },
      { text: 'Send speaker invitations', category: 'Guest', priority: 'high', icon: '🎤' }
    ]
  };

  const addTemplateTasks = (type) => {
    if (!templateTasks[type]) {
      toast.error('No templates found for this event type');
      return;
    }
    
    // Get the selected event's date
    const selectedEventData = events.find(e => e.id === selectedEvent);
    
    // Create tasks from template with due dates relative to the event date
    const newTasks = templateTasks[type].map((task, index) => {
      const category = taskCategories.find(cat => cat.name === task.category);
      
      let dueDate = null;
      if (selectedEventData && selectedEventData.date) {
        const eventDate = new Date(selectedEventData.date);
        // Stagger due dates (further from event for more important tasks)
        const daysAway = 30 - (index * 3);
        const dueDateObj = new Date(eventDate);
        dueDateObj.setDate(eventDate.getDate() - daysAway);
        dueDate = dueDateObj.toISOString().split('T')[0];
      }
      
      return {
        id: `task${Date.now() + index}`,
        text: task.text,
        completed: false,
        dueDate,
        priority: task.priority,
        category: task.category,
        icon: task.icon || category?.icon || '📝',
        color: category?.color || '#95A3B3'
      };
    });
    
    setTasks([...tasks, ...newTasks]);
    toast.success(`Added ${newTasks.length} template tasks!`);
  };

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

      {/* Add this component below the event selection and above the task form */}
      <div className="progress-section mb-4">
        <div className="d-flex justify-content-between mb-2">
          <h5>Progress</h5>
          <span>
            <strong>{tasks.filter(task => task.completed).length}</strong> / {tasks.length} completed
          </span>
        </div>
        <div className="progress" style={{ height: '10px' }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{
              width: `${tasks.length > 0 ? (tasks.filter(task => task.completed).length / tasks.length) * 100 : 0}%`
            }}
            aria-valuenow={tasks.length > 0 ? (tasks.filter(task => task.completed).length / tasks.length) * 100 : 0}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        {tasks.length > 0 && (
          <div className="text-center mt-2">
            {tasks.filter(task => task.completed).length === tasks.length ? (
              <div className="text-success">
                <i className="fas fa-check-circle me-2"></i>All tasks completed!
              </div>
            ) : (
              <div className="text-muted small">
                {100 - Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)}% remaining
              </div>
            )}
          </div>
        )}
      </div>

      {/* Replace the simple form with this expanded version */}
      <div className="task-form mb-4 p-3 border rounded bg-light">
        <h5 className="mb-3"><i className="fas fa-plus-circle me-2"></i>Add New Task</h5>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Task Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTask.text}
                  onChange={e => setNewTask({...newTask, text: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={newTask.category}
                  onChange={e => setNewTask({...newTask, category: e.target.value})}
                >
                  {taskCategories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newTask.dueDate || ''}
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Button 
                variant="primary" 
                onClick={handleAddTask} 
                className="w-100 mt-1"
              >
                <i className="fas fa-plus me-2"></i> Add Task
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Replace the ListGroup with this enhanced version */}
      <div className="tasks-container mb-4">
        <h5 className="mb-3"><i className="fas fa-tasks me-2"></i>Your Tasks</h5>
        
        {tasks.length === 0 ? (
          <div className="text-center p-4 border rounded bg-light">
            <i className="fas fa-clipboard-list fa-2x mb-2 text-muted"></i>
            <p className="mb-0">No tasks added yet. Start building your checklist above!</p>
          </div>
        ) : (
          <div className="task-filters d-flex mb-3">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'} 
              size="sm"
              className="me-2"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'active' ? 'primary' : 'outline-primary'} 
              size="sm"
              className="me-2"
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button 
              variant={filter === 'completed' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
            <div className="ms-auto">
              <Form.Select 
                size="sm" 
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
              >
                <option value="default">Default Order</option>
                <option value="priority">Sort by Priority</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="category">Sort by Category</option>
              </Form.Select>
            </div>
          </div>
        )}
        
        <ListGroup>
          {filteredTasks.map(task => (
            <ListGroup.Item
              key={task.id}
              className={`d-flex align-items-center ${task.completed ? 'completed-task' : ''}`}
              style={{ borderLeft: `4px solid ${task.color || getColorByPriority(task.priority)}` }}
            >
              <div className="task-checkbox me-3">
                <Form.Check
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="task-checkbox"
                />
              </div>
              
              <div className="task-content flex-grow-1">
                <div className={`task-text ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  <span className="task-icon me-2">{task.icon}</span>
                  {task.text}
                </div>
                
                <div className="task-details mt-1 small">
                  {task.category && (
                    <Badge bg="light" text="dark" className="me-2">
                      {task.category}
                    </Badge>
                  )}
                  {task.dueDate && (
                    <Badge bg={isTaskOverdue(task) ? 'danger' : 'secondary'} className="me-2">
                      <i className="far fa-calendar-alt me-1"></i>
                      {formatDate(task.dueDate)}
                    </Badge>
                  )}
                  <Badge 
                    bg={getPriorityColor(task.priority)}
                    className="priority-badge"
                  >
                    {getPriorityIcon(task.priority)} {task.priority}
                  </Badge>
                </div>
              </div>
              
              <div className="task-actions">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEditTask(task.id)}
                >
                  <i className="fas fa-edit"></i>
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

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

      {/* Add this modal component to your JSX */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                type="text"
                value={editingTask?.text || ''}
                onChange={e => setEditingTask({...editingTask, text: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={editingTask?.category || 'Other'}
                onChange={e => setEditingTask({...editingTask, category: e.target.value})}
              >
                {taskCategories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={editingTask?.priority || 'medium'}
                onChange={e => setEditingTask({...editingTask, priority: e.target.value})}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={editingTask?.dueDate || ''}
                onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Update Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add this button group after the event selector */}
      {selectedEvent && (
        <div className="template-section mb-4">
          <h5 className="mb-2">Quick Start with Templates</h5>
          <div className="d-flex flex-wrap gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => addTemplateTasks('wedding')}
            >
              <i className="fas fa-heart me-1"></i> Wedding Tasks
            </Button>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => addTemplateTasks('birthday')}
            >
              <i className="fas fa-birthday-cake me-1"></i> Birthday Tasks
            </Button>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => addTemplateTasks('conference')}
            >
              <i className="fas fa-microphone me-1"></i> Conference Tasks
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Checklist;