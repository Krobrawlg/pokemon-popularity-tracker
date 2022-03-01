import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";

import { TwitterApi } from "twitter-api-v2";
import { TwitterApiV2Settings } from "twitter-api-v2";

import Image from "next/image";
import PokeContext from "../../context/poke-context";

import TweetChart from "../../components/TweetChart";

import styles from "../../styles/pokePage.module.css";

function PokemonPage({ tweetCountData }) {
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
    function formatTweetData() {
      let tweetTotal = 0;
      const tweetArray = [];
      tweetCountData.forEach((tweet) => {
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
    }
    formatTweetData();
  }, [tweetCountData]);

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

  const pokeSelection = useRef();

  const [targetPokemon, setTargetPokemon] = useState(null);
  const [imageSrc2, setImageSrc2] = useState(null);
  const [tweetData2, setTweetData2] = useState([]);
  const [tweetCount2, setTweetCount2] = useState(null);

  async function selectPokemonHandler(event) {
    event.preventDefault();

    const pokemonName = pokeSelection.current.value;
    setTargetPokemon(pokemonName);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/
${pokemonName.toLowerCase()}`);
    const pokeData = await response.json();
    setImageSrc2(pokeData.sprites.other["official-artwork"].front_default);

    const tweetResponse = await fetch(`/api/pokemon?name=${pokemonName}`);
    const tweetJson = await tweetResponse.json();
    setTweetData2(tweetJson);
    const tweetCount = tweetJson.meta.total_tweet_count;
    setTweetCount2(tweetCount);
  }

  let optionsDisplay = pokeCtx.pokeList.map((pokemon, index) => (
    <option key={index} value={pokemon.name}>
      {pokemon.name}
    </option>
  ));
  return (
    <>
      <div className={`${styles.split} ${styles.left} ${styles.centered}`}>
        <h1 className={styles.h1}>{name}</h1>
        <h2 className={styles.h2}>How hot?</h2>
        {tweetCount && (
          <h3 className={styles.h3}>
            <span className={styles["tweet-count"]}>{tweetCount} </span> tweets
            in the past week.
          </h3>
        )}
        {imageSrc && (
          <div className={styles["image-container"]}>
            <div className={styles.triangle} />

            <Image
              className={styles.image}
              src={imageSrc}
              alt={`sprite of ${name}`}
              // layout="fill"
              height="300px"
              width="300px"
            />
          </div>
        )}
        <div className={`${styles.split} ${styles.right}`}>
          <h1 className={`${styles.h1} ${styles["h1-right"]}`}>
            Pick a Pocket Monster to Compare
          </h1>
          {/* {!targetPokemon && ( */}
          <form
            className={styles["pokemon-selector"]}
            onSubmit={selectPokemonHandler}
          >
            <input
              className={styles.input}
              id="pokemon-select"
              list="pokemon"
              ref={pokeSelection}
            />
            <datalist className={styles.dataList} id="pokemon">
              {optionsDisplay}
            </datalist>
            <button className={styles["search-button"]}>
              Engage Popularity Tracker
            </button>
          </form>
          {tweetCount2 && <h2>{tweetCount2} tweets in the past week.</h2>}
          {imageSrc2 && (
            <>
              <div className={`${styles.triangle} ${styles.pink}`} />

              <Image
                src={imageSrc2}
                alt={`a picture of ${targetPokemon}`}
                height="300px"
                width="300px"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  TwitterApiV2Settings.debug = true;

  const pokeName = context.params.pokemon;

  try {
    const client = new TwitterApi(`${process.env.TWITTER_BEARER_TOKEN}`);
    const pokeTweets = await client.v2.tweetCountRecent(pokeName);

    // const pokePicture = await pokeData.sprites.other["official-artwork"]
    //   .front_default;
    // const tweetArray = pokeTweets.map((tweet) => ({
    //   time: tweet.end,
    //   count: tweet.tweet_count,
    // }));

    return {
      props: {
        tweetCountData: pokeTweets.data,
        // pokePicture: pokePicture,
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
