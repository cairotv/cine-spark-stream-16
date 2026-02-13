export function getEmbedUrl(type: 'movie' | 'tv', id: number, options?: { season?: number; episode?: number; serverIndex?: number }): string {
  const servers = [
    (t: string, i: number) => `https://vidsrc.to/embed/${t}/${i}${options?.season ? `/${options.season}/${options.episode}` : ''}`,
    (t: string, i: number) => `https://2embed.cc/embed/${t}/${i}${options?.season ? `?s=${options.season}&e=${options.episode}` : ''}`,
    (t: string, i: number) => `https://embed.su/embed/${t}/${i}${options?.season ? `/${options.season}/${options.episode}` : ''}`
  ];
  const index = options?.serverIndex ?? 0;
  return servers[index](type, id);
}