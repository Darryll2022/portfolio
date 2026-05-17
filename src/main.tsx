import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import Stars from './components/Stars';
import WorldMap from './pages/WorldMap';
import CharacterScreen from './pages/CharacterScreen';
import QuestPage from './pages/QuestPage';
import MidgarPage from './pages/MidgarPage';
import NeoGaiaQuest from './pages/NeoGaiaQuest';
import './styles/global.css';

// Gate the hidden world via ?world=darkness
function HomeGate() {
  const [params] = useSearchParams();
  return params.get('world') === 'darkness' ? <MidgarPage /> : <WorldMap />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/portfolio">
      <Stars />
      <Routes>
        <Route path="/" element={<HomeGate />} />
        <Route path="/character" element={<CharacterScreen />} />
        <Route path="/quest/neo-gaia" element={<NeoGaiaQuest />} />
        <Route path="/quest/:id" element={<QuestPage />} />
        <Route path="*" element={<WorldMap />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
