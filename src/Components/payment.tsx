import React, { useEffect } from "react";

interface PaymentComponentProps {
  setFormaPago: (value: string) => void;
  setMontoPago: (value: number) => void;
  total: number;
  formaPago: string;
  montoPago: string | number;
  setCambio: (value: number) => void;
  cambio: number;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  setFormaPago,
  setMontoPago,
  total,
  formaPago,
  montoPago,
  setCambio,
  cambio,
}) => {

  useEffect(() => {
    // Calcula el cambio automáticamente cuando cambia el montoPago
    const monto = Number(montoPago);
    if (!isNaN(monto)) {
      const nuevoCambio = parseFloat((monto - total).toFixed(2));
      setCambio(nuevoCambio);
    } else {
      setCambio(0);
    }
  }, [montoPago, total, setCambio]);

  return (
    <>
      {formaPago === "efectivo" && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ textAlign: "center" }}>Monto recibido</h4>
          <input
            type="number"
            value={montoPago === 0 ? "" : montoPago}
            onChange={(e) => {
              const value = e.target.value;
              setMontoPago(value === "" ? 0 : Number(value));
            }}
            placeholder="El monto recibido se calculará automáticamente"
            style={{
              width: "100%",
              padding: 8,
              boxSizing: "border-box",
              height: 40,
              borderRadius: 5,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ textAlign: "center" }}>Cambio</h4>
            <input
              type="number"
              name="cambio"
              value={isNaN(cambio) ? "" : cambio.toFixed(2)}
              disabled
              placeholder="El cambio se calculará automáticamente"
              style={{
                width: "100%",
                padding: 8,
                boxSizing: "border-box",
                height: 40,
                borderRadius: 5,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentComponent;
