import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-32">
      <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <div className="font-display text-lg">Lomas</div>
          <p className="text-sm text-stone mt-2 max-w-xs">
            A stairway to your deeper self — through astrology, conversation, and AI.
          </p>
        </div>
        <div className="flex gap-10 text-sm text-stone">
          <div className="flex flex-col gap-2">
            <span className="eyebrow mb-1">Product</span>
            <Link to="/about" className="hover:text-ink transition-colors">
              About
            </Link>
            <Link to="/blog" className="hover:text-ink transition-colors">
              Blog
            </Link>
            <Link to="/register" className="hover:text-ink transition-colors">
              Get your chart
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow mb-1">Account</span>
            <Link to="/login" className="hover:text-ink transition-colors">
              Login
            </Link>
            <Link to="/forgot-password" className="hover:text-ink transition-colors">
              Reset password
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-stone-light">
        © {new Date().getFullYear()} Lomas. Know yourself.
      </div>
    </footer>
  );
}
