const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../../public/img/menuImg');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    cb(null, `${file.originalname.split('.')[0]}_${uniqueSuffix}.${file.originalname.split('.').pop()}`);
  }
});

const upload = multer({ storage: storage });

module.exports = upload; // Tambahkan export hanya untuk upload