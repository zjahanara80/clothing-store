
const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const authenticateToken = require('../middleware/authenticateToken');


router.post('/', authenticateToken, async (req, res) => {
  try {
    const { discountPercent, startDate, endDate } = req.body;

    if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
      return res.status(400).json({ error: 'درصد تخفیف واردشده معتبر نیست.' });
    }

    const campaign = await Campaign.findOneAndUpdate(
      {},
      {
        discountPercent,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive: true,
        isGlobal: true,
      },
      { new: true, upsert: true }
    );

    res.json({ message: 'کمپین سراسری اعمال شد', campaign });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/current', async (req, res) => {
  try {
    const camp = await Campaign.findOne({ isActive: true }).select('discountPercent startDate endDate isActive');
    if (!camp) {
      return res.status(404).json({ message: 'کمپینی فعال نیست' });
    }
    res.json({
      discountPercent: camp.discountPercent,
      startDate: camp.startDate,
      endDate: camp.endDate,
      isActive: camp.isActive
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().select('discountPercent startDate endDate isActive');
    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ message: 'کمپینی وجود ندارد.' });
    }
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Campaign.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'کمپین یافت نشد.' });
    }
    res.json({ message: 'کمپین با موفقیت حذف شد.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

