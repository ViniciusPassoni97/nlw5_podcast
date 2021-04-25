import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { Header } from "../components/Header";
import { Player } from '../components/Player';
import { PlayerContext } from '../hooks/PlayerContext';
import { useState } from 'react';
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}
function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  function togglePlay () {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState (state:boolean) {
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider value={{setPlayingState, togglePlay,episodeList, currentEpisodeIndex, play, isPlaying }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
