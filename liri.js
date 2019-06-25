require("dotenv").config();
var keys = require("./keys.js");
var fs = require('fs'); //file system
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require('inquirer');
var axios = require('axios')
var moment = require('moment')
var spotify = new Spotify(keys.spotify);

inquirer 
.prompt({
    type: "list",
    name: "media_choice",
    message: "What would you like to look up?",
    choices: ["concert", "song", "movie"]

})

const command = process.argv[2];
const userInput = process.argv.slice(3).join("+")




// node liri.js concert-this <artist/band name here>
// This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")