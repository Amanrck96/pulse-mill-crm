import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';

function Expenses() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: '2023-08-15',
      category: 'Electricity',
      description: 'Monthly Power Bill',
      amount: 15000,
      status: 'Paid'
    },
    {
      id: 2,
      date: '2023-08-14',
      category: 'Food',
      description: 'Employee Meals',
      amount: 5000,
      status: 'Pending'
    }
  ]);

  const [newExpense, setNewExpense] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
    status: 'Pending'
  });

  const handleClose = () => setShowAddModal(false);
  const handleShow = () => setShowAddModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };
    setExpenses(prev => [...prev, expense]);
    setNewExpense({
      date: '',
      category: '',
      description: '',
      amount: '',
      status: 'Pending'
    });
    handleClose();
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    console.log('Exporting expenses data to Excel');
  };

  return (
    <Container fluid>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Expense Management</h1>
        </Col>
        <Col xs="auto">
          <Button variant="success" className="me-2" onClick={handleExportExcel}>
            Export to Excel
          </Button>
          <Button variant="primary" onClick={handleShow}>
            Add Expense
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.date}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>₹{expense.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge bg-${expense.status === 'Paid' ? 'success' : 'warning'}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>
                    <Button variant="info" size="sm" className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showAddModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={newExpense.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electricity">Electricity</option>
                <option value="Food">Food</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Transportation">Transportation</option>
                <option value="Wages">Employee Wages</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Packaging">Packaging Materials</option>
                <option value="Equipment">Equipment & Machinery</option>
                <option value="Utilities">Utilities (Water, Gas)</option>
                <option value="Insurance">Insurance</option>
                <option value="Marketing">Marketing & Advertising</option>
                <option value="Office">Office Supplies</option>
                <option value="Others">Others</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newExpense.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={newExpense.amount}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newExpense.status}
                onChange={handleInputChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </Form.Control>
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Expense
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Expenses;