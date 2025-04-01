import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';

function Employees() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      role: 'Mill Operator',
      salary: 15000,
      dailyWage: 500,
      daysWorked: 30,
      commission: 0,
      performance: 88,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Quality Control',
      salary: 18000,
      commission: 0,
      performance: 92,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Salesperson',
      salary: 25000,
      commission: 2.5,
      performance: 85,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'Manager',
      salary: 35000,
      commission: 0,
      performance: 90,
      status: 'Active'
    }
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    salary: '',
    dailyWage: '',
    daysWorked: '',
    commission: '',
    performance: ''
  });

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  const handleEditModalShow = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmployee.id ? {
        ...selectedEmployee,
        salary: parseFloat(selectedEmployee.salary),
        commission: parseFloat(selectedEmployee.commission),
        performance: parseFloat(selectedEmployee.performance)
      } : emp
    ));
    handleEditModalClose();
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      salary: parseFloat(newEmployee.salary),
      commission: parseFloat(newEmployee.commission),
      performance: parseFloat(newEmployee.performance)
    };
    setEmployees(prev => [...prev, employee]);
    setNewEmployee({
      name: '',
      role: '',
      salary: '',
      commission: '',
      performance: ''
    });
    handleAddModalClose();
  };

  return (
    <Container fluid>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Employee Management</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAddModalShow}>
            Add Employee
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Salesperson">Salesperson</option>
            <option value="Manager">Manager</option>
            <option value="Operator">Operator</option>
            <option value="Assistant">Assistant</option>
          </Form.Select>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Salary (₹)</th>
                <th>Daily Wage (₹)</th>
                <th>Days Worked</th>
                <th>Commission (%)</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .filter(emp => 
                  (filterRole === 'all' || emp.role === filterRole) &&
                  (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(employee => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>₹{employee.salary.toLocaleString()}</td>
                  <td>₹{employee.dailyWage}</td>
                  <td>{employee.daysWorked}</td>
                  <td>{employee.commission}%</td>
                  <td>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${employee.performance}%` }}
                        aria-valuenow={employee.performance}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {employee.performance}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditModalShow(employee)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={newEmployee.role}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Salesperson">Salesperson</option>
                <option value="Operator">Operator</option>
                <option value="Assistant">Assistant</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Daily Wage (₹)</Form.Label>
              <Form.Control
                type="number"
                name="dailyWage"
                value={newEmployee.dailyWage}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Days Worked</Form.Label>
              <Form.Control
                type="number"
                name="daysWorked"
                value={newEmployee.daysWorked}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary (₹)</Form.Label>
              <Form.Control
                type="number"
                name="salary"
                value={newEmployee.salary}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Commission (%)</Form.Label>
              <Form.Control
                type="number"
                name="commission"
                value={newEmployee.commission}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Performance Score</Form.Label>
              <Form.Control
                type="number"
                name="performance"
                value={newEmployee.performance}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Employee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedEmployee?.name || ''}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={selectedEmployee?.role || ''}
                onChange={handleEditInputChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Salesperson">Salesperson</option>
                <option value="Manager">Manager</option>
                <option value="Operator">Operator</option>
                <option value="Assistant">Assistant</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary (₹)</Form.Label>
              <Form.Control
                type="number"
                name="salary"
                value={selectedEmployee?.salary || ''}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Commission (%)</Form.Label>
              <Form.Control
                type="number"
                name="commission"
                value={selectedEmployee?.commission || ''}
                onChange={handleEditInputChange}
                step="0.1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Performance</Form.Label>
              <Form.Control
                type="number"
                name="performance"
                value={selectedEmployee?.performance || ''}
                onChange={handleEditInputChange}
                min="0"
                max="100"
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={handleEditModalClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Employees;