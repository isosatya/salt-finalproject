const spicedPg = require("spiced-pg");
///////////////// this communicates with the local or the web sql database and has to be
///////////////// specified for each project
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-socialnetwork`;
var db = spicedPg(dbUrl);

/////////////////////////////////////////////////////////////////////////

module.exports.addUsers = function addUsers(
    firstName,
    lastName,
    email,
    password
) {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `,
        [firstName, lastName, email, password]
    );
};

module.exports.login = function login(logEmail) {
    return db.query(`SELECT id, email, password FROM users WHERE email = $1;`, [
        logEmail
    ]);
};