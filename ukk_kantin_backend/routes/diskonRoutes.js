const express = require('express');
const router = express.Router();
const diskonController = require('../controllers/diskonController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('admin_stan'));

router.post('/', protect, restrictTo('admin_stan'), diskonController.createDiskon);
router.get('/', diskonController.getDiskonStan);
router.patch('/:id', protect, restrictTo('admin_stan'),diskonController.updateDiskon);
router.delete('/:id', protect, restrictTo('admin_stan'),diskonController.deleteDiskon);

module.exports = router; 