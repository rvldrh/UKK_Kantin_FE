const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const { authMiddleware, checkRole } = require('../middleware/auth');

router.get('/', authMiddleware, transaksiController.getAllTransaksi);
router.post('/', authMiddleware, checkRole('siswa'),transaksiController.createTransaksi);
router.patch('/:id/status', transaksiController.updateStatus); // Lihat semua menu


module.exports = router; 