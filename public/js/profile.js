document.addEventListener("DOMContentLoaded", async () => {
  await load_profile();

  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await save_profile();
  });
});

const load_profile = async () => {
  try {
    const responce = await fetch("/api/auth/profile");

    if (responce.status === 401) {
      window.location.href = "/log-in";
      return;
    }

    const user = await responce.json();

    document.getElementById("last-name").value = user.lastName || "";
    document.getElementById("first-name").value = user.firstName || "";
    document.getElementById("middle-name").value = user.middleName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("unit").value = user.unit || "";
    document.getElementById("position").value = user.position || "";

    if (user.rank) {
      document.getElementById("rank").value = user.rank;
    }
    if (user.status) {
      document.getElementById("status").value = user.status;
    }

    if (user.birthDate) {
      const date = new Date(user.birthDate);
      document.getElementById("birth-date").value = date
        .toISOString()
        .split("T")[0];
    }
  } catch (err) {
    alert("Помилка завантаження профілю");
  }
};

const save_profile = async () => {
  try {
    const responce = await fetch("api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastName: document.getElementById("last-name").value.trim(),
        firstName: document.getElementById("first-name").value.trim(),
        middleName: document.getElementById("middle-name").value.trim(),
        rank: document.getElementById("rank").value,
        unit: document.getElementById("unit").value.trim(),
        position: document.getElementById("position").value.trim(),
        status: document.getElementById("status").value,
        birthDate: document.getElementById("birth-date").value,
      }),
    });

    const data = await responce.json();

    if (responce.ok) {
      alert("Профіль збережено успішно!");
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Помилка збереження профілю");
  }
};
