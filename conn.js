 var mysql = require("mysql");
var util = require("util");

var conn =mysql.createConnection({
    host:"ba21zie766ithh0akyro-mysql.services.clever-cloud.com",
    user:"umfdiro1bie2ad8c",
    password:"gr5AGQwcanVAH6BpKt1y",
    database:"ba21zie766ithh0akyro",
});

var exe =util.promisify(conn.query).bind(conn);

module.exports=exe;