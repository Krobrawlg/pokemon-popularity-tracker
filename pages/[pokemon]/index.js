import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";

import Image from "next/image";
import PokeContext from "../../context/poke-context";

function PokemonPage() {
  const router = useRouter();

  const name = router.query.pokemonName;
  const url = router.query.url;

  const [pokePageData, setPokePageData] = useState({});

  const pokeCtx = useContext(PokeContext);

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

  return (
    <>
      <h1>{name}</h1>
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

// export async function getStaticProps() {
//   try {
//     const response = await fetch(poke);
//   } catch (err) {
//     console.log(error);
//   }
// }
export default PokemonPage;
