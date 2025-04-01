import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import SalesAnalytics from '../components/SalesAnalytics';

function Sales() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [sales, setSales] = useState([
    {
      id: 1,
      date: '2023-08-15',
      customer: 'ABC Trading Co.',
      contactNumber: '9876543210',
      product: 'Processed Pulses',
      quantity: 100,
      unit: 'kg',
      unitPrice: 65,
      total: 6500,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2023-08-14',
      customer: 'XYZ Retailers',
      product: 'Processed Turmeric',
      quantity: 50,
      unit: 'kg',
      unitPrice: 120,
      total: 6000,
      status: 'Pending'
    }
  ]);

  const [newSale, setNewSale] = useState({
    date: '',
    customer: '',
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
    setSelectedSale(null);
  };

  const handleEditModalShow = (sale) => {
    setSelectedSale({...sale});
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const quantity = parseFloat(newSale.quantity) || 0;
    const unitPrice = parseFloat(newSale.unitPrice) || 0;
    return quantity * unitPrice;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSales(prev => prev.map(sale => 
      sale.id === selectedSale.id ? {
        ...selectedSale,
        quantity: parseFloat(selectedSale.quantity),
        unitPrice: parseFloat(selectedSale.unitPrice),
        total: parseFloat(selectedSale.quantity) * parseFloat(selectedSale.unitPrice)
      } : sale
    ));
    handleEditModalClose();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const sale = {
      id: sales.length + 1,
      ...newSale,
      quantity: parseFloat(newSale.quantity),
      unitPrice: parseFloat(newSale.unitPrice),
      total: calculateTotal(),
      status: 'Pending'
    };
    setSales(prev => [...prev, sale]);
    setNewSale({
      date: '',
      customer: '',
      product: '',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      status: 'Pending'
    });
    handleAddModalClose();
  };

  const handleGenerateInvoice = (saleId) => {
    // TODO: Implement invoice generation in PDF format
    console.log('Generating invoice for sale:', saleId);
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    console.log('Exporting sales data to Excel');
  };

  return (
    <Container fluid>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Sales Management</h1>
        </Col>
        <Col xs="auto">
          <Button variant="success" className="me-2" onClick={handleExportExcel}>
            Export to Excel
          </Button>
          <Button variant="primary" onClick={handleAddModalShow}>
            Add Sale
          </Button>
        </Col>
      </Row>

      <SalesAnalytics sales={sales} />

      <Card>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Customer</th>
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
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.date}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.contactNumber}</td>
                  <td>{sale.product}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.unit}</td>
                  <td>₹{sale.unitPrice.toLocaleString()}</td>
                  <td>₹{sale.total.toLocaleString()}</td>
                  <td>
                    <span className={`badge bg-${sale.status === 'Completed' ? 'success' : 'warning'}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleGenerateInvoice(sale.id)}
                    >
                      Generate Invoice
                    </Button>
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEditModalShow(sale)}
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
          <Modal.Title>Add New Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newSale.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="customer"
                value={newSale.customer}
                onChange={handleInputChange}
                required
                placeholder="Enter customer name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                name="contactNumber"
                value={newSale.contactNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter contact number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                as="select"
                name="product"
                value={newSale.product}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Product</option>
                <option value="Masoor Dal">Masoor Dal (Red Lentils)</option>
                <option value="Moong Dal">Moong Dal (Split Green Gram)</option>
                <option value="Toor Dal">Toor Dal (Pigeon Peas)</option>
                <option value="Chana Dal">Chana Dal (Split Chickpeas)</option>
                <option value="Urad Dal">Urad Dal (Black Gram)</option>
                <option value="Arhar Dal">Arhar Dal (Split Pigeon Peas)</option>
                <option value="Processed Turmeric">Processed Turmeric</option>
                <option value="Raw Masoor Dal">Raw Masoor Dal</option>
                <option value="Raw Moong Dal">Raw Moong Dal</option>
                <option value="Raw Toor Dal">Raw Toor Dal</option>
                <option value="Raw Chana Dal">Raw Chana Dal</option>
                <option value="Raw Urad Dal">Raw Urad Dal</option>
                <option value="Raw Arhar Dal">Raw Arhar Dal</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={newSale.quantity}
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
                value={newSale.unit}
                onChange={handleInputChange}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="ton">Ton</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="unitPrice"
                value={newSale.unitPrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newSale.status}
                onChange={handleInputChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="text"
                value={`₹${calculateTotal().toLocaleString()}`}
                disabled
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={handleAddModalClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Sale
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={selectedSale?.date || ''}
                onChange={(e) => setSelectedSale(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                type="text"
                name="customer"
                value={selectedSale?.customer || ''}
                onChange={(e) => setSelectedSale(prev => ({ ...prev, customer: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                as="select"
                name="product"
                value={selectedSale?.product || ''}
                onChange={(e) => setSelectedSale(prev => ({ ...prev, product: e.target.value }))}
                required
              >
                <option value="">Select Product</option>
                <option value="Masoor Dal">Masoor Dal (Red Lentils)</option>
                <option value="Moong Dal">Moong Dal (Split Green Gram)</option>
                <option value="Toor Dal">Toor Dal (Pigeon Peas)</option>
                <option value="Chana Dal">Chana Dal (Split Chickpeas)</option>
                <option value="Urad Dal">Urad Dal (Black Gram)</option>
                <option value="Arhar Dal">Arhar Dal (Split Pigeon Peas)</option>
                <option value="Processed Turmeric">Processed Turmeric</option>
                <option value="Raw Masoor Dal">Raw Masoor Dal</option>
                <option value="Raw Moong Dal">Raw Moong Dal</option>
                <option value="Raw Toor Dal">Raw Toor Dal</option>
                <option value="Raw Chana Dal">Raw Chana Dal</option>
                <option value="Raw Urad Dal">Raw Urad Dal</option>
                <option value="Raw Arhar Dal">Raw Arhar Dal</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={selectedSale?.quantity || ''}
                onChange={(e) => setSelectedSale(prev => ({ ...prev, quantity: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                as="select"
                name="unit"
                value={selectedSale?.unit || ''}
                onChange={(e) => setSelectedSale(prev => ({ ...prev, unit: e.target.value }))}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="ton">Ton</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="unitPrice"
                value={selectedSale?.unitPrice || ''}
                onChange={(e) => setSelectedSale(prev => ({ ...prev, unitPrice: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={selectedSale?.status || ''}
                onChange={(e) => setSelectedSale(prev => ({ ...prev, status: e.target.value }))}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="text"
                value={`₹${(parseFloat(selectedSale?.quantity || 0) * parseFloat(selectedSale?.unitPrice || 0)).toLocaleString()}`}
                disabled
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

export default Sales;