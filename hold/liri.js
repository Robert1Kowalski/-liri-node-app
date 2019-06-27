require("dotenv").config();
var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require('inquirer');
var CFonts = require('cfonts');
var fs = require('fs');


var moment = require('moment');
var Table = require('cli-table');


var command;
var search;
var task;
var doWhat;


console.log('\n')
CFonts.say('LIRI', { font: 'block', align: 'center', colors: ['white', 'blue'], letterSpacing: 2, space: false });
CFonts.say('Like SIRI but.... not as smart', { font: 'console', align: 'center', letterSpacing: 2, space: false });


prompt();




function prompt() {
    CFonts.say('Give me a command and what you would like to search!\n' +
        'Options: spotify, movie, concert', { font: 'console', align: 'center' });
    inquirer.prompt([{
        type: "input",
        message: "What can I do for you?",
        name: "task",
    }]).then(function (inquirerResponse) {
        task = inquirerResponse.task.split(" ");
        command = task[0];
        search = task.slice(1).join('');
        doTask(command, search)

    })


}
function doTask(command, search) {
    switch (command) {
        case 'concert':
            bandsInTown(search);
            break;
        case "spotify":
            spotifySearch(search);
            break;
        case "movie":
            imdbSearch(search);
            break;
        case "do":
            doWhatitSays(search)
        case 'exit':
            process.exit();
            break;
        default:
            console.log(`I dont konw what to do with the command ${command}`);
            prompt()


    }
}







function imdbSearch(search) {
    if (!search) {
        search = 'Mr.Nobody';
        console.log("You didn't give me a movie title")
        promptAgain();

    } else {
        var queryURL = "http://www.omdbapi.com/?i=tt3896198&apikey=5a6546cc&t=" + search;
        axios.get(queryURL).then(
            function (res) {
                var movie = res.data;
                var title = movie.Title;
                var year = movie.Year;
                var imdbRate = movie.Ratings[0].Value;
                var rottenRate = movie.Ratings[1].Valie;
                var country = moive.Country;
                var language = movie.Language;
                var play = wrap(movie.Plot)
                var actors = moive.Actors

                console.log(`${title}\n\n${year} - ${country} - ${langugae}\n\nStarring: ${actors}\n\nIMDB Rating: ${imdbRate} / Rotten Tomatoes Rating : ${rottenRate}} `)
                promptAgain();
            }
        )
    }
}
function bandsInTown(search) {

    // if no search is entered, message will appear
    if (!search) {
        CFonts.say('\nPlease enter a band or artist for results.', { font: 'console', align: 'center', space: false });
        prompt();
    } else {

        // enters search into bands in town api url
        var queryURL = 'https://rest.bandsintown.com/artists/' + search + '/events?app_id=codingbootcamp/';

        axios.get(queryURL).then(
            function (res) {

                console.log('\nupcoming ' + search + ' tour dates:\n');

                var table = new Table({
                    head: ['Date', 'City', 'Time', 'Venue']
                    , colWidths: [25, 25, 10, 30]
                });

                for (var i = 0; i < res.data.length; i++) {

                    var city = res.data[i].venue.city;
                    var country = res.data[i].venue.country;
                    var venue = res.data[i].venue.name;
                    var date = res.data[i].datetime;
                    var region = res.data[i].venue.region;


                    var day = moment(date).format('dddd');
                    var dateFormat = moment(date).format('MMMM Do, YYYY');
                    var timeFormat = moment(date).format('h:mma');
                    // console.log(day);
                    var wrap = require('wordwrap')(30);
                    table.push(
                        [day + '\n' + dateFormat, city + ', ' + region + '\n' + country, timeFormat, wrap(venue)]
                    );

                    
                    // console.log(city + ', ' + country + ' - ' + venue);
                    // // console.log(moment(date, );
                    // console.log('\n---------\n');
                    
                }
                console.log(table.toString());
                // console.log(res.data[0].venue);
                // }
                promptAgain();
            }
        )
    };
}
// searches artists or songs on spotify
function spotifySearch(search) {

    var searchtype;

    // if no artist or song is entered, default search result will show
    if (!search) {

        console.log(boxen("You didn't give me a song or artist, so here's one I like:\n\n" + '"' + 'The Sign" by Ace of Base\n\nFrom the album "The Sign (US Album) [Remastered]"\nReleased 1993\n\n' + "Here's a link to the song on Spotify:\n     https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE", { padding: { top: 2, bottom: 2, left: 5, right: 5 }, margin: { top: 1, bottom: 1 }, borderColor: 'cyan', borderStyle: 'double', float: 'center', backgroundColor: '#111', color: '#fff' }));


        promptAgain();

    } else if (search === doWhat) {
        trackSearch(search);
    } else {


        inquirer.prompt([
            {
                type: 'list',
                message: 'Is this:',
                choices: ['an Artist?', new inquirer.Separator('or'), 'a Song?'],
                name: 'searchtype'
            }]).then(function (inquirerResponse) {
                searchtype = inquirerResponse.searchtype;

                if (searchtype === 'an Artist?') {
                    spotify.search({
                        type: 'artist',
                        query: search,
                        limit: 20
                    }, function (err, data) {
                        if (err) {
                            return console.log('error occurred');
                        } else {
                            // console.log(data.artists.items[0]);
                            var artist = data.artists.items[0];
                            var name = artist.name;
                            var genres = artist.genres[0] + ', ' + artist.genres[1];
                            var link = artist.external_urls.spotify;

                            console.log(boxen(`${name}\n\nGenre: ${genres}\n\nHere's a link to the artist on Spotify:\n     ${link}`, { padding: { top: 2, bottom: 2, left: 5, right: 5 }, margin: { top: 1, bottom: 1 }, borderColor: 'cyan', borderStyle: 'double', float: 'center', backgroundColor: '#111', color: '#fff' }));

                            promptAgain();

                        }
                    })
                };


                if (searchtype === 'a Song?') {
                    trackSearch(search);
                }
            });
    }
}

