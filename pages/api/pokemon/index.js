import { TwitterApi } from "twitter-api-v2";
import { TwitterApiV2Settings } from "twitter-api-v2";

export default async function handler(req, res) {
  TwitterApiV2Settings.debug = true;
  const pokemonName = req.query.name;
  const client = new TwitterApi(`${process.env.TWITTER_BEARER_TOKEN}`);
  try {
    const pokeTweets = await client.v2.tweetCountRecent(`${pokemonName}`);
    res.status(200).json(pokeTweets);
  } catch (err) {
    console.log(err);
  }
}
