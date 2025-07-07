// src/utils/postNavigation.ts
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getPostNavigation(currentSlug: string) {
  // 全ての記事を取得し、日付順でソート
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.data.pubDate);
    const dateB = new Date(b.data.pubDate);
    return dateA.getTime() - dateB.getTime();
  });

  // 現在の記事のインデックスを取得
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // 前の記事と次の記事を取得
  const prev = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const next = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  return { prev, next };
}