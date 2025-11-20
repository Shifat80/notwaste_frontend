import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const scrollY = useRef(new Animated.Value(0)).current;

  const categoryTranslate = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -70],
    extrapolate: "clamp",
  });

  const categories = [
    { name: "All", icon: "apps-outline" },
    { name: "Furniture", icon: "bed-outline" },
    { name: "Electronics", icon: "tv-outline" },
    { name: "Clothing", icon: "shirt-outline" },
    { name: "Books", icon: "book-outline" },
    { name: "Home Decor", icon: "home-outline" },
    { name: "Toys", icon: "game-controller-outline" },
    { name: "Appliances", icon: "calculator-outline" },
  ];

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const filters: any = {
        page: 1,
        limit: 100, // Get more products for demo
        status: 'available',
      };

      if (selectedCategory !== "All") {
        filters.category = selectedCategory;
      }

      if (searchQuery) {
        filters.search = searchQuery;
      }

      const response = await productService.getProducts(filters);

      if (response.success) {
        setProducts(response.products);
      } else {
        setError("Failed to load products");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const renderProduct = ({ item }: { item: Product }) => {
    const isFree = item.price === 0;
    const displayPrice = isFree ? "Free" : `$${item.price.toFixed(2)}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/marketplace/${item._id}`)}
      >
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        {isFree && (
          <View style={styles.freeTag}>
            <Text style={styles.freeText}>Free</Text>
          </View>
        )}
        <Text style={styles.name}>{item.title}</Text>
        <Text
          style={[
            styles.price,
            isFree && { color: "#F6A700", fontWeight: "700" },
          ]}
        >
          {displayPrice}
        </Text>
        <Text style={styles.location}>{item.location}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={{ marginHorizontal: 8 }} />
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color="#999"
                style={{ marginHorizontal: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Animated Categories */}
      <Animated.View
        style={{
          transform: [{ translateY: categoryTranslate }],
          zIndex: 10,
          backgroundColor: "#fff",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                style={[styles.categoryButton, isActive && styles.activeCategory]}
                onPress={() => setSelectedCategory(cat.name)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={18}
                  color={isActive ? "#fff" : "#00C853"}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Loading / Error / Products */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00E676" />
          <Text style={{ marginTop: 10, color: "#666" }}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cube-outline" size={64} color="#ccc" />
          <Text style={{ marginTop: 10, color: "#666", fontSize: 16 }}>
            No products found
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 15, paddingTop: 5 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 10 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", borderRadius: 25, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10 },
  searchInput: { flex: 1, height: 40, fontSize: 14, color: "#333" },
  categoryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", borderRadius: 25, paddingVertical: 12, paddingHorizontal: 14, marginRight: 10, borderWidth: 1, borderColor: "#e0e0e0" },
  activeCategory: { backgroundColor: "#00E676", borderColor: "#00E676" },
  categoryText: { color: "#333", fontWeight: "500", fontSize: 14 },
  activeCategoryText: { color: "#fff" },
  card: { width: "48%", backgroundColor: "#fff", borderRadius: 16, marginBottom: 20, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 3, marginHorizontal: "1%" },
  image: { width: "100%", height: 160 },
  freeTag: { position: "absolute", top: 10, left: 10, backgroundColor: "#F6C700", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  freeText: { color: "#000", fontSize: 12, fontWeight: "600" },
  name: { fontWeight: "600", fontSize: 16, marginTop: 8, marginLeft: 10 },
  price: { color: "#000", marginLeft: 10, fontWeight: "500", marginTop: 4 },
  location: { color: "gray", marginLeft: 10, marginBottom: 10, fontSize: 12 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#00E676",
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