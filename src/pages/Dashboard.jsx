import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import { MoreVert, TrendingUp, TrendingDown } from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveRadar } from '@nivo/radar';

export default function Dashboard() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    // Simulated real-time data updates
    const interval = setInterval(() => {
      updateSalesData();
      updateInventoryData();
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const updateSalesData = () => {
    // Simulated sales data with random variations
    const data = [
      {
        id: 'Sales',
        data: Array.from({ length: 7 }, (_, i) => ({
          x: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          y: Math.floor(Math.random() * 20000) + 30000
        }))
      }
    ];
    setSalesData(data);
  };

  const updateInventoryData = () => {
    // Simulated inventory data
    setInventoryData([
      { name: 'Raw Pulses', value: Math.floor(Math.random() * 200) + 400 },
      { name: 'Processed Pulses', value: Math.floor(Math.random() * 100) + 200 },
      { name: 'Raw Turmeric', value: Math.floor(Math.random() * 100) + 100 },
      { name: 'Processed Turmeric', value: Math.floor(Math.random() * 50) + 100 }
    ]);
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    handleMenuClose();
  };

  const metrics = [
    { title: 'Total Revenue', value: '₹1,23,45,000', trend: 12.5, isPositive: true },
    { title: 'Total Orders', value: '1,234', trend: 8.2, isPositive: true },
    { title: 'Inventory Value', value: '₹45,67,000', trend: -3.4, isPositive: false },
    { title: 'Profit Margin', value: '32.5%', trend: 5.7, isPositive: true }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Analytics Dashboard</Typography>
        <Box>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleTimeRangeChange('day')}>Today</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('week')}>This Week</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('month')}>This Month</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>{metric.title}</Typography>
                <Typography variant="h4" sx={{ mb: 2 }}>{metric.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {metric.isPositive ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      color: metric.isPositive ? theme.palette.success.main : theme.palette.error.main
                    }}
                  >
                    {metric.trend}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Revenue Trend</Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveLine
                  data={salesData}
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  curve="cardinal"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: value => `₹${(value / 1000).toFixed(0)}k`
                  }}
                  enablePoints={false}
                  enableGridX={false}
                  enableArea={true}
                  areaOpacity={0.1}
                  colors={[theme.palette.primary.main]}
                  theme={{
                    axis: { ticks: { text: { fill: theme.palette.text.secondary } } },
                    grid: { line: { stroke: theme.palette.divider } }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Inventory Distribution</Typography>
              <Box sx={{ height: 350 }}>
                <ResponsivePie
                  data={inventoryData.map(item => ({
                    id: item.name,
                    label: item.name,
                    value: item.value
                  }))}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  innerRadius={0.6}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: 'nivo' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  enableArcLinkLabels={false}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}