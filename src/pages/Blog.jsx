import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogApi } from "../api/blog";
import { extractErrorMessage } from "../api/client";
import { Search } from "lucide-react";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const request = query.trim() ? blogApi.search(query.trim()) : blogApi.list();
    request
      .then((page) => setPosts(page.content))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <span className="eyebrow">Notes on the craft</span>
      <h1 className="font-display text-5xl mt-3">The Lomas Blog</h1>
      <p className="text-stone mt-4 max-w-xl">
        Field notes on astrology, meaning-making, and how Lomas thinks about your chart.
      </p>

      <div className="relative mt-10 max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-light" />
        <input
          className="w-full rounded-full border border-line bg-paper pl-11 pr-4 py-3 text-sm outline-none focus:border-gold"
          placeholder="Search articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="text-clay mt-6">{error}</p>}
      {loading && <p className="text-stone-light mt-10">Loading posts…</p>}

      {!loading && posts.length === 0 && (
        <p className="text-stone-light mt-16 text-center">No posts found yet. Check back soon.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="rounded-card border border-line bg-cream-soft overflow-hidden hover:border-gold/50 transition-colors group"
          >
            {post.coverImage ? (
              <img src={post.coverImage} alt="" className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gold-soft/30 flex items-center justify-center font-display text-3xl text-gold">
                ✦
              </div>
            )}
            <div className="p-6">
              <h2 className="font-display text-xl group-hover:text-gold transition-colors">{post.title}</h2>
              {post.excerpt && <p className="text-sm text-stone mt-2 line-clamp-3">{post.excerpt}</p>}
              <p className="text-xs text-stone-light mt-4 font-label">
                {post.author ? `${post.author.firstName} ${post.author.lastName}` : "Lomas"} ·{" "}
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
