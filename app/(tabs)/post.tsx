import { productService } from '@/services/productService';
import { uploadService } from '@/services/uploadService';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

// Define the initial shape of the form values
interface PostValues {
  name: string;
  title: string;
  description: string;
  status: 'available' | 'pending' | 'sold';
  price: string;
  location: string;
  category: string;
  imageUri: string | null;
}

// Define the validation schema using Yup
const PostSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  price: Yup.number().min(0, 'Must be 0 or positive').required('Required'),
  location: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  imageUri: Yup.string().nullable().required('An image is required'),
});


export default function PostWasteItemScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialValues: PostValues = {
    name: '',
    title: '',
    description: '',
    status: 'available',
    price: '0',
    location: '',
    category: 'Furniture',
    imageUri: null,
  };

  // --- Image Picker Functionality ---
  const pickImage = async (setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll permissions are needed to upload images.');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFieldValue('imageUri', result.assets[0].uri);
    }
  };

  // --- Submission Handler ---
  const handleSubmit = async (values: PostValues) => {
    setLoading(true);
    try {
      // 1. Upload image if it's a local URI
      let imageUrl = values.imageUri;
      if (imageUrl && imageUrl.startsWith('file://')) {
        try {
          imageUrl = await uploadService.uploadImage(imageUrl);
        } catch (uploadError) {
          Alert.alert('Upload Error', 'Failed to upload image. Using URL as-is.');
        }
      }

      // 2. Create product
      const productData = {
        title: values.title,
        description: values.description,
        price: parseFloat(values.price),
        location: values.location,
        status: values.status,
        category: values.category,
        imageUri: imageUrl || '',
        name: values.name || undefined, // Optional seller name
      };

      const response = await productService.createProduct(productData);

      if (response.success) {
        Alert.alert('Success', 'Product posted successfully!');
        router.replace('/(tabs)/marketplace');
      } else {
        Alert.alert('Error', response.message || 'Failed to post product');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to post product');
      console.error('Post error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.header}>Post Waste Item ♻️</Text>
        <Formik
          initialValues={initialValues}
          validationSchema={PostSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <ScrollView contentContainerStyle={styles.scrollContent}>

              {/* Image Field */}
              <Text style={styles.label}>Image *</Text>
              {values.imageUri && (
                <Image source={{ uri: values.imageUri }} style={styles.imagePreview} />
              )}
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => pickImage(setFieldValue)}
              >
                <Text style={styles.imageButtonText}>
                  {values.imageUri ? 'Change Image' : 'Pick Image'}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('imageUri')}
                onBlur={handleBlur('imageUri')}
                value={values.imageUri || ''}
                placeholder="Or enter image URL"
              />
              {errors.imageUri && touched.imageUri && <Text style={styles.errorText}>{errors.imageUri}</Text>}

              {/* Seller Name Field (Optional) */}
              <Text style={styles.label}>Your Name (Optional)</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Your Name"
              />

              {/* Title Field */}
              <Text style={styles.label}>Item Title *</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                placeholder="e.g., Used Cardboard Boxes (10kg)"
              />
              {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}

              {/* Description Field */}
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="Detail the item's condition and quantity"
                multiline
                numberOfLines={4}
              />
              {errors.description && touched.description && <Text style={styles.errorText}>{errors.description}</Text>}

              {/* Category Field */}
              <Text style={styles.label}>Category *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.category}
                  onValueChange={(itemValue) => setFieldValue('category', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Furniture" value="Furniture" />
                  <Picker.Item label="Electronics" value="Electronics" />
                  <Picker.Item label="Clothing" value="Clothing" />
                  <Picker.Item label="Books" value="Books" />
                  <Picker.Item label="Home Decor" value="Home Decor" />
                  <Picker.Item label="Toys" value="Toys" />
                  <Picker.Item label="Appliances" value="Appliances" />
                </Picker>
              </View>

              {/* Price Field */}
              <Text style={styles.label}>Price ($) * (Enter 0 for free)</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                value={values.price}
                placeholder="e.g., 5.00 or 0 for free"
                keyboardType="numeric"
              />
              {errors.price && touched.price && <Text style={styles.errorText}>Must be a valid number (0 or positive).</Text>}

              {/* Location Field */}
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
                value={values.location}
                placeholder="City, Neighborhood, or specific pickup area"
              />
              {errors.location && touched.location && <Text style={styles.errorText}>{errors.location}</Text>}

              {/* Status Field (Picker) */}
              <Text style={styles.label}>Status *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.status}
                  onValueChange={(itemValue) => setFieldValue('status', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Available" value="available" />
                  <Picker.Item label="Pending" value="pending" />
                  <Picker.Item label="Sold" value="sold" />
                </Picker>
              </View>

              {/* Submission Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Post Item</Text>
                )}
              </TouchableOpacity>

              <View style={{ height: 50 }} />
            </ScrollView>
          )}
        </Formik>
      </View>
    </SafeAreaView>

  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#125e17',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#125e17',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
    marginBottom: 5,
  },
});