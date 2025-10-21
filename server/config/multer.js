// server/config/multer.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Si usas CLOUDINARY_URL, esta config ya funciona igual; lo dejo explícito:
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

/** ---------- PDFs de Evaluaciones (campo: "documentos") ---------- **/
const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        if (file.mimetype !== "application/pdf") {
            throw new Error("Solo se permiten PDFs en evaluaciones.");
        }
        return {
            folder: "mi-app/evaluaciones", // cambia el prefijo si quieres
            resource_type: "raw",          // CLAVE para PDF/archivos
            format: "pdf",
            overwrite: false,
            public_id: `${Date.now()}-${file.fieldname}`,
        };
    },
});

/**
 * Exporta un middleware listo para usar en la ruta:
 * router.post("/evaluacion-compra", authMiddleware, uploadEvaluacion, crearEvaluacionCompra)
 * -> Sube hasta 2 PDFs en el campo "documentos" y deja URLs en req.files[].path
 */
export const uploadEvaluacion = multer({
    storage: pdfStorage,
    limits: { files: 2, fileSize: 5 * 1024 * 1024 }, // 2 archivos, 5MB c/u
}).array("documentos", 2);

/** ---------- (Opcional) Imágenes de Propiedad (campo: "imagenes") ---------- **/
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const valid = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!valid.includes(file.mimetype)) {
            throw new Error("Solo imágenes (jpg, png, webp).");
        }
        return {
            folder: "mi-app/imagenes",
            resource_type: "image",
            overwrite: false,
            transformation: [{ quality: "auto", fetch_format: "auto" }],
            public_id: `${Date.now()}-${file.fieldname}`,
        };
    },
});

/** Si más adelante quieres usarlo:
 export const uploadImagenes = multer({
 storage: imageStorage,
 limits: { files: 10, fileSize: 5 * 1024 * 1024 },
 }).array("imagenes", 10);
 */
export const multerErrors = (err, req, res, next) => {
    if (err && (err.name === "MulterError" || /Solo/.test(err.message))) {
        return res.status(400).json({ ok: false, msg: err.message });
    }
    next(err);
};