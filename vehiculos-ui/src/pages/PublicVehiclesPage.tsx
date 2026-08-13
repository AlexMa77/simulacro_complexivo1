import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { type Vehiculo, listVehiculosPublicApi } from "../api/vehiculos.api";

export default function PublicVehiclesPage() {
  const [items, setItems] = useState<Vehiculo[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listVehiculosPublicApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError(" ");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Lista de Vehículos (Público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Color</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.marca_nombre ?? v.marca}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>{v.anio}</TableCell>
                <TableCell>{v.placa}</TableCell>
                <TableCell>{v.color || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
