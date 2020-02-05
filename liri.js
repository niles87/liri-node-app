require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var moment = require("moment");

// var spotify = new Spotify(keys.spotify);

var liriArgs = process.argv.slice(3).join(" ");
console.log(liriArgs);
var concert = "concert-this";

var song = "spotify-this-song";

var movie = "movie-this";

var whatItSays = "do-what-it-says";

if (process.argv[2] === concert) {
  var queryURL =
    "https://rest.bandsintown.com/artists/" + liriArgs + "/events?app_id=codingbootcamp";

  console.log(queryURL);
  axios
    .get(queryURL)
    .then(function(response) {
      response.data.forEach(element => {
        console.log("*****venue data*****");
        console.log(element.venue.name);
        console.log(element.venue.city + " , " + element.venue.country);
        console.log(moment(element.datetime).format("MM/DD/YYYY"));
        console.log("*****venue end*****");
      });
    })
    .catch(function(err) {
      console.log(err);
    });
}

if (process.argv[2] === movie) {
  var queryURL =
    "http://www.omdbapi.com/?t=" + liriArgs.split(" ").join("+") + "&y=&plot=short&apikey=trilogy";
  console.log(queryURL);

  axios
    .get(queryURL)
    .then(function(response) {
      console.log("+++++++movie data+++++++");
      console.log(response.data.Title);
      console.log(response.data.Year);
      console.log(response.data.imdbRating);
      console.log(response.data.Ratings[1].Source, response.data.Ratings[1].Value);
      console.log(response.data.Country);
      console.log(response.data.Language);
      console.log(response.data.Plot);
      console.log(response.data.Actors);
      console.log("+++++++movie end+++++++");
    })
    .catch(function(err) {
      console.log(err.config);
    });
}
