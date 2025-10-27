const mongoose = require('mongoose');
const Category = require('../models/Category');

exports.createCategoryWithImage = async (req, res) => {
  try {
    const { name, parent, link, icon, description } = req.body;

    const newCategory = new Category({
      name,
      link: link || '',
      icon: icon || '',
      description: description || '',
      background: req.file ? `/uploads/menus/${req.file.filename}` : '',
      parent: (parent && mongoose.Types.ObjectId.isValid(parent)) ? parent : null
    });

    await newCategory.save();

    res.status(201).json({
      message: 'منو با موفقیت ایجاد شد',
      category: newCategory
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ایجاد منو' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate({
      path: 'parent',
      select: 'name _id'
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // فیلدهای مجاز برای آپدیت
    const allowed = ['name', 'link', 'icon', 'description', 'parent'];
    const updates = {};

    for (const field of allowed) {
      const value = req.body[field];
      if (value != null && value !== '') {
        updates[field] = (typeof value === 'string') ? value.trim() : value;
      }
    }

    // اگر فایل تصویر جدید آپلود شد
    if (req.file) {
      updates.background = `/uploads/menus/${req.file.filename}`;
    }

    // اگر parent فرستاده نشه یا invalid باشه، null قرار بگیره
    if (updates.parent && !mongoose.Types.ObjectId.isValid(updates.parent)) {
      updates.parent = null;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'منو پیدا نشد' });
    }

    res.json({ message: 'منو با موفقیت ویرایش شد', category: updatedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ویرایش منو' });
  }
};
