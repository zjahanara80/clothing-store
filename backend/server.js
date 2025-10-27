const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const commentRoutes = require('./routes/comment');
const ticketRoutes = require('./routes/ticket');
const userRoutes = require('./routes/user');
const path = require('path');
const articleRoutes = require('./routes/article');
const uploadRoutes = require('./routes/upload');
const userFavoritesRoutes = require('./routes/userFavorites');
const campaignRoute = require('./routes/campaign');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const statsRoutes = require("./routes/stats");
const userCartRoutes = require('./routes/userCart'); 
dotenv.config();
connectDB();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/stats", statsRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
// app.use('/api/cart', require('./routes/cart'));
app.use('/api/discounts', require('./routes/discounts'));
app.use('/api/products', require('./routes/product'));
app.use('/api/comments', commentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static('/uploads'));
app.use('/api/articles', articleRoutes);
app.use('/', uploadRoutes);
app.use('/api/comment-articles', require('./routes/commentArticle'));
app.use('/api/user-favorites', userFavoritesRoutes);
app.use('/api/user/cart', userCartRoutes);
app.use('/api/campaign', campaignRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

