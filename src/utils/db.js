const spicedPg = require("spiced-pg");
///////////////// this communicates with the local or the web sql database and has to be
///////////////// specified for each project
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-finalproject`;
var db = spicedPg(dbUrl);

/////////////////////////////////////////////////////////////////////////

module.exports.addUsers = function addUsers(
    username,
    age,
    city,
    email,
    password
) {
    // Input validation
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        return Promise.reject(new Error('Username is required and must be a non-empty string'));
    }
    if (!age || typeof age !== 'number' || age < 18 || age > 120) {
        return Promise.reject(new Error('Age must be a number between 18 and 120'));
    }
    if (!city || typeof city !== 'string' || city.trim().length === 0) {
        return Promise.reject(new Error('City is required and must be a non-empty string'));
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return Promise.reject(new Error('Valid email address is required'));
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        return Promise.reject(new Error('Password must be at least 6 characters long'));
    }

    return db.query(
        `
        INSERT INTO users (username, age, city, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `,
        [username.trim(), age, city.trim(), email.trim().toLowerCase(), password]
    );
};

module.exports.deleteUser = function deleteUser(id) {
    if (!id || typeof id !== 'number' || id <= 0) {
        return Promise.reject(new Error('Valid user ID is required'));
    }
    
    return db.query(
        `
        DELETE FROM users
        WHERE id = $1
        `,
        [id]
    );
};

module.exports.login = function login(logEmail) {
    if (!logEmail || typeof logEmail !== 'string' || !logEmail.includes('@')) {
        return Promise.reject(new Error('Valid email address is required'));
    }
    
    return db.query(
        `SELECT id, email, password 
    FROM users 
    WHERE email = $1;`,
        [logEmail.trim().toLowerCase()]
    );
};

module.exports.getUserInfo = function getUserInfo(id) {
    if (!id || typeof id !== 'number' || id <= 0) {
        return Promise.reject(new Error('Valid user ID is required'));
    }
    
    return db.query(
        `
        SELECT username, age, city, imgUrl
        FROM users 
        WHERE id = $1;
        `,
        [id]
    );
};

module.exports.getUserAndCellar = function getUserAndCellar(id) {
    return db.query(
        `
    SELECT users.id, username, age, city, imgUrl, beer_id
    FROM liked_beers
    JOIN users
    ON (users.id = $1 AND user_id = users.id)
    `,
        [id]
    );
};

module.exports.updateProfilePic = function updateProfilePic(id, url) {
    return db.query(
        `
        UPDATE users 
        SET imgUrl = $2 
        WHERE id = $1;
        `,
        [id, url]
    );
};

module.exports.likeBeer = function likeBeer(userId, beerId) {
    return db.query(
        `
        INSERT INTO liked_beers (user_id, beer_id)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [userId, beerId]
    );
};

module.exports.dislikeBeer = function dislikeBeer(userId, beerId) {
    return db.query(
        `
        DELETE FROM liked_beers
        WHERE (user_id = $1 AND beer_id = $2)
        `,
        [userId, beerId]
    );
};

module.exports.searchLikedBeer = function searchLikedBeer(userId, beerId) {
    return db.query(
        `
        SELECT * FROM liked_beers
        WHERE (user_id = $1 AND beer_id = $2)
        `,
        [userId, beerId]
    );
};

module.exports.likedBeersList = function likedBeersList(id) {
    return db.query(
        `
        SELECT * FROM liked_beers
        WHERE (user_id = $1)
        `,
        [id]
    );
};

module.exports.getCities = function getCities() {
    return db.query(
        `
        SELECT DISTINCT city 
        FROM users
    `
    );
};

