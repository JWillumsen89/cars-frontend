import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows, showLoading, hideLoading, clearTable } from "../../utils.js";
const URL = API_URL + "/members"

export async function initMembers(){
  clearTable()
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
    const data = await fetch(URL, options).then((res) => res.json());
    showAllMembers(data);
  } catch (err) {
    handleHttpErrors(err);
  } finally {
    hideLoading()
  }
}

function showAllMembers(data) {
  const tableRowsArray = data.map((member) => `<tr>
  <td>${member.username}</td><td>${member.email}</td><td>${member.firstName} ${member.lastName}</td><td>${member.ranking}</td>
</tr>`)

const tableRowString = tableRowsArray.join("\n");
document.getElementById("table-rows").innerHTML = sanitizeStringWithTableRows(tableRowString);
}
