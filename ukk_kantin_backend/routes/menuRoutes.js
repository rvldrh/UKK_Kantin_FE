const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const multer = require("multer")
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../../ukk_kantin_frontend/public/img/menuImg");
  },
  filename: (req, file, cb) => {
    // biome-ignore lint/style/useTemplate: <explanation>
    const fileName = "menu-image-" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

router.get('/', menuController.getAllMenu);
router.get('/with-diskon', menuController.getMenuWithDiskon);
router.get('/stan/:stanId', menuController.getMenuByStan);

// Tambahkan middleware upload sebelum mengakses route
router.post('/', upload.single('foto'), menuController.createMenu);

module.exports = router;