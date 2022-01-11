import { GetStaticProps } from "next";
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';


import { api } from '../services/api';
import convertDurationToTimeString from '../utils/convertDurationToTimeString';

import styles from "./home.module.scss";
import Image from "next/image";
import Link from "next/link";

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
type HomeProps = {
  lastEpisodes: Array<Episode>,
  allEpisodes: Array<Episode>,
}

export default function Home({ lastEpisodes, allEpisodes }: HomeProps) {
  return (
    <>
      <div className={styles.homepage}>

        <section className={styles.latestEpisodes}>
          <h2>Últimos lançamentos</h2>

          <ul>
            {lastEpisodes.map(episode => {
              return (
                <li key={episode.id}>
                  <Image
                    height={192}
                    width={192}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit='cover'
                  />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a > {episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.published_at}</span>
                    <span>{episode.duration_as_string}</span>
                  </div>

                  <button type="button">
                    <img src="/play-green.svg" alt="Play" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>
                      <p>{episode.members}</p>
                    </td>
                    <td style={{ width: 100 }}>
                      <span>{episode.published_at}</span>
                    </td>
                    <td>
                      <span>{episode.duration_as_string}</span>
                    </td>
                    <td>
                      <button type="button">
                        <img src="/play-green.svg" alt="Play" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      sort: 'published_at',
      order: 'desc',
    }
  });
  const episodes = data.map((episode: any) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration_as_string: convertDurationToTimeString(Number(episode.file.duration)),
      duration: Number(episode.file.duration),
      description: episode.description,
      url: episode.file.url
    }
  })
  const lastEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props: {
      lastEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}