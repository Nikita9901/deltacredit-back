const Pool = require("pg").Pool;
const pool = new Pool({
    user: "admin",
    password: "22121976Nik!",
    host: "localhost",
    port: "5432",
    database: "servicedb",
});

module.exports = pool;
