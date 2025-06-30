// config/uploadConfig.js
import multer from "multer";
import path from "path";

// Carpeta donde se guardarán las imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // asegúrate de crear esta carpeta
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos de imagen."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { files: 10 } // máximo 10 archivos
});

export default upload;