module.exports.onlineUsersInfo = function onlineUsersInfo(arrayOfIds) {
    const query = `SELECT id, username, age, city, imgUrl FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

module.exports.getRecentChats = function getRecentChats() {
    return db.query(
        ` SELECT users.id as userid, username, age, city, imgUrl, chats.id, text, chats.created_at
        FROM chats
        JOIN users
        ON (sender_id = users.id)
        ORDER BY chats.id DESC
        LIMIT 10;`
    );
};

module.exports.getRecentChatsCity = function getRecentChatsCity(city) {
    return db.query(
        `SELECT users.id as userid, username, age, city, imgUrl, chats.id, text, chats.created_at
        FROM chats
        JOIN users
        ON (sender_id = users.id)
        WHERE city = $1
        ORDER BY chats.id DESC
        LIMIT 10;`,
        [city]
    );
};

module.exports.onlineUsersInfoByCity = function onlineUsersInfoByCity(
    arrayOfIds
) {
    return db.query(
        `SELECT id, username, age, city, imgUrl 
        FROM users 
        WHERE id = ANY($1)
        `,
        [arrayOfIds]
    );
};

// module.exports.onlineUsersInfoByCity = function onlineUsersInfoByCity(
//     arrayOfIds,
//     city
// ) {
//     const query = `SELECT id, username, age, city, imgUrl
//                 FROM users
//                 WHERE id = ANY($1)
//                 AND city = $2
//                 `;
//     return db.query(query, [arrayOfIds], [city]);
// };

module.exports.addChatMsg = function addChatMsg(sender_id, text) {
    return db.query(
        `
        INSERT INTO chats (sender_id, text)
        VALUES ($1, $2)
        RETURNING *;
    `,
        [sender_id, text]
    );
};

module.exports.getRecentPrivateChats = function getRecentPrivateChats(
    sender_id,
    receiver_id
) {
    return db.query(
        ` SELECT users.id, username, age, city, imgUrl, privatechats.id, text, privatechats.created_at
        FROM privatechats
        JOIN users
        ON (sender_id = $1 AND receiver_id = $2 AND sender_id = users.id)
        OR (sender_id = $2 AND receiver_id = $1 AND sender_id = users.id)
        ORDER BY privatechats.id DESC
        LIMIT 10;
        `,
        [sender_id, receiver_id]
    );
};

module.exports.addPrivateChatMsg = function addPrivateChatMsg(
    sender_id,
    receiver_id,
    text
) {
    return db.query(
        `
        INSERT INTO privatechats (sender_id, receiver_id, text)
        VALUES ($1, $2, $3)
        RETURNING *;
    `,
        [sender_id, receiver_id, text]
    );
};

module.exports.getChatAndUserInfo = function getChatAndUserInfo(
    usersid,
    chatsid
) {
    return db.query(
        `
    SELECT users.id, username, age, city, imgUrl, chats.id, text, chats.created_at
    FROM chats
    JOIN users
    ON (users.id = $1 AND sender_id = users.id AND chats.id = $2)
    `,
        [usersid, chatsid]
    );
};

module.exports.getPrivateChatAndUserInfo = function getPrivateChatAndUserInfo(
    usersid,
    privatechatsid
) {
    return db.query(
        `
    SELECT users.id, username, age, city, imgUrl, privatechats.id, text, privatechats.created_at
    FROM privatechats
    JOIN users
    ON (users.id = $1 AND sender_id = users.id AND privatechats.id = $2)
    `,
        [usersid, privatechatsid]
    );
};

module.exports.addPicDatabase = function addPicDatabase(user_id, url) {
    return db.query(
        `
        INSERT INTO pictures (user_id, imgUrl)
        VALUES ($1, $2)
        RETURNING *;
    `,
        [user_id, url]
    );
};

module.exports.getPicsUserDatabase = function getPicsUserDatabase(user_id) {
    return db.query(
        `
        SELECT imgUrl FROM pictures
        WHERE (user_id = $1)
        `,
        [user_id]
    );
};

module.exports.deletePicsUserDatabase = function deltePicsUserDatabase(
    user_id
) {
    return db.query(
        `
        DELETE FROM pictures
        WHERE (user_id = $1)
        `,
        [user_id]
    );
};
