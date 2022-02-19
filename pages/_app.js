import "../styles/globals.css";

import { PokeContextProvider } from "../context/poke-context";

function MyApp({ Component, pageProps }) {
  return (
    <PokeContextProvider>
      <Component {...pageProps} />
    </PokeContextProvider>
  );
}

export default MyApp;
