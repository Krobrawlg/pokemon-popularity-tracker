import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";

import { TwitterApi } from "twitter-api-v2";
import { TwitterApiV2Settings } from "twitter-api-v2";

import Image from "next/image";
import PokeContext from "../../context/poke-context";

function PokemonPage(props) {
  const router = useRouter();

  console.log(props.tweetCountData);

  const name = router.query.pokemonName;
  const url = router.query.url;

  const [pokePageData, setPokePageData] = useState({});

  const pokeCtx = useContext(PokeContext);

  const [tweetCounts, setTweetCounts] = useState([]);

  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`url ${url}`);
        const response = await fetch(url);
        const pokeData = await response.json();
        setPokePageData(pokeData);
        setImageSrc(pokeData.sprites.other["official-artwork"].front_default);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [url]);

  // async function getHot() {
  //   const data = await fetch("/twitter-counter");
  //   console.log(data);
  // }

  return (
    <>
      <h1>{name}</h1>
      <button>How hot?</button>
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

    return {
      props: {
        tweetCountData: pokeTweets,
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
