require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var moment = require("moment");

var Spotify = require("node-spotify-api");

var fs = require("fs");

var liriArgs = process.argv.slice(3).join(" ");
console.log(liriArgs);
var concert = "concert-this";

var song = "spotify-this-song";

var movie = "movie-this";

var whatItSays = "do-what-it-says";

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

function concertSearch() {
  var queryURL =
    "https://rest.bandsintown.com/artists/" + liriArgs + "/events?app_id=codingbootcamp";

  console.log(queryURL);
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

function movieSearch() {
  if (liriArgs) {
    var queryURL =
      "http://www.omdbapi.com/?t=" +
      liriArgs.split(" ").join("+") +
      "&y=&plot=short&apikey=trilogy";
    console.log(queryURL);

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
      .get("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy")
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

function songSearch() {
  var spotify = new Spotify(keys.spotify);

  if (liriArgs) {
    spotify
      .search({ type: "track", query: liriArgs, limit: 1 })
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

function wildCard() {
  fs.readFile("random.txt", "utf8", (error, data) => {
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");

    switch (dataArr[0]) {
      case "spotify-this-song":
        var spotify = new Spotify(keys.spotify);
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
              "&y=&plot=short&apikey=trilogy"
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
            "https://rest.bandsintown.com/artists/" + dataArr[1] + "/events?app_id=codingbootcamp"
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

function logCommands() {
  var commands =
    "\n" + process.argv[2] + " , " + liriArgs + " , " + moment().format("MM/DD/YYYY, hh:mm:ss A");
  fs.appendFile("log.txt", commands, error => {
    if (error) {
      return console.log(error);
    }
  });
}
