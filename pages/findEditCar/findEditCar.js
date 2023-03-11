// @ts-nocheck
import { API_URL } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";

//Add id to this URL to get a single user
const URL = `${API_URL}/cars`;

export async function initFindEditCar() {
  document.getElementById("btn-fetch-car").onclick = getCarData;
  document.getElementById("btn-delete-car").onclick = deleteCar;
  document.getElementById("btn-submit-edited-car").onclick = updateCar;

  const id = document.getElementById("car-id-input");

  id.addEventListener("keyup", () => {
    document.getElementById("error").innerText = "";
    document.getElementById("car-id").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("model").value = "";
    document.getElementById("price-pr-day").value = "";
    document.getElementById("best-discount").value = "";
    document.getElementById("status").style.display = "none";
    id.classList.remove("invalid");
    document.getElementById("data").style.display = 'none'
  });
}

async function getCarData() {
  document.getElementById("error").innerText = "";
  const id = document.getElementById("car-id-input").value;
  const idInputField = document.getElementById("car-id-input");
  const error = document.getElementById("error");

  if (!id) {
    error.innerText = "Please provide an id";
    idInputField.classList.toggle("invalid", !idInputField.value);
    return;
  }

  try {
    renderCar(id);
    /* Make this work, navigo works
    const queryString = "?id=" + id
    //@ts-ignore  
    window.router.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
    */
    showDataFieldsAndButtons();
  } catch (err) {
    console.log("Error Message: " + err.message);
    document.getElementById("error").innerText = err.message;
  }
}

function showDataFieldsAndButtons() {
  document.getElementById("data").style.display = 'block'
}


async function renderCar(id) {
  const carId = document.getElementById("car-id");
  const carBrand = document.getElementById("brand");
  const carModel = document.getElementById("model");
  const carPrice = document.getElementById("price-pr-day");
  const carDiscount = document.getElementById("best-discount");
  try {
    const car = await fetch(URL + "/" + id).then((res) => res.json());

    document.getElementById("car-id-input").value = "";

    console.log(Object.keys(car).length);
    if (Object.keys(car).length === 5) {
      throw new Error("No car found for id: " + id);
    }
    carId.value = car.id;
    carBrand.value = car.brand;
    carModel.value = car.model;
    carPrice.value = car.pricePrDay;
    carDiscount.value = car.bestDiscount;
  } catch (err) {
    carId.value = "";
    carBrand.value = "";
    carModel.value = "";
    carPrice.value = "";
    carDiscount.value = "";
    document.getElementById("error").innerText = err.message;
  }
}

async function updateCar() {
  const id = document.getElementById("car-id").value;
  const URL_WithID = URL + "/" + id;

  const editBrand = document.getElementById("brand");
  const editModel = document.getElementById("model");
  const editPrice = document.getElementById("price-pr-day");
  const editDiscount = document.getElementById("best-discount");
  const editCarSuccessOrError = document.getElementById("status");

  if (
    !id ||
    !editBrand.value ||
    !editModel.value ||
    !editPrice.value ||
    !editDiscount.value
  ) {
    editCarSuccessOrError.style.display = "block";
    editCarSuccessOrError.style.color = "red";
    editCarSuccessOrError.style.fontWeight = "bold";

    editCarSuccessOrError.innerText = "Please fill out all fields";
    editBrand.classList.toggle("invalid", !editBrand.value);
    editModel.classList.toggle("invalid", !editModel.value);
    editPrice.classList.toggle("invalid", !editPrice.value);
    editDiscount.classList.toggle("invalid", !editDiscount.value);
    return;
  }

  editBrand.classList.remove("invalid");
  editModel.classList.remove("invalid");
  editPrice.classList.remove("invalid");
  editDiscount.classList.remove("invalid");
  editCarSuccessOrError.style.display = "none";

  const car = {
    brand: editBrand.value,
    model: editModel.value,
    pricePrDay: editPrice.value,
    bestDiscount: editDiscount.value,
  };
  try {
    const response = await fetch(URL_WithID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    });

    if (!response.ok) {
      throw new Error("Failed to update car with id: " + id);
    }

    // Clear input fields after updating the car
    document.getElementById("car-id").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("model").value = "";
    document.getElementById("price-pr-day").value = "";
    document.getElementById("best-discount").value = "";
    console.log("Car with id " + id + " has been updated.");
    editCarSuccessOrError.style.display = "block";
    editCarSuccessOrError.style.color = "green";
    editCarSuccessOrError.style.fontWeight = "bold";
    editCarSuccessOrError.innerText =
      "Car with id " + id + " has been updated.";
  } catch (err) {
    handleHttpErrors(err);
  }
}

async function deleteCar() {
  const id = document.getElementById("car-id").value;
  const URL_WithID = URL + "/" + id;
  const editCarSuccessOrError = document.getElementById("status");

  // Display a confirmation popup before deleting the car
  const confirmed = confirm("Are you sure you want to delete this car?");
  if (!confirmed) {
    return; // Exit the function if the user cancels the deletion
  }

  try {
    const response = await fetch(URL + "/" + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete car with id: " + id);
    }

    // Clear input fields after deleting the car
    document.getElementById("car-id-input").value = "";
    document.getElementById("car-id").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("model").value = "";
    document.getElementById("price-pr-day").value = "";
    document.getElementById("best-discount").value = "";
    editCarSuccessOrError.style.display = "block";
    editCarSuccessOrError.style.color = "green";
    editCarSuccessOrError.style.fontWeight = "bold";
    editCarSuccessOrError.innerText =
      "Car with id " + id + " has been deleted.";
  } catch (err) {
    handleHttpErrors(err);
  }
}
