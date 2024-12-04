import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AvatarUploadModal = ({ isOpen, onClose, onSave }) => {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 100,
        aspect: 1
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = React.useRef(null);
    const previewCanvasRef = React.useRef(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleClose = () => {
        setImage(null);  // Réinitialise l'image
        setCrop({ unit: '%', width: 100, aspect: 1 });  // Réinitialise le crop
        setCompletedCrop(null);
        onClose();  // Appelle la fonction onClose du parent
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/jpg': []
        },
        maxSize: 5 * 1024 * 1024,
        multiple: false
    });

    // Générer la preview en temps réel
    useEffect(() => {
        if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = 100; // Taille fixe pour la preview
        canvas.height = 100;

        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, 2 * Math.PI);
        ctx.clip();

        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);

    const handleSave = useCallback(async () => {
        if (!completedCrop || !imgRef.current) return;

        const canvas = document.createElement('canvas');
        const crop = completedCrop;
        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(crop.width / 2, crop.height / 2, crop.width / 2, 0, 2 * Math.PI);
        ctx.clip();

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        canvas.toBlob((blob) => {
            if (!blob) return;
            const croppedFile = new File([blob], 'cropped-avatar.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now()
            });

            // Reset tous les états avant d'appeler onSave
            setImage(null);
            setCrop({ unit: '%', width: 100, aspect: 1 });
            setCompletedCrop(null);

            onSave(croppedFile);
        }, 'image/jpeg', 1);
    }, [completedCrop, onSave]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Modifier la photo de profil
                            </h3>
                            <button
                                onClick={onClose}
                                type="button"
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-400 hover:text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {!image ? (
                            <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <input {...getInputProps()} />
                                        <p className="pl-1">Glissez-déposez une image ici ou cliquez pour sélectionner</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP jusqu'à 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(c) => setCrop(c)}
                                            onComplete={(c) => setCompletedCrop(c)}
                                            aspect={1}
                                            circularCrop
                                        >
                                            <img
                                                ref={imgRef}
                                                src={image}
                                                alt="Crop me"
                                                className="max-h-[400px] w-auto"
                                            />
                                        </ReactCrop>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm text-gray-500 mb-2">Aperçu</p>
                                        <canvas
                                            ref={previewCanvasRef}
                                            className="rounded-full w-[100px] h-[100px]"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    Déplacez et redimensionnez le cercle pour ajuster votre photo
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {image && (
                            <button
                                type="button"
                                onClick={handleSave}
                                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Confirmer
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarUploadModal;