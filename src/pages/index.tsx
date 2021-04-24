import { GetStaticProps } from 'next';
import { api } from '../services/api';

type Episodes = {
  id: string,     
  title: string,
  members: string,
  published_at: string,
}
type propsGetStaticProps = {
  episodes: Episodes[]
}

export default function Home(props:propsGetStaticProps) {
  return (
    <>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

export const getStaticProps:GetStaticProps= async() =>{
  const {data} = await api.get('/episodes', { 
    params: { 
      _limit: 12, 
      _sort: 'published_at',
      _order: 'desc',
    }
   });

  return {
    props: {
      episodes: data,
    },
    revalidate: 60*60*8,
  }
}
