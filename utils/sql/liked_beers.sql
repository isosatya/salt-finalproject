DROP TABLE IF EXISTS liked_beers;

CREATE TABLE liked_beers
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    beer_id INTEGER NOT Null
)
