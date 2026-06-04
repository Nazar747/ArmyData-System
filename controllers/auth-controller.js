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

module.exports = { register, login, logout };
