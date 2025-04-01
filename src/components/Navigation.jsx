import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Pulse Mill CRM</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/employees">Employees</Nav.Link>
            <Nav.Link as={Link} to="/inventory">Inventory</Nav.Link>
            <Nav.Link as={Link} to="/sales">Sales</Nav.Link>
            <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
            <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;