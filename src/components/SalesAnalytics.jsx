import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { websocketService } from '../services/websocket';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SalesAnalytics({ sales }) {
  const [realtimeData, setRealtimeData] = useState(sales);

  useEffect(() => {
    websocketService.connect();
    websocketService.subscribe('sales_update', (data) => {
      setRealtimeData(data);
    });

    return () => {
      websocketService.unsubscribe('sales_update');
      websocketService.disconnect();
    };
  }, []);

  const totalSales = realtimeData.reduce((sum, sale) => sum + sale.total, 0);
  const completedSales = realtimeData.filter(s => s.status === 'Completed').length;
  const pendingSales = realtimeData.filter(s => s.status === 'Pending').length;

  const monthlyData = realtimeData.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + sale.total;
    return acc;
  }, {});

  const productData = realtimeData.reduce((acc, sale) => {
    acc[sale.product] = (acc[sale.product] || 0) + sale.quantity;
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Sales Trends',
        data: Object.values(monthlyData),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(productData),
    datasets: [
      {
        label: 'Product Sales Distribution',
        data: Object.values(productData),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="mb-4">
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <h3>₹{totalSales.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Completed Orders</Card.Title>
              <h3>{completedSales}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pending Orders</Card.Title>
              <h3>{pendingSales}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Sales Trends</Card.Title>
              <Line data={lineChartData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Product Distribution</Card.Title>
              <Bar data={barChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SalesAnalytics;