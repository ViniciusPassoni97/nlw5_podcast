import { GetStaticProps } from 'next';
import Image from 'next/image';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import { convertDurarionToTime } from '../utils/convertDurarionToTime';
import styled from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../hooks/PlayerContext';

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  description: string
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}
type propsGetStaticProps = {
  latestEpisodes: Episodes[],
  allEpisodes: Episodes[]
}

export default function Home({ allEpisodes, latestEpisodes }: propsGetStaticProps) {
  const { playList } = useContext(PlayerContext);
  const episodesList = [...latestEpisodes, ...allEpisodes];
  return (
    <div className={styled.homePage}>
      <section className={styled.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styled.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a >{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button" onClick={() => playList(episodesList, index)}>
                  <img src='/play-green.svg' alt='Tocar episódio' />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styled.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th style={{ width: 100 }}>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td width={72}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>
                    {episode.members}
                  </td>
                  <td>
                    {episode.publishedAt}
                  </td>
                  <td>
                    {episode.durationAsString}
                  </td>
                  <td>
                    <button type="button" onClick={() => playList(episodesList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar Episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurarionToTime(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
