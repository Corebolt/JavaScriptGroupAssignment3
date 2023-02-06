const express = require('express');
const app = express();
const queries = require("./mysql/queries");
app.set("view engine", "ejs");
app.use(express.static("public"));


// http://localhost:3000
/*
Authors: Phil Young, Michael Feisthauer, Jessalyn Beggs
Purpose: Server controls to enable the sql Queries

*/

app.listen(3000);

app.get("/data", (request, response) => {

  let passNumRow = request.query.passNumRow;
  let pageNumber = request.query.pageNumber;
  let field1 = request.query.field1;
  let field2 = request.query.field2;
  
  passNumRow = parseInt(passNumRow);
  pageNumber = parseInt(pageNumber)* passNumRow;
  
  queries.populateTable({passNumRow, pageNumber, field1, field2
  }).then(result => {
      response.json(result);
  });
});

app.get("/count", (request, response) => {
   let filterOne = request.query.filterOne;
   let filterTwo = request.query.filterTwo;
  queries.countRestaurants({filterOne, filterTwo}).then(result => {
    response.json(result)
  });
});

app.get("/filter", (request, response) => {
  let filterOne= request.query.filterOne;
  //{filterOne}
  queries.populateFilterTwo({filterOne}).then(result => {
    response.json(result)
  });
});

app.get("/", (request, response) => {
  response.render('index');
});