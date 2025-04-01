import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'
import Layout from './components/Layout'
import Inventory from './pages/Inventory'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/employees" element={<div>Employees Coming Soon</div>} />
            <Route path="/sales" element={<div>Sales Coming Soon</div>} />
            <Route path="/expenses" element={<div>Expenses Coming Soon</div>} />
            <Route path="/reports" element={<div>Reports Coming Soon</div>} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
