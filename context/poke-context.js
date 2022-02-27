import React, { useState } from "react";

const PokeContext = React.createContext({
  pokemonTarget: {},
  setPokemonTarget: () => {},
  pokeList: [],
  setPokeList: () => {},
});

export const PokeContextProvider = (props) => {
  const [pokemonTarget, setPokemonTarget] = useState({});
  const [pokeList, setPokeList] = useState([]);

  return (
    <PokeContext.Provider
      value={{ pokemonTarget, setPokemonTarget, pokeList, setPokeList }}
    >
      {props.children}
    </PokeContext.Provider>
  );
};

export default PokeContext;
