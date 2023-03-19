import { API_URL } from "../../settings.js";
import { sanitizeStringWithTableRows, showLoading, hideLoading } from "../../utils.js";



const URL = API_URL + "/reservations/";

export async function initListReservationsAll() {
  clearTable();
  const username = localStorage.getItem("user")
  const memberURL = URL + username;
  try {

    const token = localStorage.getItem("token");
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    showLoading()
    // Add a delay of 1 seconds
    await new Promise(resolve => setTimeout(resolve, 500));

    const data = await fetch(memberURL, options).then((res) => res.json());
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

  const convertDateString = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const sortedList = data.sort((a, b) => new Date(convertDateString(a.rentalDate)).getTime() - new Date(convertDateString(b.rentalDate)).getTime());

  const tableRowsArray = sortedList.map((reservation) => 
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




