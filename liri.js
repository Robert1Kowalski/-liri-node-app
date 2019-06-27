// require("dotenv").config();
var keys = require("./key.js");
var fs = require('fs'); //file system
// var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require('inquirer');
var axios = require('axios')
var moment = require('moment')
// var spotify = new Spotify(keys.spotify);


var command;
var search;
var task;
var doWhat;

prompt();
function prompt() {
    inquirer.prompt([{
        type: "input",
        message: "What can I do for you?",
        name: "task",
    }]).then(function (inquirerResponse) {
        task = inquirerResponse.task.split(" ");
        command = task[0];
        search = task.slice(1).join('');
        doTask(command,search)
    
    })


}

// node liri.js spotify-this-song '<song name here>'

// This will show the following information about the song in your terminal/bash window


// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from


// If no song is provided then your program will default to "The Sign" by Ace of Base.
// You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.
// The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a client id and client secret:
// Step One: Visit https://developer.spotify.com/my-applications/#!/
// Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.
// Step Three: Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.
// Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the node-spotify-api package.






// node liri.js concert-this <artist/band name here>
// This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")