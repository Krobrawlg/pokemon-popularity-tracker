import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";

import { TwitterApi } from "twitter-api-v2";
import { TwitterApiV2Settings } from "twitter-api-v2";

import Image from "next/image";
import PokeContext from "../../context/poke-context";

function PokemonPage(props) {
  const router = useRouter();

  // console.log(props.tweetCountData);

  const name = router.query.pokemonName;
  const url = router.query.url;

  const [pokePageData, setPokePageData] = useState({});

  const pokeCtx = useContext(PokeContext);

  const [tweetData, setTweetData] = useState([]);
  const [tweetCount, setTweetCount] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    // function findTweetTotal(array) {
    //   const countArray = array.map((tweet) => {
    //     tweet.count;
    //   });
    //   const tweetTotal = countArray.reduce((prev, curr) => {
    //     prev + curr;
    //   });
    //   console.log(`tweet total ${countArray}`);
    //   setTweetCount(tweetTotal);
    // }

    function formatTweetData() {
      let tweetTotal = 0;
      const tweetArray = [];
      props.tweetCountData.forEach((tweet) => {
        tweetArray.push({
          time: tweet.end,
          count: tweet.tweet_count,
        });
        tweetTotal += tweet.tweet_count;
        return tweetArray, tweetTotal;
      });
      setTweetData(tweetArray);
      setTweetCount(tweetTotal);
      console.log(tweetTotal);

      // tweetArray.forEach((tweet) => {
      //   console.log(`count ${tweet.count}`);
      // });
    }
    formatTweetData();
  }, [props.tweetCountData]);

  // useEffect(() => {
  //   tweetData.forEach((tweet) => {
  //     console.log(`tweet data ${tweet.time}`);
  //   });
  // }, [tweetData]);

  useEffect(() => {
    async function fetchPicture() {
      try {
        console.log(`url ${url}`);
        const response = await fetch(url);
        const pokeData = await response.json();
        setPokePageData(pokeData);
        setImageSrc(pokeData.sprites.other["official-artwork"].front_default);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPicture();
  }, [url]);

  // async function getHot() {
  //   const data = await fetch("/twitter-counter");
  //   console.log(data);
  // }

  return (
    <>
      <h1>{name}</h1>
      <h2>How hot?</h2>
      {tweetCount && <h3>{tweetCount} tweets in the past week.</h3>}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={`sprite of ${name}`}
          // layout="fill"
          height="300px"
          width="300px"
        />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  TwitterApiV2Settings.debug = true;

  const pokeName = context.params.pokemon;

  try {
    const client = new TwitterApi(`${process.env.TWITTER_BEARER_TOKEN}`);
    const pokeTweets = await client.v2.tweetCountRecent(pokeName);

    // const tweetArray = pokeTweets.map((tweet) => ({
    //   time: tweet.end,
    //   count: tweet.tweet_count,
    // }));

    return {
      props: {
        tweetCountData: pokeTweets.data,
      },
    };
  } catch (err) {
    return {
      props: {
        err: `${err}`,
      },
    };
  }
}
export default PokemonPage;
