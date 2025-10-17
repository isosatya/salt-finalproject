# Hoppy Town - Beer Social Network

Final Project for coding bootcamp at SALT Academy in Berlin (2019).

This project is about a website for craft beer lovers. The same connects to the API provided by the scottish beer company called Brewdog. Users can create their profile by entering basic information about them, including location.

## About the App

Hoppy Town is a social network for craft beer enthusiasts where users can:
- Explore beers from the Brewdog API
- Create personal beer cellar collections
- Chat with other beer lovers
- Share their favorite brews

## Features

<img width="1274" alt="Screenshot 2019-08-01 at 10 28 04" src="https://user-images.githubusercontent.com/29626222/62279617-bf34d100-b44a-11e9-8913-c60cc299da1f.png">

### Beer Discovery & Search
Once inside, users can explores the random list of beers generated through the API, or do their own search by entering a parameter in the search field. This then provides a list of hit results in which the user can explore the profile of each beer individually.

<img width="1274" alt="Screenshot 2019-08-01 at 10 30 25" src="https://user-images.githubusercontent.com/29626222/62279710-e5f30780-b44a-11e9-8597-cefff6bb2552.png">

### Beer Profile & Details
On the beer profile, all the characteristics of the beer and displayed, including matching food suggestions, which are links that lead to the recipe search of the mentioned dish.

<img width="1275" alt="Screenshot 2019-08-01 at 10 34 09" src="https://user-images.githubusercontent.com/29626222/62279738-f73c1400-b44a-11e9-9593-7f74ae002a8d.png">

### Personal Beer Cellar
After reading throught the characteristics of the beer, users can then add the specific beer to their own Cellar Collection, where they can keep a list of their favorite beers. Each added beer can be removed at any time.

<img width="1279" alt="Screenshot 2019-08-01 at 10 29 40" src="https://user-images.githubusercontent.com/29626222/62279779-07ec8a00-b44b-11e9-8452-5ab6565d3b2c.png">

### Social Chat Features
Users can also interact with each other via the public chat channel, or even have private chats amongst them, by clicking on their picture icon. Users can also filter the online users list based on their location. The purpose of this filter option is that if desired, users could be filtered based on the locations at which brewdogs has a franchise. For the purpose of simplifying, however, the filtering is at the moment done based on origin location of the users.

<img width="1278" alt="Screenshot 2019-08-01 at 10 31 47" src="https://user-images.githubusercontent.com/29626222/62279810-176bd300-b44b-11e9-889e-fb90aeba6fad.png">

### Design Philosophy
Direct social network actions, like "adding friends" is not included as a feature on the website, and the reason behind it is that for the purposes of this website having a friends network does not add any value. The main goal of the application is that users explore the different beer offerings that Brewdog provides.

## Tech Stack

### Frontend
- **React** - Component-based UI framework
- **Redux** - State management
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **PostgreSQL** - Database
- **spiced-pg** - PostgreSQL client

### External Services
- **Punk API** - Beer data from Brewdog
- **Mapbox API** - Location services
- **Amazon S3** - Image storage
- **Heroku** - Deployment platform

### Development Tools
- **Webpack** - Module bundler
- **Babel** - JavaScript transpiler
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## Project Structure

```
salt-finalproject/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── actions.js           # Redux action creators
│   │   ├── axios.js             # HTTP client configuration
│   │   ├── beerCellar.js        # User's beer collection
│   │   ├── beerProfile.js       # Individual beer details
│   │   ├── chatting.js          # Public chat functionality
│   │   ├── findBeer.js          # Beer search component
│   │   ├── header.js            # Navigation header
│   │   ├── likeButton.js        # Add/remove beer from cellar
│   │   ├── login.js             # User login form
│   │   ├── otherProfile.js      # View other users' profiles
│   │   ├── popup.js             # Modal popup component
│   │   ├── privChatting.js      # Private messaging
│   │   ├── profile.js           # User profile page
│   │   ├── profilePic.js        # Profile picture component
│   │   ├── reducers.js          # Redux reducers
│   │   ├── registration.js      # User registration form
│   │   ├── socket.js            # Socket.io configuration
│   │   ├── uploader.js          # Image upload modal
│   │   ├── welcome_logo.js      # Welcome page logo
│   │   └── wrapperWelcome.js    # Welcome page wrapper
│   ├── constants/               # Application constants
│   │   └── index.js             # API URLs, default images, etc.
│   ├── utils/                   # Utility functions
│   │   ├── dateFormat.js        # Date formatting utility
│   │   └── ingredients.js       # Beer ingredient filtering
│   ├── App.js                   # Main application component
│   └── start.js                 # Application entry point
├── utils/                       # Backend utilities
│   ├── bc.js                    # Password hashing utilities
│   ├── db.js                    # Database query functions
│   └── sql/                     # Database schema files
│       ├── chats.sql            # Chat messages table
│       ├── liked_beers.sql      # User beer preferences
│       ├── pictures.sql         # User uploaded images
│       ├── privatechats.sql     # Private messages table
│       └── users.sql            # User accounts table
├── public/                      # Static assets
│   ├── styles.css               # Global styles
│   ├── beer_bottle.png          # Default beer image
│   ├── beer_logo.png            # App logo
│   └── hop.png                  # Hop icon
├── index.js                     # Main server file
├── s3.js                        # Amazon S3 integration
├── build.js                     # Webpack build configuration
├── config.json                  # Application configuration
└── index.html                   # HTML template
```
