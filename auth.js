export let roles = setUserRole();
export let isLoggedIn = false;

export function loggedIn(boolValue) {
  isLoggedIn = boolValue;
}

export function checkIfLoggedIn() {
  if (localStorage.getItem("user")) {
    document.getElementById("login-id").style.display = "none";
    document.getElementById("logout-id").style.display = "block";
  } else if (!localStorage.getItem("user")) {
    document.getElementById("login-id").style.display = "block";
    document.getElementById("logout-id").style.display = "none";
  }
}

export function setUserRole() {
  return localStorage.getItem("roles");
}
