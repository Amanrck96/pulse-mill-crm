import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sample data for reports
  const salesTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales Revenue',
      data: [45000, 52000, 49000, 60000, 55000, 65000],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const profitLossData = {
    labels: ['Revenue', 'Cost of Goods', 'Operating Expenses', 'Net Profit'],
    datasets: [{
      label: 'Amount (₹)',
      data: [65000, 35000, 15000, 15000],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(54, 162, 235, 0.5)'
      ]
    }]
  };

  const employeePerformanceData = {
    labels: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'],
    datasets: [{
      label: 'Performance Score',
      data: [85, 90, 78, 88],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }]
  };

  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    if (element) {
      window.print();
    }
  };

  const handleExportExcel = () => {
    const data = {
      salesTrend: salesTrendData,
      profitLoss: profitLossData,
      employeePerformance: employeePerformanceData
    };
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'report.xlsx');
  };

  return (
    <Container fluid>
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Reports & Analytics</h1>
        </Col>
        <Col xs="auto">
          <Button variant="success" className="me-2" onClick={handleExportExcel}>
            Export to Excel
          </Button>
          <Button variant="danger" onClick={handleExportPDF}>
            Export to PDF
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Report Type</Form.Label>
            <Form.Control
              as="select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="sales">Sales Analysis</option>
              <option value="profitLoss">Profit & Loss</option>
              <option value="inventory">Inventory Movement</option>
              <option value="employee">Employee Performance</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Date Range</Form.Label>
            <Form.Control
              as="select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="custom">Custom Range</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={dateRange !== 'custom'}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={dateRange !== 'custom'}
            />
          </Form.Group>
        </Col>
      </Row>

      <div id="report-content">
      </div>
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Sales Trend</Card.Title>
                <Line 
                  data={salesTrendData} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Sales Revenue Over Time' }
                    }
                  }} 
                />
              </Card.Body>
            </Card>
          </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Profit & Loss Analysis</Card.Title>
              <Bar data={profitLossData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Employee Performance</Card.Title>
              <Bar data={employeePerformanceData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Key Metrics</Card.Title>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>Total Revenue</td>
                    <td>₹65,000</td>
                  </tr>
                  <tr>
                    <td>Net Profit</td>
                    <td>₹15,000</td>
                  </tr>
                  <tr>
                    <td>Profit Margin</td>
                    <td>23.08%</td>
                  </tr>
                  <tr>
                    <td>Average Order Value</td>
                    <td>₹6,250</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Reports;