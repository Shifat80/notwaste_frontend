import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ordering, setOrdering] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string') {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        const response = await productService.getProduct(id);
        if (response.success) {
          setProduct(response.product);
        } else {
          setError("Product not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuy = async () => {
    if (!product) return;

    Alert.alert(
      "Confirm Purchase",
      `Do you want to order "${product.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setOrdering(true);
            try {
              const orderData = {
                productId: product._id,
                quantity: 1,
                buyerMessage: "I'm interested in this item",
                paymentMethod: "cash_on_pickup",
              };

              const response = await orderService.createOrder(orderData);

              if (response.success) {
                Alert.alert(
                  "Success",
                  "Order created successfully! The seller will be notified.",
                  [
                    {
                      text: "View Orders",
                      onPress: () => router.push("/purchase")
                    }
                  ]
                );
              } else {
                Alert.alert("Error", response.message || "Failed to create order");
              }
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to create order");
            } finally {
              setOrdering(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00E676" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading product...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFree = product.price === 0;
  const displayPrice = isFree ? "Free" : `$${product.price.toFixed(2)}`;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUri }} style={styles.image} />

      {isFree && (
        <View style={styles.freeTag}>
          <Text style={styles.freeTagText}>FREE</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{displayPrice}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.location}>{product.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="pricetag-outline" size={18} color="#666" />
          <Text style={styles.category}>{product.category}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#00C853" />
          <Text style={styles.status}>{product.status.toUpperCase()}</Text>
        </View>

        {product.sellerName && (
          <View style={styles.sellerSection}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <Text style={styles.sellerName}>{product.sellerName}</Text>
            {product.sellerEmail && (
              <Text style={styles.sellerEmail}>{product.sellerEmail}</Text>
            )}
          </View>
        )}

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description || "No description available."}
          </Text>
        </View>

        {/* Buy Button - Only show if product is available */}
        {product.status === 'available' && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleBuy}
            style={styles.buyButtonWrapper}
            disabled={ordering}
          >
            <LinearGradient
              colors={["#00E676", "#00BFA5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyButton}
            >
              {ordering ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buyButtonText}>Order Now</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {product.status === 'pending' && (
          <View style={styles.statusBanner}>
            <Text style={styles.statusBannerText}>This item is pending</Text>
          </View>
        )}

        {product.status === 'sold' && (
          <View style={[styles.statusBanner, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.statusBannerText}>This item is sold</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  content: { padding: 15 },
  image: { width: "100%", height: 300, backgroundColor: "#e0e0e0" },
  freeTag: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#F6C700",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  freeTagText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  title: { fontSize: 24, fontWeight: "700", marginTop: 10, color: "#333" },
  price: { fontSize: 28, fontWeight: "700", color: "#00C853", marginTop: 8 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  location: { fontSize: 16, color: "#666", marginLeft: 8 },
  category: { fontSize: 16, color: "#666", marginLeft: 8 },
  status: { fontSize: 14, color: "#00C853", marginLeft: 8, fontWeight: "600" },
  sellerSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#00E676",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sellerName: { fontSize: 16, color: "#333", fontWeight: "500" },
  sellerEmail: { fontSize: 14, color: "#666", marginTop: 4 },
  descriptionSection: {
    marginTop: 20,
  },
  description: { fontSize: 16, color: "#555", lineHeight: 24, marginTop: 8 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    marginTop: 15,
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#00E676",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buyButtonWrapper: { marginTop: 30, marginBottom: 30 },
  buyButton: {
    paddingVertical: 16,
    borderRadius: 35,
    alignItems: "center",
    shadowColor: "#00E676",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  buyButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  statusBanner: {
    marginTop: 20,
    backgroundColor: "#F59E0B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statusBannerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
