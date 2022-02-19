import React, { useState } from "react";

const PokeContext = React.createContext({
  pokemonTarget: {},
  setPokemonTarget: () => {},
});

export const PokeContextProvider = (props) => {
  const [pokemonTarget, setPokemonTarget] = useState({});

  return (
    <PokeContext.Provider value={{ pokemonTarget, setPokemonTarget }}>
      {props.children}
    </PokeContext.Provider>
  );
};

export default PokeContext;
