import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequestPage from './pages/RequestPage';
import AgentConfirmPage from './pages/AgentConfirmPage';
import ProgressPage from './pages/ProgressPage';
import ResultPage from './pages/ResultPage';
import ComponentsPage from './pages/ComponentsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RequestPage />} />
        <Route path="/new/agents" element={<AgentConfirmPage />} />
        <Route path="/new/progress" element={<ProgressPage />} />
        <Route path="/new/result" element={<ResultPage />} />
      </Route>
      <Route path="/components" element={<ComponentsPage />} />
    </Routes>
  );
}

export default App;
