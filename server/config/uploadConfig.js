// config/uploadConfig.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Si usas CLOUDINARY_URL, con esto ya basta (pero lo pongo explícito también):
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,   // o usa solo CLOUDINARY_URL
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

/* ============ Storage para IMÁGENES ============ */
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        // Validación equivalente a tu fileFilter de imágenes
        if (!file.mimetype?.startsWith("image/")) {
            throw new Error("Solo se permiten archivos de imagen.");
        }
        return {
            folder: "mi-app/imagenes",            // cambia si quieres
            resource_type: "image",
            overwrite: false,
            // Opcional: optimización automática
            transformation: [{ quality: "auto", fetch_format: "auto" }],
            public_id: `${Date.now()}-${file.fieldname}`,
        };
    },
});

/* ============ Storage para PDFs (Evaluaciones) ============ */
const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        if (file.mimetype !== "application/pdf") {
            throw new Error("Solo se permiten PDFs en evaluaciones.");
        }
        return {
            folder: "mi-app/evaluaciones",
            resource_type: "raw",                 // CLAVE para PDF/archivos
            format: "pdf",
            overwrite: false,
            public_id: `${Date.now()}-${file.fieldname}`,
        };
    },
});

/* ============ Middlewares Multer ============ */
// Comportamiento por defecto (como tu 'upload' original) → imágenes
const uploadImages = multer({
    storage: imageStorage,
    limits: { files: 10, fileSize: 5 * 1024 * 1024 }, // 10 archivos, 5MB c/u
});

// Evaluaciones (PDFs)
export const uploadEvaluaciones = multer({
    storage: pdfStorage,
    limits: { files: 2, fileSize: 5 * 1024 * 1024 }, // máx 2 PDFs, 5MB c/u
});

// Export default para ser backward-compatible con tu código actual de imágenes
export default uploadImages;
