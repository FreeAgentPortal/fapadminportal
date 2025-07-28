import React from "react";
import Link from "next/link";
import { Avatar, Tag, Typography } from "antd";
import { CalendarOutlined, UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { NewsItemProps } from "./NewsItem.types";
import styles from "./NewsItem.module.scss";
import Image from "next/image";

const { Title, Text, Paragraph } = Typography;

const NewsItem: React.FC<NewsItemProps> = ({
  news,
  variant = "large",
  showImage = true,
  showExcerpt = true,
  showMetadata = true,
  maxExcerptLength = 150,
  className = "",
}) => {
  // Extract clean text from HTML content
  const stripHtml = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&[^;]+;/g, " ")
      .trim();
  };

  // Truncate text to specified length
  const truncateText = (text: string, maxLength: number): string => {
    const cleanText = stripHtml(text);
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength).trim() + "...";
  };

  // Format date relative to now
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

      return date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  // Get featured image URL
  const getFeaturedImage = (): string | null => {
    return news.yoast_head_json?.og_image?.[0]?.url || null;
  };

  // Get reading time
  const getReadingTime = (): string => {
    return news.yoast_head_json?.twitter_misc?.["Est. reading time"] || "2 min read";
  };

  // Get author name
  const getAuthorName = (): string => {
    return news.yoast_head_json?.author || "NFL Draft Diamonds";
  };

  // Clean title
  const getCleanTitle = (): string => {
    return stripHtml(news.title.rendered);
  };

  // Get excerpt
  const getExcerpt = (): string => {
    const excerpt = news.excerpt.rendered;
    return variant === "small" ? truncateText(excerpt, maxExcerptLength) : stripHtml(excerpt);
  };

  const containerClasses = [styles.newsItem, styles[variant], className].filter(Boolean).join(" ");

  if (variant === "small") {
    return (
      <Link href={news.link} className={containerClasses} target="_blank" rel="noopener noreferrer">
        <article className={styles.articleContent}>
          {showImage && getFeaturedImage() && (
            <div className={styles.imageContainer}>
              <Image src={getFeaturedImage()!} alt={getCleanTitle()} className={styles.featuredImage} loading="lazy" width={300} height={200} />
            </div>
          )}

          <div className={styles.contentContainer}>
            <Title level={5} className={styles.title}>
              {getCleanTitle()}
            </Title>

            {showExcerpt && <Text className={styles.excerpt}>{getExcerpt()}</Text>}

            {showMetadata && (
              <div className={styles.metadata}>
                <span className={styles.metaItem}>
                  <CalendarOutlined />
                  <Text type="secondary">{formatDate(news.date)}</Text>
                </span>
                <span className={styles.metaItem}>
                  <ClockCircleOutlined />
                  <Text type="secondary">{getReadingTime()}</Text>
                </span>
              </div>
            )}
          </div>
        </article>
      </Link>
    );
  }

  // Large variant
  return (
    <Link href={news.link} className={containerClasses} target="_blank" rel="noopener noreferrer">
      <article className={styles.articleContent}>
        {showImage && getFeaturedImage() && (
          <div className={styles.imageContainer}>
            <Image src={getFeaturedImage()!} alt={getCleanTitle()} className={styles.featuredImage} loading="lazy" width={300} height={200} />
          </div>
        )}

        <div className={styles.contentContainer}>
          <div className={styles.header}>
            <Title level={3} className={styles.title}>
              {getCleanTitle()}
            </Title>

            {showMetadata && (
              <div className={styles.authorSection}>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text strong>{getAuthorName()}</Text>
              </div>
            )}
          </div>

          {showExcerpt && <Paragraph className={styles.excerpt}>{getExcerpt()}</Paragraph>}

          {showMetadata && (
            <div className={styles.footer}>
              <div className={styles.metadata}>
                <span className={styles.metaItem}>
                  <CalendarOutlined />
                  <Text type="secondary">{formatDate(news.date)}</Text>
                </span>
                <span className={styles.metaItem}>
                  <ClockCircleOutlined />
                  <Text type="secondary">{getReadingTime()}</Text>
                </span>
              </div>

              <div className={styles.tags}>
                {news.categories.length > 0 && <Tag color="blue">Category {news.categories[0]}</Tag>}
                {news.sticky && <Tag color="gold">Featured</Tag>}
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default NewsItem;
