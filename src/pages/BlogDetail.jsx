import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { blogApi } from "../api/blog";
import { extractErrorMessage } from "../api/client";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    blogApi
      .getBySlug(slug)
      .then(setPost)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-center text-stone-light py-24">Loading article…</p>;
  if (error) return <p className="text-center text-clay py-24">{error}</p>;
  if (!post) return null;

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-stone hover:text-gold">
        <ArrowLeft size={15} /> Back to blog
      </Link>

      <h1 className="font-display text-4xl md:text-5xl mt-8 leading-tight">{post.title}</h1>
      <p className="text-sm text-stone-light font-label mt-4">
        {post.author ? `${post.author.firstName} ${post.author.lastName}` : "Lomas"} ·{" "}
        {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {post.coverImage && (
        <img src={post.coverImage} alt="" className="w-full rounded-card mt-8 border border-line" />
      )}

      {/* Blog content is authored by admins through the CMS and trusted to contain rich HTML. */}
      <div
        className="prose-content mt-10 text-[17px] leading-relaxed text-ink-soft"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-12">
          {post.keywords.map((k) => (
            <span key={k} className="text-xs font-label px-3 py-1 rounded-full border border-line text-stone">
              {k}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
