// required files and npm packages needed for app
require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var moment = require("moment");

var Spotify = require("node-spotify-api");

var fs = require("fs");

// global variables for input parameters
var liriArgs = process.argv.slice(3).join(" ");

var concert = "concert-this";

var song = "spotify-this-song";

var movie = "movie-this";

var whatItSays = "do-what-it-says";

// switch case statement for app logic
switch (process.argv[2]) {
  case concert:
    logCommands();
    concertSearch();
    break;

  case song:
    logCommands();
    songSearch();
    break;

  case movie:
    logCommands();
    movieSearch();
    break;

  case whatItSays:
    logCommands();
    wildCard();
    break;
}

// bandsintown api call to search for shows and concerts of artists
function concertSearch() {
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    liriArgs +
    "/events?app_id=" +
    keys.apiKeys.bandsInTown;

  axios
    .get(queryURL)
    .then(response => {
      response.data.forEach(element => {
        console.log("*****venue data*****");
        console.log("Venue:", element.venue.name);
        console.log("Location:", element.venue.city + " , " + element.venue.country);
        console.log("Date of Show:", moment(element.datetime).format("MM/DD/YYYY"));
        console.log("*****venue end******");
      });
    })
    .catch(err => {
      console.log(err);
    });
}

// OMDB api call to search for movies
function movieSearch() {
  if (liriArgs) {
    var queryURL =
      "http://www.omdbapi.com/?t=" +
      liriArgs.split(" ").join("+") +
      "&y=&plot=short&apikey=" +
      keys.apiKeys.omdb;

    axios
      .get(queryURL)
      .then(response => {
        console.log("+++++++movie data+++++++");
        console.log("Title:", response.data.Title);
        console.log("Year Produced:", response.data.Year);
        console.log("IMDB Rating:", response.data.imdbRating);
        console.log("Rotten Tomatoes Rating:", response.data.Ratings[1].Value);
        console.log("Produced in:", response.data.Country);
        console.log("Language:", response.data.Language);
        console.log("Movie Plot:\n", response.data.Plot);
        console.log("Actors/Actresses:", response.data.Actors);
        console.log("+++++++movie end++++++++");
      })
      .catch(err => {
        console.log(err.config);
      });
  } else {
    axios
      .get("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=" + keys.apiKeys.omdb)
      .then(response => {
        console.log("+++++++movie data+++++++");
        console.log("Title:", response.data.Title);
        console.log("Year Produced:", response.data.Year);
        console.log("IMDB Rating:", response.data.imdbRating);
        console.log(
          "Rotten Tomatoes Rating:",
          response.data.Ratings[1].Source,
          response.data.Ratings[1].Value
        );
        console.log("Produced in:", response.data.Country);
        console.log("Language:", response.data.Language);
        console.log("Movie Plot:\n", response.data.Plot);
        console.log("Actors/Actresses:", response.data.Actors);
        console.log("+++++++movie end+++++++");
      })
      .catch(err => {
        console.log(err.config);
      });
  }
}

// Spotify API call to search for songs
function songSearch() {
  var spotify = new Spotify({ id: keys.apiKeys.id, secret: keys.apiKeys.secret });

  if (liriArgs) {
    spotify
      .search({ type: "track", query: liriArgs })
      .then(response => {
        var reply = response.tracks.items;
        reply.forEach(element => {
          console.log("=======spotify data=======");
          console.log("Artist:", element.album.artists[0].name);
          console.log("Song Title:", element.name);
          console.log("Preview:", element.preview_url);
          console.log("Album:", element.album.name);
          console.log("=======spotify end=======");
        });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    spotify
      .search({ type: "track", query: "The Sign", limit: 1 })
      .then(response => {
        var search = response.tracks.items[0];
        console.log("=======spotify data=======");
        console.log("Artist:", search.album.artists[0].name);
        console.log("Song Title:", search.name);
        console.log("Preview:", search.preview_url);
        console.log("Album:", search.album.name);
        console.log("=======spotify end=======");
      })
      .catch(err => {
        console.log(err);
      });
  }
}

// A searched based on what is inside the random text file
function wildCard() {
  fs.readFile("random.txt", "utf8", (error, data) => {
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");

    switch (dataArr[0]) {
      case "spotify-this-song":
        var spotify = new Spotify({ id: keys.apiKeys.id, secret: keys.apiKeys.secret });
        spotify.search({ type: "track", query: dataArr[1], limit: 1 }).then(response => {
          var search = response.tracks.items[0];
          console.log("=======spotify data=======");
          console.log("Artist:", search.album.artists[0].name);
          console.log("Song Title:", search.name);
          console.log("Preview:", search.preview_url);
          console.log("Album:", search.album.name);
          console.log("=======spotify end=======");
        });
        break;
      case "movie-this":
        axios
          .get(
            "http://www.omdbapi.com/?t=" +
              dataArr[1].split(" ").join("+") +
              "&y=&plot=short&apikey=" +
              keys.apiKeys.omdb
          )
          .then(response => {
            console.log("+++++++movie data+++++++");
            console.log("Title:", response.data.Title);
            console.log("Year Produced:", response.data.Year);
            console.log("IMDB Rating:", response.data.imdbRating);
            console.log(
              "Rotten Tomatoes Rating:",

              response.data.Ratings[1].Value
            );
            console.log("Produced in:", response.data.Country);
            console.log("Language:", response.data.Language);
            console.log("Movie Plot:\n", response.data.Plot);
            console.log("Actors/Actresses:", response.data.Actors);
            console.log("+++++++movie end+++++++");
          })
          .catch(err => {
            console.log(err.config);
          });
        break;
      case "concert-this":
        axios
          .get(
            "https://rest.bandsintown.com/artists/" +
              dataArr[1] +
              "/events?app_id=" +
              keys.apiKeys.bandsInTown
          )
          .then(response => {
            response.data.forEach(element => {
              console.log("*****venue data*****");
              console.log("Venue:", element.venue.name);
              console.log("Location:", element.venue.city + " , " + element.venue.country);
              console.log("Date of Show:", moment(element.datetime).format("MM/DD/YYYY"));
              console.log("*****venue end*****");
            });
          })
          .catch(err => {
            console.log(err);
          });
    }
  });
}

// A way to track what commands and arguments are used in the app
function logCommands() {
  var commands =
    "\n" + process.argv[2] + " , " + liriArgs + " , " + moment().format("MM/DD/YYYY, hh:mm:ss A");
  fs.appendFile("log.txt", commands, error => {
    if (error) {
      return console.log(error);
    }
  });
}
