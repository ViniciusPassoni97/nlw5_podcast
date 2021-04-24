import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurarionToTime } from '../utils/convertDurarionToTime';
import styled from './home.module.scss';

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
  episodes: Episodes[]
}

export default function Home(props: propsGetStaticProps) {
  return (
    <div className={styled.homePage}>
      <section className={styled.latestEpisodes}>
          <h2>Últimos lançamentos</h2>
          <ul>
            
          </ul>
      </section>
      <section className={styled.allEpisodes}>

      </section>
      <p>{JSON.stringify(props.episodes)}</p>
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
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurarionToTime(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
    }
  })

  return {
    props: {
      episodes: episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
