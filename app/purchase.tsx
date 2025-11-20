import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Status Icon and Color Helper ---
const getStatusDetails = (status: Order['status']): { iconName: string, color: string } => {
  switch (status) {
    case 'delivered':
      return { iconName: 'check-circle', color: '#10b981' };
    case 'shipped':
      return { iconName: 'truck', color: '#F59E0B' };
    case 'cancelled':
      return { iconName: 'times-circle', color: '#EF4444' };
    case 'pending':
    default:
      return { iconName: 'clock-o', color: '#9CA3AF' };
  }
};

// --- Order Card Component ---
const OrderCard = ({ order }: { order: Order }) => {
  const { iconName, color: statusColor } = getStatusDetails(order.status);
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.orderId}>Order #{order.orderNumber}</Text>
        <Text style={styles.orderDate}>
          {new Date(order.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <View style={styles.statusBadge}>
          <FontAwesome name={iconName as any} size={16} color={statusColor} style={{ marginRight: 5 }} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
        <Text style={styles.totalText}>${order.totalAmount.toFixed(2)}</Text>
      </View>

      {order.productName && (
        <Text style={styles.productName}>{order.productName}</Text>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.itemCount}>{order.quantity || 1} item(s)</Text>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            // You could navigate to order details if needed
            console.log('View order details:', order._id);
          }}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


// --- Main Component ---
export default function Purchase() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await orderService.getOrderHistory({ limit: 50 });

      if (response.success) {
        setOrders(response.orders);
      } else {
        setError("Failed to load orders");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Purchase History' }} />
      <Text style={styles.pageTitle}>Your Orders</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#047857" />
          <Text style={{ marginTop: 10, color: "#666" }}>Loading orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchOrders} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <FontAwesome name="shopping-bag" size={64} color="#ccc" />
          <Text style={{ marginTop: 15, color: "#666", fontSize: 16 }}>
            No orders yet
          </Text>
          <Text style={{ marginTop: 5, color: "#999", fontSize: 14 }}>
            Start shopping to see your orders here
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFF4',
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#047857',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#047857',
  },
  productName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  itemCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#D1FAE5',
    borderRadius: 20,
  },
  detailsButtonText: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#047857",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});