export function extractList(payload) {
  if (payload == null) return [];
  const d = payload.data !== undefined ? payload.data : payload;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d.books)) return d.books;
  if (Array.isArray(d.items)) return d.items;
  if (Array.isArray(d.results)) return d.results;
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d.communities)) return d.communities;
  if (Array.isArray(d.games)) return d.games;
  if (Array.isArray(d.comments)) return d.comments;
  if (Array.isArray(d.users)) return d.users;
  return [];
}

export function extractTotal(payload) {
  const d = payload?.data !== undefined ? payload.data : payload;
  if (d == null) return null;
  if (typeof d.total === 'number') return d.total;
  if (typeof d.count === 'number') return d.count;
  if (d.pagination && typeof d.pagination.total === 'number') return d.pagination.total;
  return null;
}

export function normalizeBook(b) {
  if (!b) return null;
  const id = b._id ?? b.id;
  return {
    ...b,
    id,
    title: b.title ?? 'Untitled',
    author: b.author ?? b.authorName ?? 'Unknown',
    coverUrl: b.coverUrl ?? b.cover ?? b.coverImage ?? b.image,
    rating: Number(b.rating ?? b.averageRating ?? 0) || 0,
    price: Number(b.price ?? 0) || 0,
    year:
      b.year ??
      b.publicationYear ??
      (b.publicationDate ? new Date(b.publicationDate).getFullYear() : undefined),
    copiesleft: b.copiesleft ?? b.copiesLeft ?? b.stock ?? b.availableCopies ?? b.copies,
    description: b.description ?? b.synopsis ?? '',
    publisher: b.publisher ?? '',
    placeOfPublish: b.placeOfPublish ?? b.placeOfPublishing ?? '',
    language: b.language ?? '',
    ISBN: b.ISBN ?? b.isbn ?? '',
    genre: b.genre ?? '',
    type: b.type ?? b.format ?? '',
    pages: b.pages ?? b.pageCount,
    publicationDate: b.publicationDate ?? b.publishedAt ?? '',
  };
}

export function parseJwtRole(token) {
  if (!token) return null;
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    const o = JSON.parse(json);
    return o.role ?? o.userRole ?? null;
  } catch {
    return null;
  }
}

export function normalizeComment(c) {
  if (!c) return null;
  const id = c._id ?? c.id;
  const author =
    typeof c.author === 'string'
      ? c.author
      : c.author?.name ?? c.author?.full_name ?? c.username ?? c.user?.name ?? 'User';
  const text = c.content ?? c.text ?? '';
  const rawReplies = c.replies ?? c.children ?? [];
  const replies = Array.isArray(rawReplies) ? rawReplies.map(normalizeReply).filter(Boolean) : [];
  return { id, author, text, replies, raw: c };
}

function normalizeReply(r) {
  if (!r) return null;
  return {
    id: r._id ?? r.id,
    author:
      typeof r.author === 'string'
        ? r.author
        : r.author?.name ?? r.author?.full_name ?? r.username ?? 'User',
    text: r.content ?? r.text ?? '',
  };
}

export function normalizeGame(g) {
  if (!g) return null;
  return {
    ...g,
    id: g._id ?? g.id,
    title: g.title ?? 'Game',
    description: g.description ?? '',
    image: g.image ?? g.coverUrl ?? g.cover ?? g.bannerUrl,
    topics: g.topics ?? g.tags ?? g.skills ?? [],
    members: g.members ?? g.memberCount ?? g.learners ?? 0,
    difficulty: g.difficulty ?? g.level ?? '—',
    duration: g.duration ?? g.estimatedDuration ?? '—',
    steps: g.steps ?? g.roadmap ?? g.modules ?? [],
  };
}
