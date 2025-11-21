import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  const { user, logout, checkAuth, loading: authLoading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Refresh user data when screen is focused
    // Don't clear user state on error to avoid logging out
    checkAuth(false);
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
              router.replace("/start");
            } catch (error) {
              console.error("Logout error:", error);
            } finally {
              setLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "This feature will be connected to the API in the future",
      [{ text: "OK" }]
    );
  };

  // If loading, show loading state
  if (authLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading profile...</Text>
      </View>
    );
  }

  // If not authenticated, show login prompt
  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ fontSize: 18, color: "#666", marginBottom: 20, textAlign: "center" }}>
          You need to login to view your profile
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.avatar || "https://i.pravatar.cc/200" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/marketplace")}
      >
        <Text style={styles.buttonText}>Go to Marketplace</Text>
      </TouchableOpacity>

      {/* Purchase History */}
      <TouchableOpacity
        style={styles.button_purchase}
        onPress={() => router.push("/purchase")}
      >
        <Text style={styles.buttonText}>Order History</Text>
      </TouchableOpacity>

      {/* Change Password */}
      <TouchableOpacity
        style={styles.button_purchase}
        onPress={handleChangePassword}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="#EF4444" style={{ marginTop: 20 }} />
        ) : (
          <Text style={styles.logout}>Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#10b981",
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1B5E20",
  },
  email: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 30,
  },
  button_purchase: {
    width: "80%",
    backgroundColor: "#b97810ff",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  button: {
    width: "80%",
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  logout: {
    color: "#EF4444",
    marginTop: 20,
    fontWeight: "600",
    fontSize: 16,
  },
});