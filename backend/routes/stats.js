const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const Article = require("../models/Article");
const authenticateToken = require("../middleware/authenticateToken");
const isAdmin = require("../middleware/isAdmin");

async function getStats(model) {
  const totalCount = await model.countDocuments();

  const now = new Date();

  // recent week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const countLastWeek = await model.countDocuments({
    createdAt: { $gte: oneWeekAgo }
  });

  // last week
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(now.getDate() - 14);

  const countWeekBefore = await model.countDocuments({
    createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
  });

  // grow percent calculator
  let growthRate = 0;
  if (countWeekBefore > 0) {
    growthRate = ((countLastWeek - countWeekBefore) / countWeekBefore) * 100;
  } else if (countLastWeek > 0) {
    growthRate = 100;
  }

  return {
    totalCount,
    countLastWeek,
    growthRate: Number(growthRate.toFixed(2))
  };
}

// the main route for all
router.get("/overview", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [productsStats, usersStats, articlesStats] = await Promise.all([
      getStats(Product),
      getStats(User),
      getStats(Article)
    ]);

    res.json({
      products: productsStats,
      users: usersStats,
      articles: articlesStats
    });
  } catch (err) {
    console.error("خطا در گرفتن آمار:", err);
    res.status(500).json({ error: "خطا در گرفتن آمار کلی" });
  }
});

module.exports = router;
