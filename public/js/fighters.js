let current_fighter_id = null;

document.addEventListener("DOMContentLoaded", async () => {
  await load_fighters();
  setup_modal();
});

const load_fighters = async () => {
  try {
    const profile_response = await fetch("/api/auth/profile");

    if (profile_response.status === 401) {
      window.location.href = "/log-in";
      return;
    }

    const user = await profile_response.json();

    if (user.role === "admin") {
      document.getElementById("action-header").style.display = "table-cell";
      document.getElementById("add-fighter-button").style.display = "block";
    }

    const fighters_response = await fetch("/api/fighters");
    const fighters = await fighters_response.json();

    const tbody = document.getElementById("fighters-list");

    tbody.innerHTML = "";

    fighters.forEach((fighter) => {
      const row = create_fighter_row(fighter, user.role);
      tbody.appendChild(row);
    });
  } catch (err) {
    alert("Помилка завантаження бійців");
  }
};

const create_fighter_row = (fighter, role) => {
  const row = document.createElement("tr");

  const birth_date = fighter.birthDate
    ? new Date(fighter.birthDate).toLocaleDateString("uk-UA")
    : "-";

  row.innerHTML = `
        <td>${fighter.lastName || "—"}</td>
        <td>${fighter.firstName || "—"}</td>
        <td>${fighter.middleName || "—"}</td>
        <td>${fighter.rank || "—"}</td>
        <td>${fighter.unit || "—"}</td>
        <td>${fighter.position || "—"}</td>
        <td>${fighter.status || "—"}</td>
        <td>${birth_date}</td>
        <td>${fighter.email || "—"}</td>
        ${
          role === "admin"
            ? `
        <td>
            <div class="action-buttons">
                 <button class="button-edit" data-id="${fighter._id}">↻</button>
                 <button class="button-delete" data-id="${fighter._id}">x</button>
            </div>
        </td>`
            : ""
        }
    `;

  if (role === "admin") {
    row.querySelector(".button-edit").addEventListener("click", () => {
      open_modal_edit(fighter);
    });

    row.querySelector(".button-delete").addEventListener("click", async () => {
      await delete_fighter(fighter._id);
    });
  }

  return row;
};

const delete_fighter = async (id) => {
  const confirmed = confirm("Ви впевненні що хочете видалити цього бійця?");
  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/fighters/${id}`, {
      method: "DELETE",
    });

    const date = await response.json();

    if (response.ok) {
      await load_fighters();
    } else {
      alert(date.message);
    }
  } catch (err) {
    alert("Помилка видалення");
  }
};

const setup_modal = () => {
  document
    .getElementById("add-fighter-button")
    .addEventListener("click", () => {
      open_modal_add();
    });

  document.getElementById("modal-cancel").addEventListener("click", () => {
    close_modal();
  });

  document.getElementById("modal-save").addEventListener("click", async () => {
    await save_fighter();
  });
};

const open_modal_add = () => {
  current_fighter_id = null;

  document.getElementById("modal-last-name").value = "";
  document.getElementById("modal-first-name").value = "";
  document.getElementById("modal-middle-name").value = "";
  document.getElementById("modal-rank").value = "";
  document.getElementById("modal-unit").value = "";
  document.getElementById("modal-position").value = "";
  document.getElementById("modal-status").value = "";
  document.getElementById("modal-birth-date").value = "";
  document.getElementById("modal-email").value = "";

  document.getElementById("modal").classList.add("is-open");
};

const open_modal_edit = (fighter) => {
  current_fighter_id = fighter._id;

  document.getElementById("modal-last-name").value = fighter.lastName || "";
  document.getElementById("modal-first-name").value = fighter.firstName || "";
  document.getElementById("modal-middle-name").value = fighter.middleName || "";
  document.getElementById("modal-rank").value = fighter.rank || "";
  document.getElementById("modal-unit").value = fighter.unit || "";
  document.getElementById("modal-position").value = fighter.position || "";
  document.getElementById("modal-status").value = fighter.status || "";
  document.getElementById("modal-email").value = fighter.email || "";

  if (fighter.birthDate) {
    const date = new Date(fighter.birthDate);
    document.getElementById("modal-birth-date").value = date
      .toISOString()
      .split("T")[0];
  }

  document.getElementById("modal").classList.add("is-open");
};

const close_modal = () => {
  document.getElementById("modal").classList.remove("is-open");
  current_fighter_id = null;
};

const save_fighter = async () => {
  const data = {
    lastName: document.getElementById("modal-last-name").value.trim(),
    firstName: document.getElementById("modal-first-name").value.trim(),
    middleName: document.getElementById("modal-middle-name").value.trim(),
    rank: document.getElementById("modal-rank").value,
    unit: document.getElementById("modal-unit").value.trim(),
    position: document.getElementById("modal-position").value.trim(),
    status: document.getElementById("modal-status").value,
    birthDate: document.getElementById("modal-birth-date").value,
    email: document.getElementById("modal-email").value.trim(),
  };

  if (
    !data.lastName ||
    !data.firstName ||
    !data.middleName ||
    !data.rank ||
    !data.unit ||
    !data.position ||
    !data.birthDate
  ) {
    alert("Заповніть всі обов'язкові поля!");
    return;
  }

  try {
    const url = current_fighter_id
      ? `/api/fighters/${current_fighter_id}`
      : "/api/fighters";
    const method = current_fighter_id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      close_modal();
      await load_fighters();
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert("Помилка збереження");
  }
};
