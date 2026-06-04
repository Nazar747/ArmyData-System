const { response } = require("express");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const lastName = document.getElementById("last-name").value.trim();
    const firstName = document.getElementById("first-name").value.trim();
    const middleName = document.getElementById("middle-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const passwordRepeat = document
      .getElementById("password-repeat")
      .value.trim();

    if (!lastName || !firstName || !middleName || !email || !password) {
      alert("Заповніть всі поля!");
      return;
    }

    if (password !== passwordRepeat) {
      alert("Паролі не співпадають!");
      return;
    }

    if (password.lenght < 6) {
      alert("Пароль має бути мінімум 6 символів!");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastName,
          firstName,
          middleName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/profile";
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Помилка з'єднання з сервером");
    }
  });
});
