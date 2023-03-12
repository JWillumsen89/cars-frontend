import { API_URL } from "../../settings.js";
import { sanitizeStringWithTableRows, showLoading, hideLoading } from "../../utils.js";

const URL = API_URL + "/reservations";

export async function initListReservationsAll() {

  clearTable();
  try {
    showLoading()
    // Add a delay of 1 seconds
    await new Promise(resolve => setTimeout(resolve, 500));

    const data = await fetch(URL).then((res) => res.json());
    showAllReservations(data);
  } catch (err) {
    console.error(err);
  } finally {
    hideLoading()
  }
}

function clearTable() {
  document.getElementById("table-rows").innerHTML = "";
}



function showAllReservations(data) {
  const tableRowsArray = data.map((reservation) => 
    `<tr>
      <td>${reservation.id}</td>
      <td>${reservation.carId}</td>
      <td>${reservation.brand}</td>
      <td>${reservation.model}</td>
      <td>${reservation.rentalDate}</td>
    </tr>`
  );

  const tableRowString = tableRowsArray.join("\n");
  document.getElementById("table-rows").innerHTML =
    sanitizeStringWithTableRows(tableRowString);
}

