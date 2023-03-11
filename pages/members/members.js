import { API_URL } from "../../settings.js";
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
const URL = API_URL + "/members"

export async function initMembers(){
  try {
    const data = await fetch(URL).then((res) => res.json());
    showAllMembers(data);
  } catch (err) {
    handleHttpErrors(err);
  }
}

function showAllMembers(data) {
  const tableRowsArray = data.map((member) => `<tr>
  <td>${member.username}</td><td>${member.email}</td><td>${member.firstName} ${member.lastName}</td><td>${member.ranking}</td>
</tr>`)

const tableRowString = tableRowsArray.join("\n");
document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowString);
}
