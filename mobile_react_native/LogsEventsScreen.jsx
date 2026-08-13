import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

const API_BASE = 'http://10.0.2.2:8000/api'; // O http://127.0.0.1:8000/api para emulador/dispositivo

export default function LogsEventsScreen() {
  const [activeTab, setActiveTab] = useState('events'); // 'events' o 'fleet'
  const [events, setEvents] = useState([]);
  const [fleetLogs, setFleetLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogsAndEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resE, resF] = await Promise.all([
        fetch(`${API_BASE}/rental-events/`),
        fetch(`${API_BASE}/fleet-logs/`)
      ]);

      if (!resE.ok || !resF.ok) throw new Error('Error al conectar con la API Mongo backend');

      const dataE = await resE.json();
      const dataF = await resF.json();

      setEvents(dataE);
      setFleetLogs(dataF);
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bitácora Operativa (MongoDB)</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Eventos Alquiler ({events.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'fleet' && styles.activeTab]}
          onPress={() => setActiveTab('fleet')}
        >
          <Text style={[styles.tabText, activeTab === 'fleet' && styles.activeTabText]}>
            Cambios Flota ({fleetLogs.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* State Handlers */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10 }}>Cargando datos NoSQL...</Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchLogsAndEvents}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lists */}
      {!loading && !error && activeTab === 'events' && (
        <FlatList
          data={events}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.badge}>Rental ID: #{item.rental_id}</Text>
                <Text style={styles.eventType}>{item.event_type}</Text>
              </View>
              <Text style={styles.note}>{item.note || 'Sin nota'}</Text>
              <Text style={styles.meta}>Origen: {item.source} | {new Date(item.created_at).toLocaleString()}</Text>
            </View>
          )}
        />
      )}

      {!loading && !error && activeTab === 'fleet' && (
        <FlatList
          data={fleetLogs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.badge}>Vehicle ID: #{item.vehicle_id}</Text>
                <Text style={styles.actionType}>{item.action}</Text>
              </View>
              <Text style={styles.note}>{item.note || 'Sin nota'}</Text>
              <Text style={styles.meta}>Origen: {item.source} | {new Date(item.created_at).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 12, color: '#333' },
  tabContainer: { flexDirection: 'row', marginBottom: 16, borderRadius: 8, overflow: 'hidden', backgroundColor: '#e9ecef' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { backgroundColor: '#007bff' },
  tabText: { fontWeight: '600', color: '#495057' },
  activeTabText: { color: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#dc3545', fontSize: 16, marginBottom: 12, textAlign: 'center' },
  retryBtn: { backgroundColor: '#007bff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  card: { backgroundColor: '#ffffff', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#dee2e6' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  badge: { fontWeight: 'bold', color: '#343a40' },
  eventType: { color: '#28a745', fontWeight: 'bold' },
  actionType: { color: '#fd7e14', fontWeight: 'bold' },
  note: { fontSize: 14, color: '#495057', marginBottom: 6 },
  meta: { fontSize: 12, color: '#6c757d' }
});
