const Fighter = require("../models/fighter");
const User = require("../models/user");

const get_fighters = async (req, res) => {
  try {
    const fighters = await Fighter.find();

    res.status(200).json(fighters);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

const get_fighter = async (req, res) => {
  try {
    const fighter = await Fighter.findById(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Бійця не знайдено" });
    }

    res.status(200).json(fighter);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

const add_fighter = async (req, res) => {
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
      email,
    } = req.body;

    if (
      !lastName ||
      !firstName ||
      !middleName ||
      !rank ||
      !unit ||
      !position ||
      !birthDate
    ) {
      return res.status(400).json({ message: "Заповніть всі поля" });
    }

    if (email) {
      const existing = await Fighter.findOne({ email });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Боєця з таким email вже існує" });
      }
    }

    const fighter = await Fighter.create({
      lastName,
      firstName,
      middleName,
      rank,
      unit,
      position,
      status,
      birthDate,
      email,
    });

    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        fighter.user = user._id;
        await fighter.save();
      }
    }

    res.status(201).json({ message: "Бійця додано успішно", fighter });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

const update_fighter = async (req, res) => {
  try {
    const fighter = await Fighter.findById(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Бійця не знайдено" });
    }

    const {
      lastName,
      firstName,
      middleName,
      rank,
      unit,
      position,
      status,
      birthDate,
      email,
    } = req.body;

    if (lastName) fighter.lastName = lastName;
    if (firstName) fighter.firstName = firstName;
    if (middleName) fighter.middleName = middleName;
    if (rank) fighter.rank = rank;
    if (unit) fighter.unit = unit;
    if (position) fighter.position = position;
    if (status) fighter.status = status;
    if (birthDate) fighter.birthDate = birthDate;
    if (email) {
      fighter.email = email;

      const user = await User.findOne({ email });
      if (user) {
        fighter.user = user._id;
      }
    }

    await fighter.save();

    if (fighter.user) {
      const user = await User.findById(fighter.user);
      if (user) {
        if (lastName) user.lastName = lastName;
        if (firstName) user.firstName = firstName;
        if (middleName) user.middleName = middleName;
        if (rank) user.rank = rank;
        if (unit) user.unit = unit;
        if (position) user.position = position;
        if (status) user.status = status;
        if (birthDate) user.birthDate = birthDate;
        await user.save();
      }
    }

    res.status(200).json({ message: "Дані бійця оновленно", fighter });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

const delete_fighter = async (req, res) => {
  try {
    const fighter = await Fighter.findByIdAndDelete(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Бійця не знайдено" });
    }

    res.status(200).json({ message: "Бійця видалено" });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера: " + err.message });
  }
};

module.exports = {
  get_fighters,
  get_fighter,
  add_fighter,
  update_fighter,
  delete_fighter,
};
