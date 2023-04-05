function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurant_list");
  target.innerHTML = "";

  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

function cutRestaurantList(list) {
  console.log("fired cutList");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();

    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function initMap() {
  const carto = L.map('map').setView([38.989, -76.937], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(carto);
  return carto;
}

function markerPlace(array, map) {
  console.log('array for markers', array);

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
  
  array.forEach((item) => {
    console.log('markerPlace', item);
    const {coordinates} = item.geocoded_column_1;

    L.marker([coordinates[1], coordinates[0]]).addTo(map);
  })
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const mainForm = document.querySelector(".main_form"); // This class name needs to be set on your form before you can listen for an event on it
  const loadDataButton = document.querySelector("#data_load");
  const clearDataButton = document.querySelector("#data_clear");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#resto");

  const loadAnimation = document.querySelector("#load_animation");
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  const carto = initMap();

  let pasrsedData = JSON.parse(localStorage.getItem("storedData"));
  let currentList = []; // this is "scoped" to the main event function
  if (pasrsedData?.length > 0 ) {
    generateListButton.classList.remove("hidden");
  }

  loadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something
    console.log("loading data");
    loadAnimation.style.display = "inline-block";


    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json"
    );

    const storedList = await results.json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    pasrsedData = storedList;
    if (pasrsedData?.length > 0 ) {
      generateListButton.classList.remove("hidden");
    }

    console.table(storedList);
    loadAnimation.style.display = "none";
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");

    currentList = cutRestaurantList(pasrsedData);
    console.log(currentList);
    injectHTML(currentList);
    markerPlace(currentList, carto);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
    markerPlace(newList, carto);
  });

  clearDataButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("Local Storage check: ",localStorage.getItem("StoredData"));
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
