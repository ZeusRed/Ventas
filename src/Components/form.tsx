import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import MapSelector from "./MapSelector";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Taco", image: "/images/taco1.jpg", price: 35 },
  { id: 2, name: "Quesadilla", image: "/images/quesadilla.jpg", price: 35 },
  { id: 3, name: "Gordita", image: "/images/gordita.png", price: 30 },
];

type Step = "select" | "checkout";
const MAP_DEFAULT_POSITION = { lat: 19.4326, lng: -99.1332 }; // CDMX

// Componente custom para input con botones + / -
interface QuantityInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}
const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 99,
}) => {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (isNaN(val)) val = min;
    if (val < min) val = min;
    if (val > max) val = max;
    onChange(val);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Button
        icon="pi pi-minus"
        className="p-button-rounded p-button-primary"
        onClick={decrement}
        disabled={value <= min}
        style={{ width: 32, height: 32 }}
        aria-label="Disminuir cantidad"
      />
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        style={{
          width: 50,
          textAlign: "center",
          fontSize: 16,
          border: "1px solid #ccc",
          borderRadius: 4,
          height: 32,
        }}
        aria-label="Cantidad"
      />
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-primary"
        onClick={increment}
        disabled={value >= max}
        style={{ width: 32, height: 32 }}
        aria-label="Incrementar cantidad"
      />
    </div>
  );
};

const FormComponent: React.FC = () => {
  const [step, setStep] = useState<Step>("select");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addressDetail, setAddressDetail] = useState("");
  const [mapPosition, setMapPosition] = useState(MAP_DEFAULT_POSITION);

  const toggleProduct = (product: Product) => {
    const exists = selectedProducts.find((p) => p.id === product.id);
    if (exists) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
      const { [product.id]: _, ...rest } = quantities;
      setQuantities(rest);
    } else {
      setSelectedProducts([...selectedProducts, product]);
      setQuantities({ ...quantities, [product.id]: 1 });
    }
  };

  const handleQuantityChange = (id: number, val: number) => {
    if (val < 1) {
      // Si cantidad < 1, quitar producto
      setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
      const { [id]: _, ...rest } = quantities;
      setQuantities(rest);
    } else {
      setQuantities({ ...quantities, [id]: val });
    }
  };

  const total = selectedProducts.reduce(
    (acc, p) => acc + (quantities[p.id] || 0) * p.price,
    0
  );

  const sendOrder = () => {
    if (!addressDetail.trim()) {
      alert("Por favor ingresa el detalle de la dirección.");
      return;
    }

    const orderLines = selectedProducts
      .map((p) => `${p.name} x ${quantities[p.id] || 0}`)
      .join("\n");

    const locationUrl = `https://www.google.com/maps?q=${mapPosition.lat},${mapPosition.lng}`;
    const message = `Pedido:\n${orderLines}\n\nDirección: ${addressDetail}\nUbicación: ${locationUrl}\nTotal: $${total}`;

    const phoneNumber = "5215951062215";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn(
            "No se pudo obtener ubicación, usando CDMX por defecto",
            error
          );
        }
      );
    }
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      {step === "select" && (
        <>
          <h2 style={{ textAlign: "center" }}>Selecciona tus productos</h2>
          <div
            style={{
              display: "flex",
              gap: 15,
              overflowX: "auto",
              paddingBottom: 10,
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {PRODUCTS.map((product) => {
              const selected = selectedProducts.some((p) => p.id === product.id);
              return (
                <div
                  key={product.id}
                  style={{
                    flex: "0 0 auto",
                    scrollSnapAlign: "start",
                  }}
                >
                  <Card
                    title={product.name}
                    style={{
                      width: 200,
                      cursor: "pointer",
                      border: selected ? "3px solid #007ad9" : "1px solid #ccc",
                    }}
                    onClick={() => toggleProduct(product)}
                    aria-pressed={selected}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggleProduct(product);
                      }
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "100%", height: 120, objectFit: "cover" }}
                    />
                    <p
                      style={{
                        fontWeight: "bold",
                        marginTop: 10,
                        textAlign: "center",
                      }}
                    >
                      ${product.price}
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            <Button
              label="Siguiente"
              className="p-button-rounded p-button-primary"
              disabled={selectedProducts.length === 0}
              onClick={() => setStep("checkout")}
            />
          </div>
        </>
      )}

      {step === "checkout" && (
        <>
          <h2 style={{ textAlign: "center" }}>Detalles del pedido</h2>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 15,
                  gap: 15,
                  borderBottom: "1px solid #eee",
                  paddingBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{product.name}</p>
                  <p style={{ margin: 0 }}>${product.price}</p>
                </div>
                <QuantityInput
                  value={quantities[product.id] || 1}
                  onChange={(val) => handleQuantityChange(product.id, val)}
                  min={1}
                />
              </div>
            ))}

            <div style={{ margin: "20px 0" }}>
              <h4 style={{ textAlign: "center" }}>Ubicación aproximada</h4>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <MapSelector
                  position={mapPosition}
                  onPositionChange={setMapPosition}
                />
              </div>
              <p style={{ marginTop: 10, textAlign: "center" }}>
                Ubicación seleccionada: lat {mapPosition.lat.toFixed(4)}, lng{" "}
                {mapPosition.lng.toFixed(4)}
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ textAlign: "center" }}>Detalle de dirección</h4>
              <InputTextarea
                rows={3}
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="Ej. Calle, número, colonia, referencias..."
                style={{ width: "100%" }}
              />
            </div>

            <h3 style={{ textAlign: "center" }}>Total: ${total}</h3>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Button
                label="Enviar pedido por WhatsApp"
                className="p-button-success"
                onClick={sendOrder}
                disabled={total === 0}
              />

              <Button
                label="Regresar"
                className="p-button-secondary"
                onClick={() => setStep("select")}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FormComponent;
