const User = require('../models/User');
const bcrypt = require('bcrypt');


const createUser = async (req, res) => {
  try {
    const { name, username, email, phone, password, isAdmin } = req.body;

    // بررسی عدم وجود کاربر تکراری
    const existingUser = await User.findOne({ $or: [ { email }, { username } ] });
    if (existingUser) {
      return res.status(400).json({ error: 'کاربری با این ایمیل یا نام کاربری وجود دارد.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      isAdmin: Boolean(isAdmin)
    });

    await newUser.save();

    res.status(201).json({ message: 'کاربر با موفقیت ایجاد شد', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در ایجاد کاربر' });
  }
};

// حذف کاربر
const deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }

    res.status(200).json({ message: 'کاربر با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطا در حذف کاربر' });
  }
};

// بن کردن یا آزاد کردن کاربر
async function toggleBanUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: `کاربر ${user.isBanned ? 'بن شد' : 'از بن خارج شد'}` });
  } catch (err) {
    res.status(500).json({ error: 'خطا در تغییر وضعیت بن' });
  }
}

async function updateUserByAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['name', 'username', 'email', 'phone', 'isAdmin'];
    const updates = {};

    for (const field of allowed) {
      const value = req.body[field];
      if (value != null && value !== '') {
        updates[field] = (typeof value === 'string') ? value.trim() : value;
      }
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updated) return res.status(404).json({ error: 'کاربر یافت نشد' });

    res.json({ message: 'اطلاعات کاربر با موفقیت بروز شد', user: updated });
  } catch (err) {
    next(err);
  }
}

// async function updateUserByAdmin (req, res, next){
//   try {
//     const { id } = req.params;
//     const allowed = ['name', 'username', 'email', 'phone', 'isAdmin'];
//     const updates = {};

//     for (const field of allowed) {
//       if (req.body[field] != null && req.body[field].trim() !== '') {
//         updates[field] = req.body[field].trim();
//       }
//     }

//     const updated = await User.findByIdAndUpdate(
//       id,
//       { $set: updates },
//       { new: true, runValidators: true, select: '-password' }
//     );
//     if (!updated) return res.status(404).json({ error: 'کاربر یافت نشد' });

//     res.json({ message: 'اطلاعات کاربر با موفقیت بروز شد', user: updated });
//   } catch (err) {
//     next(err);
//   }
// };

// async function updateMe (req, res, next){
//   try {
//     const allowed = ['name', 'username', 'email', 'phone', 'password'];
//     const updates = {};

//     for (const field of allowed) {
//       if (req.body[field] != null && req.body[field].trim() !== '') {
//         updates[field] = req.body[field].trim();
//       }
//     }

//     if (updates.password) {
//       const salt = await bcrypt.genSalt(10);
//       updates.password = await bcrypt.hash(updates.password, salt);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: updates },
//       { new: true, runValidators: true, select: '-password' }
//     );

//     res.json({ message: 'پروفایل شما بروزرسانی شد', user: updatedUser });
//   } catch (err) {
//     next(err);
//   }
// };

// async function updateMe(req, res, next) {
//   try {
//     const allowed = ['name', 'username', 'email', 'phone', 'password'];
//     const updates = {};

//     for (const field of allowed) {
//       const value = req.body[field];
//       if (value != null && value !== '') {
//         updates[field] = (typeof value === 'string') ? value.trim() : value;
//       }
//     }

//     if (updates.password) {
//       const salt = await bcrypt.genSalt(10);
//       updates.password = await bcrypt.hash(updates.password, salt);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: updates },
//       { new: true, runValidators: true, select: '-password' }
//     );

//     res.json({ message: 'پروفایل شما بروزرسانی شد', user: updatedUser });
//   } catch (err) {
//     next(err);
//   }
// }

async function updateMe(req, res, next) {
  try {
    const allowed = [
      'name',
      'username',
      'email',
      'phone',
      'password',
      'address',
      'postalCode'
    ];
    const updates = {};

    for (const field of allowed) {
      const value = req.body[field];
      if (value != null && value !== '') {
        updates[field] = (typeof value === 'string') ? value.trim() : value;
      }
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true, select: '-password' }
    );

    res.json({ message: 'اطلاعات شما بروزرسانی شد', user: updatedUser });
  } catch (err) {
    next(err);
  }
}



module.exports = {
  deleteUser,
  toggleBanUser,
  createUser,
  updateUserByAdmin,
  updateMe
};
