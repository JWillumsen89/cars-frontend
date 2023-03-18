//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink,
  adjustForMissingHash,
  renderTemplate,
  loadHtml,
} from "./utils.js";

import { initReservation } from "./pages/reservation/reserve.js";
import { initMembers } from "./pages/members/members.js";
import { initCars } from "./pages/cars/cars.js";
import { initAddCar } from "./pages/addCar/addCar.js";
import { initLogin, logout } from "./pages/login/login.js";
import { initSignup } from "./pages/signup/signup.js";
import { initFindEditCar } from "./pages/findEditCar/findEditCar.js";
import { initListReservationsAll } from "./pages/showReservations/reservations.js";
import { setUserRole, isLoggedIn, checkIfLoggedIn } from "./auth.js";

window.addEventListener("load", async () => {
  const templateCars = await loadHtml("./pages/cars/cars.html");
  const templateMembers = await loadHtml("./pages/members/members.html");
  const templateAddCar = await loadHtml("./pages/addCar/addCar.html");
  const templateSignup = await loadHtml("./pages/signup/signup.html");
  const templateLogin = await loadHtml("./pages/login/login.html");
  const templateFindEditCar = await loadHtml(
    "./pages/findEditCar/findEditCar.html"
  );
  const templateReserve = await loadHtml("./pages/reservation/reserve.html");
  const templateReservations = await loadHtml(
    "./pages/showReservations/reservations.html"
  );
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");

  let roles = setUserRole();
  checkIfLoggedIn();

  adjustForMissingHash();

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
        roles = setUserRole();
      },
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () =>
        (document.getElementById("content").innerHTML = `
        
        <img style="width:50%;max-width:600px;margin-top:1em;" src="./images/cars.png">
     `),
      "/cars": () => {
        if (roles && roles.includes("ADMIN")) {
          renderTemplate(templateCars, "content");
          initCars();
        } else {
          router.navigate("/not-authorized");
        }
      },
      "/find-edit-car": (match) => {
        if (roles && roles.includes("ADMIN")) {
          renderTemplate(templateFindEditCar, "content");
          initFindEditCar(match);
        } else {
          router.navigate("/not-authorized");
        }
      },
      "/add-car": (match) => {
        if (roles && roles.includes("ADMIN")) {
          renderTemplate(templateAddCar, "content");
          initAddCar();
        } else {
          router.navigate("/not-authorized");
        }
      },
      "/members": () => {
        if (roles && roles.includes("ADMIN")) {
          renderTemplate(templateMembers, "content");
          initMembers();
        } else {
          router.navigate("/not-authorized");
        }
      },
      "/reserve-car": () => {
        if (roles && roles.includes("USER")) {
          renderTemplate(templateReserve, "content");
          initReservation();
        } else {
          router.navigate("/not-authorized");
        }
      },
      "/reservations": () => {
        if (roles && roles.includes("USER")) {
          renderTemplate(templateReservations, "content");
          initListReservationsAll();
        } else {
          router.navigate("/not-authorized");
        }
      },
      "/signup": () => {
        if (roles) {
          renderTemplate(templateSignup, "content");
          initSignup();
        } else {
          router.navigate("/already-logged-in");
        }
      },
      "/login": (match) => {
        if (!isLoggedIn) {
          renderTemplate(templateLogin, "content");
          initLogin();
        } else {
          router.navigate("/already-logged-in");
        }
      },
      "/logout": () => {
        logout();
      },
      "/not-authorized": () =>
        (document.getElementById("content").innerHTML = `
      <h1>You are not authorized for this site.</h1>`),
      "/already-logged-in": () =>
        (document.getElementById("content").innerHTML = `
      <h1>You are already logged in.</h1>`),
      "/already-logged-out": () =>
        (document.getElementById("content").innerHTML = `
      <h1>You are already logged out.</h1>`),
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content");
    })
    .resolve();
});

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert(
    "Error: " +
      errorMsg +
      " Script: " +
      url +
      " Line: " +
      lineNumber +
      " Column: " +
      column +
      " StackTrace: " +
      errorObj
  );
};
