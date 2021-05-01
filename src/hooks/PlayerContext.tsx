import { createContext, useState, ReactNode } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}
type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    playPrevious: () => void;
    playNext: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    hasNext: boolean;
    isLooping: boolean;
    hasPrevious: boolean;
    toggleShuffling: ()=>void;
    isShuffling: boolean;
    setPlayingState: (state:boolean) => void;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
}
type PlayerContextProviderProps = {
  children: ReactNode
}
export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider ({children}:PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    function play(episode: Episode) {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
    }
    function playList(list: Episode[], index: number) {
      setEpisodeList(list)
      setCurrentEpisodeIndex(index)
      setIsPlaying(true)
    }
    function togglePlay () {
      setIsPlaying(!isPlaying);
    }
    function toggleShuffling () {
      setIsShuffling(!isShuffling);
    }
    function toggleLoop () {
      setIsLooping(!isLooping);
    }
    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = (currentEpisodeIndex + 1) < episodeList.length;
    function playNext() {
      if (isShuffling) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length) 
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
      } else if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
    }
    function playPrevious() {
      if(hasPrevious){
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
    }
    function setPlayingState (state:boolean) {
      setIsPlaying(state);
    }
    return (
      <PlayerContext.Provider value={{
        setPlayingState, 
        togglePlay,
        episodeList,
        playNext,
        playPrevious,
        currentEpisodeIndex,
        play, 
        isPlaying,
        playList,
        hasNext,
        hasPrevious,
        toggleLoop,
        isLooping,
        toggleShuffling,
        isShuffling 
      }}>
        {children}
      </PlayerContext.Provider>
    )
}
