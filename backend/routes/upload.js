
// const multer = require('multer');
// const express = require('express');
// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/articles');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.originalname.split('.').pop();
//     cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
//   }
// });

// const upload = multer({ storage });

// router.post('/uploads/articles', upload.single('upload'), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'فایل دریافت نشد' });

//   const imageUrl = `http://localhost:5000/uploads/articles/${req.file.filename}`;
//   res.status(201).json({ url: imageUrl });
// });


// module.exports = router;

const multer = require('multer');
const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/articles');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const upload = multer({ storage });

// فقط مسیر articles رو بذار، نه /uploads/articles
router.post('/articles', upload.single('upload'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'فایل دریافت نشد' });

  const imageUrl = `http://localhost:5000/uploads/articles/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
});

module.exports = router;
