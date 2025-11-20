import api from './api';

export const uploadService = {
    /**
     * Upload image to server
     * @param imageUri - Local file URI from image picker
     * @returns Image URL from server
     */
    uploadImage: async (imageUri: string): Promise<string> => {
        // Create FormData
        const formData = new FormData();

        // Extract filename from URI
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Append file to form data
        // @ts-ignore - React Native FormData accepts this format
        formData.append('image', {
            uri: imageUri,
            name: filename,
            type,
        });

        const response = await api.post<{ success: boolean; imageUrl: string }>(
            '/upload/image',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.data.success) {
            return response.data.imageUrl;
        } else {
            throw new Error('Image upload failed');
        }
    },
};
