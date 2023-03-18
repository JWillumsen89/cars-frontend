import { API_URL } from "../../settings.js";
import {handleHttpErrors} from "../../utils.js"
import { setUserRole, loggedIn, checkIfLoggedIn } from "../../auth.js";

const URL = API_URL + "/auth/login";

export function initLogin() {
  document.getElementById("login-btn").onclick = login;
}

export function logout() {

  localStorage.clear();
  checkIfLoggedIn()
  setUserRole()
  loggedIn(false);
  window.router.navigate("/login")
}

async function login(evt) {
  document.getElementById("error").innerText = "";
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const options = { 
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
  }
  try{
      const response = await fetch(URL, options).then(res => handleHttpErrors(res))
      localStorage.setItem("user", response.username)
      localStorage.setItem("token", response.token)
      localStorage.setItem('roles', JSON.stringify(response.roles));

      checkIfLoggedIn()
      window.router.navigate("")
      setUserRole()
      loggedIn(true);
  } catch (error) {

    document.getElementById("error").innerText = error.message
  }
}
