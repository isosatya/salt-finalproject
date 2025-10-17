// Application constants
const CONFIG = {
    // File upload settings
    MAX_FILE_SIZE: 2097152, // 2MB
    UPLOAD_DIR: __dirname + "/uploads",
    
    // Session settings
    SESSION_SECRET: `I'm always angry.`,
    SESSION_MAX_AGE: 1000 * 60 * 60 * 24 * 90, // 90 days
    
    // S3 settings
    S3_URL_PREFIX: "https://s3.amazonaws.com/andres-spiced/",
    
    // Socket origins
    SOCKET_ORIGINS: "localhost:8080 http://127.0.0.1:8080/ https://salt-finalproject.herokuapp.com:*",
    
    // API endpoints
    PUNK_API_BASE: "https://api.punkapi.com/v2/beers",
    
    // Chat limits
    CHAT_MESSAGE_LIMIT: 10,
    
    // Random beer count for homepage
    RANDOM_BEER_COUNT: 8
};

module.exports = CONFIG;
