export type Article = {
  title: string;
  link: string;
  publishedAt: string;
  categories: string[];
  image: string | null;
  excerpt: string;
};

export type MediumData = {
  fetchedAt: string | null;
  items: Article[];
};

export type Video = {
  id: string;
  title: string;
  publishedAt: string | null;
  thumbnail: string | null;
  views: number;
  url: string;
};

export type YouTubeData = {
  fetchedAt: string | null;
  channel: {
    id: string | null;
    title: string;
    url: string;
    subscribers: number;
    thumbnail: string | null;
  };
  items: Video[];
};
