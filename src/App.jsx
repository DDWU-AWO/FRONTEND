import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequestPage from './pages/RequestPage';
import AgentConfirmPage from './pages/AgentConfirmPage';
import ComponentsPage from './pages/ComponentsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RequestPage />} />
        <Route path="/new/agents" element={<AgentConfirmPage />} />
      </Route>
      <Route path="/components" element={<ComponentsPage />} />
    </Routes>
  );
}

export default App;
