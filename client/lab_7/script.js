function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min+1)+min);
  }
  
  function injectHTML(list) {
    console.log('fired injectHTML');
    const target  = document.querySelector('#restaurant_list');
    target.innerHTML = '';
  
    list.forEach((item) => {
      const str = `<li>${item.name}</li>`;
      target.innerHTML += str;
    });
  }
  
  function cutRestaurantList(list) {
    console.log('fired cutList');
    const range = [...Array(15).keys()];
    return newArray = range.map((item) => {
      const index = getRandomIntInclusive(0, list.length -1);
      return list[index];
    });
  }
  
  /* A quick filter that will return something based on a matching input */
  function filterList(list, query) {
    
    return list.filter((item)  => {
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
  
      return lowerCaseName.includes(lowerCaseQuery);
    });
  }
  
  async function mainEvent() { // the async keyword means we can make API requests
    const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    const filterButton = document.querySelector('#filter');
    const loadDataButton = document.querySelector('#data_load');
    const generateListButton = document.querySelector('#generate');
  
    const loadAnimation = document.querySelector('#load_animation');
    loadAnimation.style.display = 'none';
  
    let currentList = []; // this is "scoped" to the main event function
    
    loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
      console.log('loading data'); 
      loadAnimation.style.display = 'inline-block';
      const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
      currentList = await results.json();
      console.table(currentList); 
      loadAnimation.style.display = 'none';
    });
  
    filterButton.addEventListener('click', async (event) =>{
      console.log('clicked FilterButton');
  
      const formData = new FormData(mainForm);
      const formProps = Object.fromEntries(formData);
  
      console.log(formProps);
      const newList = filterList(currentList, formProps.resto);
  
      console.log(newList);
      injectHTML(newList);
    });
    
    generateListButton.addEventListener('click', (event) =>{
      console.log('generate new list');
      const restaurantsList = cutRestaurantList(currentList);
      injectHTML(restaurantsList);
    })
  }
  
  
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests