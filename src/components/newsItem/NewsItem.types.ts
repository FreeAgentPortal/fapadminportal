export interface NewsItemData {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    [key: string]: any;
  };
  categories: number[];
  tags: number[];
  class_list: string[];
  yoast_head_json?: {
    og_image?: Array<{
      width: number;
      height: number;
      url: string;
      type: string;
    }>;
    twitter_misc?: {
      "Est. reading time"?: string;
      "Written by"?: string;
    };
    author?: string;
  };
}

export interface NewsItemProps {
  news: NewsItemData;
  variant?: "small" | "large";
  showImage?: boolean;
  showExcerpt?: boolean;
  showMetadata?: boolean;
  maxExcerptLength?: number;
  className?: string;
}
