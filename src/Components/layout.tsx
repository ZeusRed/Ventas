import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/home';
 import AppMenu from '../Components/AppMenu';

const MainContent: React.FC = () => (
  <div style={{ flex: 1, padding: 20 }}>
    <Routes>
      <Route
        path="/"
        element={
         <Home />
        }
      />
      <Route path="/home" element={<Home />} />
      <Route path="/pedidos" element={<div><h2>Pedidos</h2><p>Sección Pedidos</p></div>} />
      <Route path="/config" element={<div><h2>Configuración</h2><p>Sección Configuración</p></div>} />
      <Route path="/logout" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);

const AppLayout: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('Home');

  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Contenedor del botón menú arriba izquierda */}
        <div style={{ padding: 10, display: 'flex', justifyContent: 'flex-start' }}>
          <AppMenu selectedKey={selectedMenu} onSelect={setSelectedMenu} />
        </div>

        {/* Contenido principal que ocupa el resto */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <MainContent />
        </div>
      </div>
    </Router>
  );
};

export default AppLayout;
