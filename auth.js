export let roles = setUserRole();
export let isLoggedIn = "";

export function loggedIn(boolValue) {
  isLoggedIn = boolValue;
}

export function checkIfLoggedIn() {
  if (localStorage.getItem("user")) {
    document.getElementById("login-id").style.display = "none";
    document.getElementById("logout-id").style.display = "block";
    document.getElementById("sign-up-btn").style.display = "none"
  } else if (!localStorage.getItem("user")) {
    document.getElementById("login-id").style.display = "block";
    document.getElementById("logout-id").style.display = "none";
    document.getElementById("sign-up-btn").style.display = "block"
  }
}

export function checkWhatRoleAndChangeMenuVisibility() {
  const user = localStorage.getItem("user");
  const roles = localStorage.getItem("roles");

  console.log(user);
  console.log(roles);

  const setElementDisplay = (elements, displayValue) => {
    elements.forEach(element => {
      element.style.display = displayValue;
    });
  };

  const adminElements = Array.from(document.getElementsByClassName("admin-visibility"));
  const userElements = Array.from(document.getElementsByClassName("user-visibility"));

  if (roles) {
    if (roles.includes("ADMIN")) {
      console.log("In admin check");
      setElementDisplay(adminElements, "block");
    }

    if (roles.includes("USER")) {
      setElementDisplay(userElements, "block");
    } else {
      setElementDisplay(userElements, "none");
    }
  } else {
    setElementDisplay(userElements, "none");
    setElementDisplay(adminElements, "none");
  }
}


export function setUserRole() {
  return localStorage.getItem("roles");
}
