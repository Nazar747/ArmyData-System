const User = require("../models/user");
const Fighter = require("../models/fighter");

const register = async (req, res) => {
  try {
    const { lastName, firstName, middleName, email, password } = req.body;

    if (!lastName || !firstName || !middleName || !email || !password) {
      return res.status(400).json({ message: "Заповніть всі поля" });
    }

    const existing_user = await User.findOne({ email });
    if (existing_user) {
      return res
        .status(400)
        .json({ message: "Користувач з такий email вжу існує" });
    }

    const user = await User.create({
      lastName,
      firstName,
      middleName,
      email,
      password,
    });

    const fighter = await Fighter.findOne({ email });
    if (fighter) {
      fighter.user = user._id;
      await fighter.save();
    }

    req.session.user_id = user._id;
    req.session.role = user.role;

    res.status(201).json({ message: "Реєстрація успішна" });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Користувача не знайдено" });
    }

    const is_match = await user.comparePassword(password);
    if (!is_match) {
      return res.status(400).json({ message: "Невірний пароль" });
    }

    req.session.user_id = user._id;
    req.session.role = user.role;

    res.status(200).json({ message: "Вхід успішний" });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Помилка виходу" });
    }
    res.redirect("/");
  });
};

const get_profile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user_id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.status(200).json({
      lastName: user.lastName,
      firstName: user.firstName,
      middleName: user.middleName,
      email: user.email,
      rank: user.rank,
      unit: user.unit,
      position: user.position,
      status: user.status,
      birthDate: user.birthDate,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

const update_profile = async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      middleName,
      rank,
      unit,
      position,
      status,
      birthDate,
    } = req.body;

    const user = await User.findById(req.session.user_id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (lastName) user.lastName = lastName;
    if (firstName) user.firstName = firstName;
    if (middleName) user.middleName = middleName;
    if (rank) user.rank = rank;
    if (unit) user.unit = unit;
    if (position) user.position = position;
    if (status) user.status = status;
    if (birthDate) user.birthDate = birthDate;

    await user.save();

    const fighter = await Fighter.findOne({ email: user.email });

    if (fighter) {
      fighter.lastName = user.lastName;
      fighter.firstName = user.firstName;
      fighter.middleName = user.middleName;
      fighter.rank = user.rank;
      fighter.unit = user.unit;
      fighter.position = user.position;
      fighter.status = user.status;
      fighter.birthDate = user.birthDate;
      await fighter.save();
    }

    res.status(200).json({ message: "Профіль оновлено успішно" });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

module.exports = { register, login, logout, get_profile, update_profile };
