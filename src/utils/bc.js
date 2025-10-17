var bcrypt = require("bcryptjs");

/**
 * Hash a plain text password
 * @param {string} plainTextPassword - The password to hash
 * @returns {Promise<string>} - The hashed password
 */
module.exports.hashPassword = function hashPassword(plainTextPassword) {
    // Input validation
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return Promise.reject(new Error('Password must be a non-empty string'));
    }
    
    if (plainTextPassword.length < 6) {
        return Promise.reject(new Error('Password must be at least 6 characters long'));
    }

    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(12, function(err, salt) {
            if (err) {
                return reject(new Error('Failed to generate salt: ' + err.message));
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(new Error('Failed to hash password: ' + err.message));
                }
                resolve(hash);
            });
        });
    });
};

/**
 * Check if a plain text password matches a hashed password
 * @param {string} textEnteredInLoginForm - The plain text password
 * @param {string} hashedPasswordFromDatabase - The hashed password from database
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
module.exports.checkPassword = function checkPassword(
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) {
    // Input validation
    if (!textEnteredInLoginForm || typeof textEnteredInLoginForm !== 'string') {
        return Promise.reject(new Error('Password must be a non-empty string'));
    }
    
    if (!hashedPasswordFromDatabase || typeof hashedPasswordFromDatabase !== 'string') {
        return Promise.reject(new Error('Hashed password must be a non-empty string'));
    }

    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(new Error('Password comparison failed: ' + err.message));
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};
