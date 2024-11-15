import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ImageDropzone = ({ onImageUpload, initialImage, token }) => {
    const [preview, setPreview] = useState(initialImage || null);
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Créer une prévisualisation
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
            onImageUpload(data.imagePath);
        } catch (error) {
            console.error('Erreur upload:', error);
            alert("Erreur lors de l'upload de l'image");
        } finally {
            setUploading(false);
        }
    }, [token, onImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1
    });

    return (
        <div className="mt-2">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}
        `}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <div className="text-sm text-gray-600">
                        Upload en cours...
                        <div className="mt-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mx-auto"></div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {preview ? (
                            <div className="space-y-2">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                                />
                                <p className="text-sm text-gray-500">
                                    Cliquez ou glissez une nouvelle image pour changer
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="mx-auto h-12 w-12 text-gray-400">
                                    <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Glissez une image ici ou cliquez pour sélectionner
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageDropzone;