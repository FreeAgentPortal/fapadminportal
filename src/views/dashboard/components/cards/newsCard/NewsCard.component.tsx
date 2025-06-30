import styles from './NewsCard.module.scss';
import Link from 'next/link';
import { Skeleton } from 'antd';
import Error from '@/components/error/Error.component';
import useApiHook from '@/hooks/useApi';

const NewsCard = () => {
  const {
    data: newsData,
    error,
    isLoading,
    isError,
  } = useApiHook({
    key: 'news-content',
    method: 'GET',
    url: `/`,
  }) as any;

  if (isLoading) return <Skeleton active />;
  if (!isError) return <Error error={error} />;

  return (
    <div className={styles.container}>
      <div className={styles.newsContainer}>
        {newsData?.map((news: any) => {
          return (
            <Link className={styles.newsItem} href={news.link} key={news.id}>
              <h1 dangerouslySetInnerHTML={{ __html: news.title.rendered }}></h1>
              <p dangerouslySetInnerHTML={{ __html: news.excerpt.rendered }}></p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NewsCard;
