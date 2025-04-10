const express = require('express');
const router = express.Router();
const siswaController = require('../controllers/siswaController');

router.get('/', siswaController.getAllSiswa);
router.post('/', siswaController.createSiswa);
router.patch('/:id', siswaController.updateSiswa);
router.delete('/:id', siswaController.deleteSiswa);

module.exports = router; 