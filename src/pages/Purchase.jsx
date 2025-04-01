import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import PurchaseAnalytics from '../components/PurchaseAnalytics';

function Purchase() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [purchases, setPurchases] = useState([
    {
      id: 1,
      date: '2023-08-15',
      supplier: 'XYZ Suppliers',
      contactNumber: '9876543210',
      product: 'Raw Pulses',
      quantity: 500,
      unit: 'kg',
      unitPrice: 45,
      total: 22500,
      status: 'Completed'
    }
  ]);

  const [newPurchase, setNewPurchase] = useState({
    date: '',
    supplier: '',
    contactNumber: '',
    product: '',
    quantity: '',
    unit: 'kg',
    unitPrice: '',
    status: 'Pending'
  });

  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedPurchase(null);
  };

  const handleEditModalShow = (purchase) => {
    setSelectedPurchase({...purchase});
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const quantity = parseFloat(newPurchase.quantity) || 0;
    const unitPrice = parseFloat(newPurchase.unitPrice) || 0;
    return quantity * unitPrice;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setPurchases(prev => prev.map(purchase => 
      purchase.id === selectedPurchase.id ? {
        ...selectedPurchase,
        quantity: parseFloat(selectedPurchase.quantity),
        unitPrice: parseFloat(selectedPurchase.unitPrice),
        total: parseFloat(selectedPurchase.quantity) * parseFloat(selectedPurchase.unitPrice)
      } : purchase
    ));
    handleEditModalClose();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const purchase = {
      id: purchases.length + 1,
      ...newPurchase,
      quantity: parseFloat(newPurchase.quantity),
      unitPrice: parseFloat(newPurchase.unitPrice),
      total: calculateTotal(),
      status: 'Pending'
    };
    setPurchases(prev => [...prev, purchase]);
    setNewPurchase({
      date: '',
      supplier: '',
      contactNumber: '',
      product: '',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      status: 'Pending'
    });
    handleAddModalClose();
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    console.log('Exporting purchase data to Excel');
  };

  return (
    <Container fluid>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Purchase Management</h1>
        </Col>
        <Col xs="auto">
          <Button variant="success" className="me-2" onClick={handleExportExcel}>
            Export to Excel
          </Button>
          <Button variant="primary" onClick={handleAddModalShow}>
            Add Purchase
          </Button>
        </Col>
      </Row>

      <PurchaseAnalytics purchases={purchases} />

      <Card>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Contact Number</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Unit Price (₹)</th>
                <th>Total (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(purchase => (
                <tr key={purchase.id}>
                  <td>{purchase.id}</td>
                  <td>{purchase.date}</td>
                  <td>{purchase.supplier}</td>
                  <td>{purchase.contactNumber}</td>
                  <td>{purchase.product}</td>
                  <td>{purchase.quantity}</td>
                  <td>{purchase.unit}</td>
                  <td>₹{purchase.unitPrice.toLocaleString()}</td>
                  <td>₹{purchase.total.toLocaleString()}</td>
                  <td>
                    <span className={`badge bg-${purchase.status === 'Completed' ? 'success' : 'warning'}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEditModalShow(purchase)}
                    >
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

      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newPurchase.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Supplier Name</Form.Label>
              <Form.Control
                type="text"
                name="supplier"
                value={newPurchase.supplier}
                onChange={handleInputChange}
                required
                placeholder="Enter supplier name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                name="contactNumber"
                value={newPurchase.contactNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter contact number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                type="text"
                name="product"
                value={newPurchase.product}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={newPurchase.quantity}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                as="select"
                name="unit"
                value={newPurchase.unit}
                onChange={handleInputChange}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="ton">Ton</option>
                <option value="quintal">Quintal</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="unitPrice"
                value={newPurchase.unitPrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                value={calculateTotal()}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newPurchase.status}
                onChange={handleInputChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Purchase
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={selectedPurchase?.date || ''}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Supplier</Form.Label>
              <Form.Control
                type="text"
                name="supplier"
                value={selectedPurchase?.supplier || ''}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                name="contactNumber"
                value={selectedPurchase?.contactNumber || ''}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                type="text"
                name="product"
                value={selectedPurchase?.product || ''}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={selectedPurchase?.quantity || ''}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                as="select"
                name="unit"
                value={selectedPurchase?.unit || 'kg'}
                onChange={handleEditInputChange}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="ton">Ton</option>
                <option value="quintal">Quintal</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="unitPrice"
                value={selectedPurchase?.unitPrice || ''}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={selectedPurchase?.status || 'Pending'}
                onChange={handleEditInputChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Purchase;