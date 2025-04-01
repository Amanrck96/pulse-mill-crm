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

function InventoryAnalytics({ rawMaterials, finishedProducts }) {
  const [realtimeRawMaterials, setRealtimeRawMaterials] = useState(rawMaterials);
  const [realtimeFinishedProducts, setRealtimeFinishedProducts] = useState(finishedProducts);

  useEffect(() => {
    websocketService.connect();
    websocketService.subscribe('inventory_update', (data) => {
      const { rawMaterials, finishedProducts } = data;
      if (rawMaterials) setRealtimeRawMaterials(rawMaterials);
      if (finishedProducts) setRealtimeFinishedProducts(finishedProducts);
    });

    return () => {
      websocketService.unsubscribe('inventory_update');
      websocketService.disconnect();
    };
  }, []);

  const totalRawValue = realtimeRawMaterials.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0);
  const totalFinishedValue = realtimeFinishedProducts.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
  
  const rawMaterialsData = realtimeRawMaterials.reduce((acc, item) => {
    acc[item.name] = item.quantity;
    return acc;
  }, {});

  const finishedProductsData = realtimeFinishedProducts.reduce((acc, item) => {
    acc[item.name] = item.quantity;
    return acc;
  }, {});

  const stockTrendData = {
    labels: realtimeRawMaterials.map(item => item.name),
    datasets: [
      {
        label: 'Opening Balance',
        data: realtimeRawMaterials.map(item => item.openBalance),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Closing Balance',
        data: realtimeRawMaterials.map(item => item.closingBalance),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const inventoryDistributionData = {
    labels: [...Object.keys(rawMaterialsData)],
    datasets: [
      {
        label: 'Current Stock Levels',
        data: [...Object.values(rawMaterialsData)],
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
              <Card.Title>Total Raw Materials Value</Card.Title>
              <h3>₹{totalRawValue.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Finished Products Value</Card.Title>
              <h3>₹{totalFinishedValue.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Inventory Value</Card.Title>
              <h3>₹{(totalRawValue + totalFinishedValue).toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Stock Level Trends</Card.Title>
              <Line data={stockTrendData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Current Stock Distribution</Card.Title>
              <Bar data={inventoryDistributionData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default InventoryAnalytics;