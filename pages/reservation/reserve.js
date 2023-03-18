import { API_URL } from "../../settings.js";
import {
  handleHttpErrors,
  sanitizeStringWithTableRows,
  encode,
  showLoading,
  hideLoading,
  clearTable,
} from "../../utils.js";

const URL = API_URL + "/cars";
const reservationURL = API_URL + "/reservations";

export async function initReservation() {
  showAllCars();
  preventBackInTimeDate();
  document.getElementById("table-rows").onclick = setupReservationModal;
  const resStatus = document.getElementById("res-status").innerHTML = "";
}

async function showAllCars() {
  clearTable();
  const token = localStorage.getItem("token");
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    showLoading();
    // Add a delay of 1 seconds
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = await fetch(URL, options).then((res) => res.json());
    const tableRowsArray = data.map(
      (car) => `<tr>
      <td>${car.id}</td><td>${car.brand}</td><td>${car.model}</td><td>${car.pricePrDay}</td><td><button class="btn-reserve-car btn btn-dark" data-car-id="${car.id}">Add Reservation</button></td>
        </tr>`
    );

    const tableRowString = tableRowsArray.join("\n");
    document.getElementById("table-rows").innerHTML =
      sanitizeStringWithTableRows(tableRowString);
  } catch (err) {
    handleHttpErrors(err);
  } finally {
    hideLoading();
  }
}

function preventBackInTimeDate() {
  const reservationDateInput = document.getElementById("reservation-date");
  const today = new Date().toISOString().split("T")[0];
  reservationDateInput.setAttribute("min", today);
}

async function setupReservationModal(event) {
  const target = event.target;

  if (!target.classList.contains("btn-reserve-car")) {
    console.log("Clicked on something else than a button");
    return;
  }
  const carReserveId = target.getAttribute("data-car-id");
  console.log("Id for the button clicked: " + carReserveId);
  const carInformation = await getCarInfo(carReserveId);
  showModalWithCarInfo(carInformation);
}

async function getCarInfo(id) {
  const token = localStorage.getItem("token");
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const car = await fetch(URL + "/" + id, options).then((res) => res.json());
    return car;
  } catch (err) {
    console.error(err);
    alert("Something went wrong - Try again later");
  }
}

function showModalWithCarInfo(carInfo) {
  const modalTitle = document.getElementById("reservation-modal-label");
  const modalPriceP = document.getElementById("price-pr-day-p");
  const modalInputId = document.getElementById("car-id");
  const inputUsername = document.getElementById("user-name");
  const inputDate = document.getElementById("reservation-date");

  modalInputId.value = carInfo.id;
  modalTitle.innerText = `Reserve ${carInfo.brand} ${carInfo.model}`;
  modalPriceP.innerText = `Price per day is: ${carInfo.pricePrDay},- dkk`;

  const modal = new bootstrap.Modal(
    document.getElementById("reservation-modal")
  );

  modal.show();

  document.getElementById("btn-reservation").onclick = async function () {
    await createReservation(modal);
  };
}

async function createReservation(modal) {
  const carId = document.getElementById("car-id");
  const username = localStorage.getItem("user");
  const date = document.getElementById("reservation-date");
  const statusP = document.getElementById("status");
  const resStatus = document.getElementById("res-status");
  console.log(username)

  if (!date.value) {
    console.log("Missing input");
    statusP.style.display = "block";
    statusP.style.color = "red";
    statusP.style.fontWeight = "bold";
    statusP.innerText = "Please fill out date";
    date.classList.toggle("invalid", !date.value);
    return;
  }

  date.classList.remove("invalid");

  statusP.style.display = "none";

  const reservation = {
    rentalDate: date.value,
    carId: carId.value,
    username: username,
  };

  try {
    const response = await fetch(reservationURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });
    if (!response.ok) {
      const errorData = await response.json();

      if (
        errorData.message ===
        "There is already a reservation for that car on that date."
      ) {
        console.log(
          "API Error - " + response.status + " - " + errorData.message
        );
        throw new Error(errorData.message);
      } else if (
        errorData.message === "You cant make a reservation back in time"
      ) {
        console.log(
          "API Error - " + response.status + " - " + errorData.message
        );
        throw new Error(errorData.message);
      } else {
        throw new Error("Failed to create reservation");
      }
    }
    modal.hide();

    resStatus.style.display = "block";
    resStatus.style.color = "green";
    resStatus.innerText = `Reservation for car with id: ${reservation.carId} on ${reservation.rentalDate} for ${reservation.username} was successfully created`;
    date.value = "";
    console.log("Reservation created");
  } catch (err) {
    console.error("Error:", err.message);
    statusP.style.display = "block";
    statusP.innerText = err.message;

    if (
      err.message.includes(
        "There is already a reservation for that car on that date."
      )
    ) {
      date.classList.toggle("invalid");
      return;
    } else {
      resStatus.style.display = "block";
      resStatus.style.color = "red";
      resStatus.innerText = "Something went wrong - Reservation not created";
    }
  }
}
