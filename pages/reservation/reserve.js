
import { API_URL } from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
const URL = API_URL + "/cars"

export async function initReservation() {
  showAllCars();
  document.getElementById("table-rows").onclick = setupReservationModal;
}

async function showAllCars() {

  try {
    const data = await fetch(URL).then((res) => res.json());
    const tableRowsArray = data.map((car) => `<tr>
      <td>${car.id}</td><td>${car.brand}</td><td>${car.model}</td><td>${car.pricePrDay}</td><td><button class="btn-reserve-car btn btn-dark" data-car-id="${car.id}">Add Reservation</button></td>
        </tr>`);

    const tableRowString = tableRowsArray.join("\n");
    document.getElementById("table-rows").innerHTML = sanitizeStringWithTableRows(tableRowString);

  } catch (err) {
    handleHttpErrors(err);
  }
}

async function setupReservationModal(event) {
  const target = event.target;

  if(!target.classList.contains("btn-reserve-car")) {
    console.log("Clicked on something else than a button")
    return
  }
  const carReserveId = target.getAttribute("data-car-id")
  console.log("Id for the button clicked: " + carReserveId)
  const carInformation = await getCarInfo(carReserveId)
}

async function getCarInfo(id) {
  try {
    const car = await fetch(URL + "/" + id).then((res) => res.json());
    return car;
  } catch(err) {
    console.error(err)
    alert("Something went wrong - Try again later")
  }
}

