import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { convertDurarionToTime } from '../../utils/convertDurarionToTime';

export default function Episodes () {
    const router = useRouter();

    return(
        <h1>{router.query.slug}</h1>
    )
}


export const getStaticProps: GetStaticProps = async (ctx) => {
    const {slug} = ctx.params;

    const {data} = await api.get(`episode/${slug}`)
    
    const episode ={
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurarionToTime(data.file.duration),
        description: data.description,
        url: data.file.url,
      }

    return {
        props: {},
        revalidate: 60*60*24,
    }
}