import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Nav } from 'react-bootstrap';

function Inventory() {
  const [activeTab, setActiveTab] = useState('raw');
  const [showAddModal, setShowAddModal] = useState(false);

  const [rawMaterials, setRawMaterials] = useState([
    {
      id: 1,
      name: 'Raw Masoor Dal',
      quantity: 500,
      unit: 'kg',
      purchasePrice: 45,
      openBalance: 450,
      closingBalance: 500
    },
    {
      id: 2,
      name: 'Raw Moong Dal',
      quantity: 400,
      unit: 'kg',
      purchasePrice: 50,
      openBalance: 380,
      closingBalance: 400
    },
    {
      id: 3,
      name: 'Raw Toor Dal',
      quantity: 300,
      unit: 'kg',
      purchasePrice: 55,
      openBalance: 280,
      closingBalance: 300
    },
    {
      id: 4,
      name: 'Raw Chana Dal',
      quantity: 450,
      unit: 'kg',
      purchasePrice: 48,
      openBalance: 420,
      closingBalance: 450
    },
    {
      id: 5,
      name: 'Raw Urad Dal',
      quantity: 350,
      unit: 'kg',
      purchasePrice: 52,
      openBalance: 320,
      closingBalance: 350
    },
    {
      id: 6,
      name: 'Raw Arhar Dal',
      quantity: 380,
      unit: 'kg',
      purchasePrice: 53,
      openBalance: 350,
      closingBalance: 380
    },
    {
      id: 7,
      name: 'Raw Turmeric',
      quantity: 200,
      unit: 'kg',
      purchasePrice: 80,
      openBalance: 180,
      closingBalance: 200
    }
  ]);

  const [finishedProducts, setFinishedProducts] = useState([
    {
      id: 1,
      name: 'Masoor Dal (Red Lentils)',
      quantity: 300,
      unit: 'kg',
      sellingPrice: 65,
      openBalance: 280,
      closingBalance: 300
    },
    {
      id: 2,
      name: 'Moong Dal (Split Green Gram)',
      quantity: 250,
      unit: 'kg',
      sellingPrice: 70,
      openBalance: 230,
      closingBalance: 250
    },
    {
      id: 3,
      name: 'Toor Dal (Pigeon Peas)',
      quantity: 280,
      unit: 'kg',
      sellingPrice: 75,
      openBalance: 260,
      closingBalance: 280
    },
    {
      id: 4,
      name: 'Chana Dal (Split Chickpeas)',
      quantity: 320,
      unit: 'kg',
      sellingPrice: 68,
      openBalance: 300,
      closingBalance: 320
    },
    {
      id: 5,
      name: 'Urad Dal (Black Gram)',
      quantity: 270,
      unit: 'kg',
      sellingPrice: 72,
      openBalance: 250,
      closingBalance: 270
    },
    {
      id: 6,
      name: 'Arhar Dal (Split Pigeon Peas)',
      quantity: 290,
      unit: 'kg',
      sellingPrice: 73,
      openBalance: 270,
      closingBalance: 290
    },
    {
      id: 7,
      name: 'Processed Turmeric',
      quantity: 150,
      unit: 'kg',
      sellingPrice: 120,
      openBalance: 130,
      closingBalance: 150
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    openBalance: '',
    closingBalance: ''
  });

  const handleClose = () => setShowAddModal(false);
  const handleShow = () => setShowAddModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = {
      id: activeTab === 'raw' ? rawMaterials.length + 1 : finishedProducts.length + 1,
      ...newItem,
      quantity: parseFloat(newItem.quantity),
      [activeTab === 'raw' ? 'purchasePrice' : 'sellingPrice']: parseFloat(newItem.price),
      openBalance: parseFloat(newItem.openBalance),
      closingBalance: parseFloat(newItem.closingBalance)
    };

    if (activeTab === 'raw') {
      setRawMaterials(prev => [...prev, item]);
    } else {
      setFinishedProducts(prev => [...prev, item]);
    }

    setNewItem({
      name: '',
      quantity: '',
      unit: 'kg',
      price: '',
      openBalance: '',
      closingBalance: ''
    });
    handleClose();
  };

  return (
    <Container fluid>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Inventory Management</h1>
        </Col>
        <Col xs="auto">
          <Button variant="success" className="me-2" onClick={handleExportExcel}>
            Export to Excel
          </Button>
          <Button variant="primary" onClick={handleAddModalShow}>
            Add Item
          </Button>
        </Col>
      </Row>

      <InventoryAnalytics rawMaterials={rawMaterials} finishedProducts={finishedProducts} />

      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'raw'}
            onClick={() => setActiveTab('raw')}
          >
            Raw Materials
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'finished'}
            onClick={() => setActiveTab('finished')}
          >
            Finished Products
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Card>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>{activeTab === 'raw' ? 'Purchase Price (₹)' : 'Selling Price (₹)'}</th>
                <th>Open Balance (₹)</th>
                <th>Closing Balance (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'raw' ? rawMaterials : finishedProducts).map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>₹{(activeTab === 'raw' ? item.purchasePrice : item.sellingPrice).toLocaleString()}</td>
                  <td>₹{item.openBalance.toLocaleString()}</td>
                  <td>₹{item.closingBalance.toLocaleString()}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleEditModalShow(item)}>
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
          <Modal.Title>
            Add New {activeTab === 'raw' ? 'Raw Material' : 'Finished Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                as="select"
                name="unit"
                value={newItem.unit}
                onChange={handleInputChange}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="ton">Ton</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                {activeTab === 'raw' ? 'Purchase Price (₹)' : 'Selling Price (₹)'}
              </Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Open Balance (₹)</Form.Label>
              <Form.Control
                type="number"
                name="openBalance"
                value={newItem.openBalance}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Closing Balance (₹)</Form.Label>
              <Form.Control
                type="number"
                name="closingBalance"
                value={newItem.closingBalance}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={handleAddModalClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Item
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Inventory;