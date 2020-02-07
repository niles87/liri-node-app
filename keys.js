console.log("this is loaded");

exports.apiKeys = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
  omdb: process.env.OMDB,
  bandsInTown: process.env.BANDSINTOWN,
};
