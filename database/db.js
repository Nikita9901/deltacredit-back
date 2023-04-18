const mysql = require('mysql2')
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '22121976Nik!',
    database: 'mysql'
}).promise()

module.exports = connection;
// const Pool = require("pg").Pool;
// const pool = new Pool({
//     user: "postgres",
//     password: "22121976Nik!",
//     host: "localhost",
//     port: "5432",
//     database: "servicedb",
// });
//
// module.exports = pool;
