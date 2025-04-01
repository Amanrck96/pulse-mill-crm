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

function PurchaseAnalytics({ purchases }) {
  const [realtimeData, setRealtimeData] = useState(purchases);

  useEffect(() => {
    websocketService.connect();
    websocketService.subscribe('purchase_update', (data) => {
      setRealtimeData(data);
    });

    return () => {
      websocketService.unsubscribe('purchase_update');
      websocketService.disconnect();
    };
  }, []);

  const totalPurchases = realtimeData.reduce((sum, purchase) => sum + purchase.total, 0);
  const completedPurchases = realtimeData.filter(p => p.status === 'Completed').length;
  const pendingPurchases = realtimeData.filter(p => p.status === 'Pending').length;

  const monthlyData = realtimeData.reduce((acc, purchase) => {
    const month = new Date(purchase.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + purchase.total;
    return acc;
  }, {});

  const productData = realtimeData.reduce((acc, purchase) => {
    acc[purchase.product] = (acc[purchase.product] || 0) + purchase.quantity;
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Purchase Trends',
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
        label: 'Product Quantity Distribution',
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
              <Card.Title>Total Purchases</Card.Title>
              <h3>₹{totalPurchases.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Completed Orders</Card.Title>
              <h3>{completedPurchases}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pending Orders</Card.Title>
              <h3>{pendingPurchases}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Purchase Trends</Card.Title>
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

export default PurchaseAnalytics;