import { API_URL } from "../../settings.js";
import {handleHttpErrors} from "../../utils.js"
import { setUserRole, loggedIn, checkIfLoggedIn, checkWhatRoleAndChangeMenuVisibility } from "../../auth.js";

const URL = API_URL + "/auth/login";

export function initLogin() {
  document.getElementById("login-btn").onclick = login;
  addEventListeners();
}

function handleEnterKey(event) {
  const loginButton = document.getElementById("login-btn");
  if (event.key === "Enter") {
    event.preventDefault();
    loginButton.click();
  }
}

function addEventListeners() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  

  usernameInput.addEventListener("keyup", handleEnterKey);
  passwordInput.addEventListener("keyup", handleEnterKey);
}







export function logout() {

  localStorage.clear();
  checkIfLoggedIn()
  setUserRole()
  loggedIn(false);
  checkWhatRoleAndChangeMenuVisibility()
  // @ts-ignore
  window.router.navigate("/login")
}

// @ts-ignore
async function login(evt) {
  document.getElementById("error").innerText = "";
  // @ts-ignore
  const username = document.getElementById("username").value;
  // @ts-ignore
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
      // @ts-ignore
      window.router.navigate("")
      setUserRole()
      checkWhatRoleAndChangeMenuVisibility()
      loggedIn(true);
  } catch (error) {

    document.getElementById("error").innerText = error.message
  }
}
