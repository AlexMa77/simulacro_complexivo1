import React, { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function VehiclesRentalsApp() {
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [total, setTotal] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resV, resR] = await Promise.all([
        fetch(`${API_BASE}/vehicles/`),
        fetch(`${API_BASE}/rentals/`)
      ]);

      if (!resV.ok || !resR.ok) throw new Error('Error al cargar datos del servidor');

      const dataV = await resV.json();
      const dataR = await resR.json();

      setVehicles(dataV.results || dataV);
      setRentals(dataR.results || dataR);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRental = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !customerName || !total) {
      alert('Por favor complete todos los campos.');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/rentals/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: parseInt(selectedVehicle),
          customer_name: customerName,
          total: parseFloat(total),
          status: 'RESERVED'
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(JSON.stringify(errData));
      }

      // Clear form and refresh list
      setCustomerName('');
      setTotal('');
      setSelectedVehicle('');
      await fetchData();
      alert('Alquiler creado exitosamente y evento registrado en Mongo!');
    } catch (err) {
      alert(`Error al crear alquiler: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Cargando catálogo de vehículos y alquileres...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <h2>Gestión de Alquiler de Vehículos (SQL - PostgreSQL)</h2>

      {/* Formular de Nuevo Alquiler */}
      <div style={{ background: '#f4f4f4', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h3>Registrar Nuevo Alquiler</h3>
        <form onSubmit={handleCreateRental} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select 
            value={selectedVehicle} 
            onChange={(e) => setSelectedVehicle(e.target.value)}
            required
            style={{ padding: 8 }}
          >
            <option value="">-- Seleccionar Vehículo --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} ({v.plate}) - ${v.daily_rate}/día
              </option>
            ))}
          </select>

          <input 
            type="text" 
            placeholder="Nombre del Cliente"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            style={{ padding: 8 }}
          />

          <input 
            type="number" 
            step="0.01"
            placeholder="Total ($)"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            required
            style={{ padding: 8 }}
          />

          <button type="submit" disabled={creating} style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
            {creating ? 'Guardando...' : 'Crear Alquiler'}
          </button>
        </form>
      </div>

      {/* Tabla de Vehículos */}
      <h3>Flota de Vehículos</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th>
            <th>Marca</th>
            <th>Placa</th>
            <th>Tarifa Diaria ($)</th>
            <th>Disponible</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.brand}</td>
              <td>{v.plate}</td>
              <td>${v.daily_rate}</td>
              <td>{v.is_available ? '✅ Sí' : '❌ No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla de Alquileres */}
      <h3>Lista de Alquileres</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th>
            <th>Vehículo ID</th>
            <th>Cliente</th>
            <th>Total ($)</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.vehicle}</td>
              <td>{r.customer_name}</td>
              <td>${r.total}</td>
              <td>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  color: '#fff',
                  background: r.status === 'ACTIVE' ? 'green' : r.status === 'RESERVED' ? 'orange' : 'gray'
                }}>
                  {r.status}
                </span>
              </td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
