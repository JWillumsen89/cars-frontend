import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js";
import { handleHttpErrors, encode } from "../../utils.js";
//Add id to this URL to get a single user
const URL = `${API_URL}/cars`;

export async function initAddCar(match) {
  document.getElementById("btn-submit-car").onclick = addCar;
  const inputFieldsAddCar = document.querySelectorAll(".add-car-input");
  const addCarSuccessOrError = document.getElementById("status");
  const clearBtn = document.getElementById("btn-clear");
  clearBtn.onclick = clearInput;

  inputFieldsAddCar.forEach((input) => {
    input.addEventListener("keyup", () => {
      addCarSuccessOrError.style.display = "none";
      const hasValue = Array.from(inputFieldsAddCar).some(
        (field) => field.value
      );
      clearBtn.style.display = hasValue ? "block" : "none";
    });
  });
}

function clearInput() {
  const clearBtn = document.getElementById("btn-clear");
  const addBrand = document.getElementById("brand").value = "";
  const addModel = document.getElementById("model").value = "";
  const addPrice = document.getElementById("price-pr-day").value = "";
  const addDiscount = document.getElementById("best-discount").value = "";
  removeInvalidFields();
  clearBtn.style.display = "none";
}

function removeInvalidFields() {
  document.getElementById("brand").classList.remove("invalid");
  document.getElementById("model").classList.remove("invalid");
  document.getElementById("price-pr-day").classList.remove("invalid");
  document.getElementById("best-discount").classList.remove("invalid");
}

async function addCar() {
  const addBrand = document.getElementById("brand");
  const addModel = document.getElementById("model");
  const addPrice = document.getElementById("price-pr-day");
  const addDiscount = document.getElementById("best-discount");
  const addCarSuccessOrError = document.getElementById("status");

  if (
    !addBrand.value ||
    !addModel.value ||
    !addPrice.value ||
    !addDiscount.value
  ) {
    addCarSuccessOrError.style.display = "block";
    addCarSuccessOrError.style.color = "red";
    addCarSuccessOrError.style.fontWeight = "bold";
    addCarSuccessOrError.innerText = "Please fill out all fields";
    addBrand.classList.toggle("invalid", !addBrand.value);
    addModel.classList.toggle("invalid", !addModel.value);
    addPrice.classList.toggle("invalid", !addPrice.value);
    addDiscount.classList.toggle("invalid", !addDiscount.value);
    return;
  }

  addBrand.classList.remove("invalid");
  addModel.classList.remove("invalid");
  addPrice.classList.remove("invalid");
  addDiscount.classList.remove("invalid");
  addCarSuccessOrError.style.display = "none";

  const car = {
    brand: encode(addBrand.value),
    model: encode(addModel.value),
    pricePrDay: encode(addPrice.value),
    bestDiscount: encode(addDiscount.value),
  };
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    });
    if (!response.ok) {
      throw new Error("Failed to add car");
    }

    console.log("New car has been added.");

    addCarSuccessOrError.style.display = "block";
    addCarSuccessOrError.style.color = "green";
    addCarSuccessOrError.style.fontWeight = "bold";
    addCarSuccessOrError.innerText =
      "New car has been added - Brand: " +
      car.brand +
      " - Model: " +
      car.model +
      " - Price Pr Day: " +
      car.pricePrDay +
      " - Best Discount: " +
      car.bestDiscount;
    clearInput();
  } catch (err) {
    handleHttpErrors(err);
  }
}
