
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';

import { api } from '../../services/api';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    members: string,
    published_at: string,
    description: string,
    duration_as_string: string,
    duration: number,
    url: string,
}

type EpisodeProps = {
    episode: Episode,
}

export default function Episode({ episode }: EpisodeProps) {
    //const router = useRouter();

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">

                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button">
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.published_at}</span>
                <span>{episode.duration_as_string}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}


export const getStaticProps: GetStaticProps = async (context: any) => {
    const { slug } = context.params;
    const { data } = await api.get(`episodes/${slug}`, {
        params: {
            _limit: 12,
            sort: 'published_at',
            order: 'desc',
        }
    });
    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        published_at: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration_as_string: convertDurationToTimeString(Number(data.file.duration)),
        duration: Number(data.file.duration),
        description: data.description,
        url: data.file.url
    };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24,
    }
}