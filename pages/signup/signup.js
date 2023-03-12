import { API_URL } from "../../settings.js";
import { initCars } from "../cars/cars.js";
import { handleHttpErrors, sanitizeString } from "../../utils.js";

const URL = `${API_URL}/members`;

export async function initSignup() {
  document.getElementById("btn-submit-member").onclick = addMember;
  const inputFieldsAddMember = document.querySelectorAll(".add-member-input");
  const addMemberSuccessOrError = document.getElementById("status");
  const clearBtn = document.getElementById("btn-clear");
  clearBtn.onclick = clearInput;

  inputFieldsAddMember.forEach((input) => {
    input.addEventListener("keyup", () => {
      addMemberSuccessOrError.style.display = "none";
      const hasValue = Array.from(inputFieldsAddMember).some(
        (field) => field.value
      );
      clearBtn.style.display = hasValue ? "block" : "none";
    });
  });
}

function clearInput() {
  const clearBtn = document.getElementById("btn-clear");
  const inputUsername = (document.getElementById("input-username").value = "");
  const inputEmail = (document.getElementById("input-email").value = "");
  const inputPassword = (document.getElementById("input-password").value = "");
  const inputFirstName = (document.getElementById("input-firstname").value =
    "");
  const inputLastName = (document.getElementById("input-lastname").value = "");
  const inputStreet = (document.getElementById("input-street").value = "");
  const inputCity = (document.getElementById("input-city").value = "");
  const inputZip = (document.getElementById("input-zip").value = "");
  removeInvalidFields();
  clearBtn.style.display = "none";
}

function removeInvalidFields() {
  const inputs = document.querySelectorAll(".add-member-input");
  const errorMessages = document.querySelectorAll(".error-message");

  inputs.forEach(input => input.classList.remove("invalid"));
  errorMessages.forEach(errorMessage => errorMessage.style.display = "none");


}



async function addMember() {
  const inputUsername = document.getElementById("input-username");
  const inputEmail = document.getElementById("input-email");
  const inputPassword = document.getElementById("input-password");
  const inputFirstName = document.getElementById("input-firstname");
  const inputLastName = document.getElementById("input-lastname");
  const inputStreet = document.getElementById("input-street");
  const inputCity = document.getElementById("input-city");
  const inputZip = document.getElementById("input-zip");
  const addMemberSuccessOrError = document.getElementById("status");
  const passwordRequirements = document.getElementById("password-requirements");
  const usernameAvailable = document.getElementById("username-available");
  const emailAvailable = document.getElementById("email-available");

  if (
    !inputUsername.value ||
    !inputEmail.value ||
    !inputPassword.value ||
    inputPassword.value.length < 4 ||
    !inputFirstName.value ||
    !inputLastName.value ||
    !inputStreet.value ||
    !inputCity.value ||
    !inputZip.value
  ) {
    addMemberSuccessOrError.style.display = "block";
    addMemberSuccessOrError.style.color = "red";
    addMemberSuccessOrError.style.fontWeight = "bold";
    if (inputPassword.value.length < 4) {
      passwordRequirements.style.display = "block";
      passwordRequirements.innerText =
        "Password not good enough, should be at least 4 characters";
    }
    addMemberSuccessOrError.innerText = "Please fill out all fields";
    inputUsername.classList.toggle("invalid", !inputUsername.value);
    inputEmail.classList.toggle("invalid", !inputEmail.value);
    inputPassword.classList.toggle("invalid", !inputPassword.value);
    inputPassword.classList.toggle("invalid", !inputPassword.value.length < 4);
    inputFirstName.classList.toggle("invalid", !inputFirstName.value);
    inputLastName.classList.toggle("invalid", !inputLastName.value);
    inputStreet.classList.toggle("invalid", !inputStreet.value);
    inputCity.classList.toggle("invalid", !inputCity.value);
    inputZip.classList.toggle("invalid", !inputZip.value);
    return;
  }

  
  
  inputUsername.classList.remove("invalid");
  inputEmail.classList.remove("invalid");
  inputPassword.classList.remove("invalid");
  inputFirstName.classList.remove("invalid");
  inputLastName.classList.remove("invalid");
  inputStreet.classList.remove("invalid");
  inputCity.classList.remove("invalid");
  inputZip.classList.remove("invalid");
  
  addMemberSuccessOrError.style.display = "none";
  passwordRequirements.style.display = "none";

  const member = {
    username: sanitizeString(inputUsername.value),
    email: sanitizeString(inputEmail.value),
    password: sanitizeString(inputPassword.value),
    firstName: sanitizeString(inputFirstName.value),
    lastName: sanitizeString(inputLastName.value),
    street: sanitizeString(inputStreet.value),
    city: sanitizeString(inputCity.value),
    zip: sanitizeString(inputZip.value),
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(member),
    });
    if (!response.ok) {
      const errorData = await response.json(); // <-- parse the response body as JSON
      if(errorData.message === "Member with this ID already exist") {
        throw new Error("API Error - " + response.status + " - " + errorData.message);
      } 
      else if(errorData.message === "Member with this Email already exist") {
        throw new Error("API Error - " + response.status + " - " + errorData.message);
      } 
      else {
        throw new Error("Failed to create member");
      }
    }
  
    // Clear input fields after adding the member
  
    console.log("New member has been signed up.");
    addMemberSuccessOrError.style.color = "green";
    addMemberSuccessOrError.style.fontWeight = "bold";
    addMemberSuccessOrError.style.display = "block";
    addMemberSuccessOrError.innerText =
      "New member have been signed up successfully - Username: " +
      member.username +
      " - Email: " +
      member.email +
      " - Password: " +
      member.password +
      " - First Name: " +
      member.firstName +
      " - Last Name: " +
      member.lastName +
      " - Street: " +
      member.street +
      " - City: " +
      member.city +
      " - Zip: " +
      member.zip;
    clearInput();
    removeInvalidFields();
  } catch (err) {
    console.error("Error:", err.message);
    if (err.message.includes("Member with this ID already exist")) {
      usernameAvailable.style.display = "block";
      usernameAvailable.innerText = "Username not available";
      inputUsername.classList.toggle("invalid");
      
    }
    if (err.message.includes("Member with this Email already exist")) {
      emailAvailable.style.display = "block";
      emailAvailable.innerText = "Email already in use";
      inputEmail.classList.toggle("invalid");
      document.getElementById("username-available").style.display = 'none';
    }
  
  }
}

    