import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';

const menuItems = [
  { label: 'Home', icon: 'pi pi-home', route: '/home' },
  { label: 'Pedidos', icon: 'pi pi-shopping-cart', route: '/pedidos' },
  { label: 'Configuración', icon: 'pi pi-cog', route: '/config' },
  { label: 'Cerrar sesión', icon: 'pi pi-sign-out', route: '/logout' },
];

const AppMenu: React.FC<{ selectedKey: string; onSelect: (key: string) => void }> = ({ selectedKey, onSelect }) => {
  const navigate = useNavigate();
  const op = useRef<OverlayPanel>(null);

  const handleClick = (item: typeof menuItems[0]) => {
    onSelect(item.label);
    op.current?.hide();
    if (item.route === '/logout') {
      alert('Sesión cerrada');
      return;
    }
    navigate(item.route);
  };

  return (
    <>
      {/* Botón azul único para abrir menú */}
      <Button
        label="Menú"
        icon="pi pi-bars"
        onClick={(e) => op.current?.toggle(e)}
        style={{ backgroundColor: '#007ad9', borderColor: '#007ad9' }}
        className="p-button"
      />

      {/* Panel flotante con opciones */}
      <OverlayPanel ref={op} >
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 150 }}>
          {menuItems.map((item) => (
            <Button
              key={item.label}
              label={item.label}
              icon={item.icon}
              onClick={() => handleClick(item)}
              className="p-button-text p-button-sm"
              style={{
                textAlign: 'left',
                justifyContent: 'flex-start',
                backgroundColor: selectedKey === item.label ? '#007ad9' : 'transparent',
                color: selectedKey === item.label ? 'white' : 'black',
                marginBottom: 4,
              }}
              iconPos="left"
            />
          ))}
        </div>
      </OverlayPanel>
    </>
  );
};

export default AppMenu;
