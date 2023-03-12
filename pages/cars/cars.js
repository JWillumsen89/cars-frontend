import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows,showLoading,hideLoading, clearTable } from "../../utils.js";
//const URL = API_URL + "/cars/admin"
const URL = API_URL + "/cars";

export async function initCars() {
  clearTable();
  try {
    showLoading()
    // Add a delay of 1 seconds
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = await fetch(URL).then((res) => res.json());
    showAllCars(data);
  } catch (err) {
    handleHttpErrors(err);
  } finally {
    hideLoading()
  }
}

function showAllCars(data) {
  const tableRowsArray = data.map((car) => `<tr>
  <td>${car.id}</td><td>${car.brand}</td><td>${car.model}</td><td>${car.pricePrDay}</td><td>${car.bestDiscount}</td>
</tr>`)

const tableRowString = tableRowsArray.join("\n");
document.getElementById("table-rows").innerHTML = sanitizeStringWithTableRows(tableRowString);
}

