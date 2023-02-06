// http://localhost:3000
// http://localhost:3000/5
// http://localhost:3000/?passNumRow=5
// http://localhost:3000/?passNumRow=5&pageNumber=0
// http://localhost:3000/?passNumRow=5&pageNumber=0&field1=country&field2=Canada

// Global variables
/*
Authors: Phil Young, Michael Feisthauer, Jessalyn Beggs
Purpose: Display selected restaurants from a database

*/


let table = document.querySelector('#menuTable');
        
let pageNumber = 0;
let lastPage;
let passNumRow = 5;
let field1 =  ""; 
let field2 = "" ; 

let displayBegin = 1;
let displayEnd= passNumRow;
let countRestaurants;


//functions

function getData() {
  fetch(`/data?passNumRow=${passNumRow}&pageNumber=${pageNumber}&field1=${field1}&field2=${field2}`)
  .then(response => response.json())
  .then(data => {

    table.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Country</th>
        <th>City</th>
        <th>Cuisine Type</th>
      </tr>`;

    for(let i = 0; i < data.length; i++)
    {
      table.innerHTML +=`
        <tr>
          <td>${data[i].name}</td>      
          <td>${data[i].country}</td>
          <td>${data[i].city}</td>
          <td>${data[i].cuisine}</td>
        </tr>
      `;
    }    
    display();
  });
}


function display(){
  fetch(`/count?filterOne=${field1}&filterTwo=${field2}`)
  .then(response => response.json())
  .then(data =>{

    countRestaurants = data[0].count  
    if(countRestaurants < displayEnd)
    {
      displayEnd = countRestaurants;
    }
    
    document.getElementById("displayNumPage").innerText = `Displaying ${displayBegin} - ${displayEnd} of ${countRestaurants}`;
  });
}

//main

getData();
display();

document.querySelector("#previous").addEventListener("click", event => {
  if(pageNumber == 0)
  {
    alert("Can't go previous, no more previous pages");
    
  }else
  {
    if(pageNumber > 0)
  {  
    
    pageNumber --;
    displayBegin -= passNumRow;
    displayEnd -= passNumRow;
   
    if(displayEnd < passNumRow)
    {
      displayEnd = passNumRow;
    }
  }
  }
  
  getData();
});

document.querySelector("#next").addEventListener("click", event => {
  
  if(displayEnd >= countRestaurants)
  {
    displayEnd == countRestaurants;
  
    alert("Can't go to next, no more pages");
  }
  else
  {    
    
    pageNumber ++;
    displayBegin += passNumRow;
    displayEnd += passNumRow;
  }
 
  getData();
  
});

document.querySelector("#numRows").addEventListener("change",
  event => {
  pageNumber = 0;
  let numRow = document.querySelector("#numRows option:checked").value;
  passNumRow = parseInt(numRow);

  displayBegin = 1;
  displayEnd = passNumRow;  
 
  getData();
});

document.getElementById("filter1").addEventListener("change", 
event => {

let filter2Dropdown = document.getElementById('filter2');
let filter1Value = document.querySelector("#filter1 option:checked").value;

  fetch(`/filter?filterOne=${filter1Value}`)
  .then(response => response.json())
  .then(data =>{

    filter2Dropdown.innerHTML='<option value ="">-- No Filter --</option>';
    for(let i=0; i<data.length; i++)
    {
      filter2Dropdown.innerHTML+=
      `<option value ="${data[i][filter1Value]}"> ${data[i][filter1Value]} </option>`;
    }
  })
});

document.querySelector("#apply").addEventListener("click", event => {
  field1 = document.querySelector("#filter1 option:checked").value;
  field2 = document.querySelector("#filter2 option:checked").value;
 
  if(field1 == "")
    alert("Must select both filters to filter data!");
  else if(field2 == "")
    alert("Must select both filters to filter data!");
  else
  {
    pageNumber = 0;
    getData();    
  }
});

document.querySelector("#clear").addEventListener("click", event => {
 
  let filter1Dropdown = document.getElementById('filter1');
  let filter2Dropdown = document.getElementById('filter2');

  field1 = document.querySelector("#filter1 option:checked").value;
  field2 = document.querySelector("#filter2 option:checked").value;
  if(field1 == "" && field2 == "")
  { 
    alert("No filters to clear");    
  }
  else
  {
    field1 = "";
    field2 = "";
    filter1Dropdown.innerHTML = `<option value ="">-- No Filter --</option>
    <option value="country">Country</option>
    <option value="city">City</option>
    <option value="cuisine">Cuisine</option>`;
    filter2Dropdown.innerHTML = '<option value ="">-- No Filter --</option>';
    displayEnd = passNumRow;
    getData();
  }
});




