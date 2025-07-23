import styles from "./NewsCard.module.scss";
import { Skeleton } from "antd";
import Error from "@/components/error/Error.component";
import useApiHook from "@/hooks/useApi";
import NewsItem from "@/components/newsItem/NewsItem.component";
import { NewsItemData } from "@/components/newsItem/NewsItem.types";

const NewsCard = () => {
  const {
    data: newsData,
    error,
    isLoading,
    isError,
  } = useApiHook({
    key: "news-content",
    method: "GET",
    url: `/feed/articles?limit=3`,
  }) as any;

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  return (
    <div className={styles.container}>
      <div className={styles.newsContainer}>
        {newsData?.payload?.map((news: NewsItemData) => (
          <NewsItem
            key={news.id}
            news={news}
            variant="small"
            showImage={true}
            showExcerpt={true}
            showMetadata={true}
            maxExcerptLength={100}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCard;
