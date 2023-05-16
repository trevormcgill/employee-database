const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employees_db'
},
console.log(`Connected to the movies_db database.`)
);


module.exports = connection;