function trackSearch(search) {
    spotify.search({
        type: 'track',
        query: search,
        limit: 20
    }, function (err, data) {
        if (err) {
            return console.log('error occurred');
        } else {

            var track = data.tracks.items[0];
            var name = track.name;
            var album = track.album.name;
            var date = track.album.release_date;
            var artist = track.artists[0].name;
            var link = track.external_urls.spotify;


            console.log(boxen(`"${name}" by ${artist}\n\nFrom the album "${album}"\n     Released ${date}\n\nHere's a link to the song on Spotify:\n     ${link}`, { padding: { top: 2, bottom: 2, left: 5, right: 5 }, margin: { top: 1, bottom: 1 }, borderColor: 'cyan', borderStyle: 'double', float: 'center', backgroundColor: '#111', color: '#fff' }));


            promptAgain();

        }
    })
};

function promptAgain() {
    inquirer.prompt({
        type: "list",
        message: "Would you liketo do another search?",
        choices: ['yes', 'no'],
        name: "another"


    }).then(function (inquirerResponse) {
        if (inquirerResponse.another == 'yes') {
            prompt();

        } else if (inquirerResponse.another === 'no') {
            console.log('/n')
            console.log("goodbye")
            process.exit()
        }
    })
}
function doWhatItSays(search) {

    if (search === 'what it says') {
        fs.readFile('random.txt', 'utf8', function (error, data) {

            if (error) {
                return console.log(error);
            }


            var dataArr = data.split(",");

            command = dataArr[0];
            search = dataArr[1];
            doWhat = search;

            doTask(command, search);

        });
    } else {
        console.log(`I don't know the command "${command} ${search}". I have failed you. :(`);
        promptAgain();
    }
}

// STILL BROKEN:
//update readme
//link spotify 
//link bands api 
