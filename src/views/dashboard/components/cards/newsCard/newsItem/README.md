# NewsItem Component Usage Guide

## 🎯 Overview

The `NewsItem` component is a robust, reusable component for displaying news articles with multiple variants and customization options.

## 📦 Component Structure

```
/components/newsItem/
├── NewsItem.component.tsx    - Main component
├── NewsItem.module.scss      - Styling
└── NewsItem.types.ts         - TypeScript interfaces
```

## 🚀 Basic Usage

### Small Variant (List View)

```tsx
import NewsItem from "@/components/newsItem/NewsItem.component";

<NewsItem
  news={newsData}
  variant="small"
  showImage={true}
  showExcerpt={true}
  showMetadata={true}
  maxExcerptLength={100}
/>;
```

### Large Variant (Featured View)

```tsx
<NewsItem
  news={newsData}
  variant="large"
  showImage={true}
  showExcerpt={true}
  showMetadata={true}
  maxExcerptLength={300}
/>
```

## 🎨 Props Configuration

| Prop               | Type                 | Default   | Description                     |
| ------------------ | -------------------- | --------- | ------------------------------- |
| `news`             | `NewsItemData`       | required  | News article data object        |
| `variant`          | `'small' \| 'large'` | `'large'` | Display variant                 |
| `showImage`        | `boolean`            | `true`    | Show featured image             |
| `showExcerpt`      | `boolean`            | `true`    | Show article excerpt            |
| `showMetadata`     | `boolean`            | `true`    | Show date, author, reading time |
| `maxExcerptLength` | `number`             | `150`     | Maximum excerpt characters      |
| `className`        | `string`             | `''`      | Additional CSS classes          |

## 📱 Responsive Behavior

### Small Variant

- **Desktop**: Horizontal layout with image on left
- **Mobile**: Vertical layout with image on top
- **Tablet**: Maintains horizontal layout

### Large Variant

- **Desktop**: Full-width with large header image
- **Mobile**: Stacked layout with smaller image
- **Tablet**: Responsive scaling

## 🎯 Use Cases

### 1. Dashboard News Feed (Current Implementation)

```tsx
// In NewsCard.component.tsx
{
  newsData?.payload?.map((news: NewsItemData) => (
    <NewsItem
      key={news.id}
      news={news}
      variant="small"
      showImage={true}
      showExcerpt={true}
      showMetadata={true}
      maxExcerptLength={100}
    />
  ));
}
```

### 2. Featured Article

```tsx
<NewsItem
  news={featuredNews}
  variant="large"
  showImage={true}
  showExcerpt={true}
  showMetadata={true}
  maxExcerptLength={300}
  className="featured-article"
/>
```

### 3. Minimal News List

```tsx
<NewsItem news={news} variant="small" showImage={false} showExcerpt={false} showMetadata={false} />
```

### 4. Text-Only Cards

```tsx
<NewsItem news={news} variant="large" showImage={false} showExcerpt={true} showMetadata={true} maxExcerptLength={200} />
```

## 🏗️ Data Structure

The component expects WordPress REST API format:

```typescript
interface NewsItemData {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  date: string;
  yoast_head_json?: {
    og_image?: Array<{
      url: string;
      width: number;
      height: number;
    }>;
    author?: string;
    twitter_misc?: {
      "Est. reading time"?: string;
    };
  };
  categories: number[];
  sticky: boolean;
}
```

## 🎨 Styling Features

### Design System Integration

- Uses CSS custom properties for theming
- Follows app's color scheme and typography
- Consistent with Ant Design components

### Interactive States

- Hover animations and transforms
- Focus states for accessibility
- Smooth transitions

### Visual Hierarchy

- Typography scaling per variant
- Proper spacing and layout
- Clear content separation

## 🔧 Customization Examples

### Custom Styling

```tsx
<NewsItem news={news} variant="large" className="custom-news-card" />
```

```scss
// In your component's SCSS
.custom-news-card {
  border: 2px solid var(--color-primary);
  border-radius: 16px;

  .title {
    color: var(--color-primary) !important;
  }
}
```

### Grid Layout

```tsx
// For grid layouts
<div className="news-grid">
  {newsItems.map((news) => (
    <NewsItem key={news.id} news={news} variant="large" maxExcerptLength={120} />
  ))}
</div>
```

```scss
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
```

## ✨ Features

### Content Processing

- **HTML Stripping**: Safely removes HTML from titles and excerpts
- **Text Truncation**: Smart truncation with ellipsis
- **Date Formatting**: Relative time display (e.g., "2 days ago")

### Image Handling

- **Lazy Loading**: Images load on scroll
- **Fallback Support**: Graceful handling of missing images
- **Responsive Images**: Proper scaling across devices

### Accessibility

- **Semantic HTML**: Proper article structure
- **Alt Text**: Descriptive image alt attributes
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels where needed

### SEO Optimization

- **External Links**: Opens in new tab with proper rel attributes
- **Structured Content**: Semantic article markup
- **Meta Information**: Rich metadata display

## 🚀 Performance

- **Optimized Rendering**: Efficient prop handling
- **CSS Modules**: Scoped styling prevents conflicts
- **Tree Shaking**: Import only what you need
- **Bundle Size**: Minimal impact on app bundle

The NewsItem component provides a professional, flexible solution for displaying news content throughout your application! 🎉
