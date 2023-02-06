const mysql = require("./config.js");
//http://localhost:3000


/*
Authors: Phil Young, Michael Feisthauer, Jessalyn Beggs
Purpose: To execute the specified query from server

*/
function populateTable(criteria)
{
    let query = `SELECT name, country, city, cuisine FROM restaurants ORDER BY name LIMIT ?,?`;
    let safeQuery = mysql.functions.format(query,[criteria.pageNumber, criteria.passNumRow]);

    if(criteria.field1)
    {
        query = `SELECT name, country, city, cuisine FROM restaurants
        WHERE ?? = ?
        ORDER BY name
        LIMIT ?,?`;
        safeQuery = mysql.functions.format(query,[criteria.field1, criteria.field2, criteria.pageNumber, criteria.passNumRow]);
    }
    return querySql(safeQuery);
}

function countRestaurants(criteria)
{
    let query = `SELECT COUNT(id) AS count FROM restaurants`;
    let safeQuery = mysql.functions.format(query);

    if(criteria.filterOne)
    {
        query = `SELECT COUNT(id) AS count FROM restaurants
        WHERE ?? = ?`;
        safeQuery = mysql.functions.format(query,[criteria.filterOne, criteria.filterTwo]);
    }
    return querySql(safeQuery);
}

function populateFilterTwo(criteria)
{
    let query = `SELECT DISTINCT country FROM restaurants ORDER BY country`;
    
    if(criteria.filterOne == 'cuisine')
        query = `SELECT DISTINCT cuisine FROM restaurants ORDER BY cuisine`;
    else if(criteria.filterOne == 'city')
        query = `SELECT DISTINCT city FROM restaurants ORDER BY city`;
    let safeQuery = mysql.functions.format(query);
    return querySql(safeQuery);
} 

module.exports = {
    "populateTable": populateTable,
    "countRestaurants": countRestaurants,
    "populateFilterTwo": populateFilterTwo
};

/*******************************************************************************
 *          You can ignore everything below here!
 *******************************************************************************/

// don't worry too much about this function!
// it has been written to return the data from your database query
// *** it DOES NOT need modifying! ***
function querySql(sql) {
    let con = mysql.getCon();

    con.connect(function(error) {
        if (error) {
          return console.error(error);
        } 
      });

    return new Promise((resolve, reject) => {
        con.query(sql, (error, sqlResult) => {
            if(error) {
                return reject(error);
            }

            return resolve(sqlResult);
        });

        con.end();
    });
}
