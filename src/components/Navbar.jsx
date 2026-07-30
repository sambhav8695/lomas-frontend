import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLink =
  "text-[15px] text-ink-soft hover:text-ink transition-colors";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-wide">
          Lomas
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/about" className={navLink}>
            About
          </NavLink>
          <NavLink to="/blog" className={navLink}>
            Blog
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/chat" className={navLink}>
              Chat
            </NavLink>
          )}
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={navLink}>
                Profile
              </NavLink>
              <button onClick={handleLogout} className={navLink}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLink}>
              Login
            </NavLink>
          )}
          <Link
            to={isAuthenticated ? "/chat" : "/register"}
            className="rounded-full bg-ink text-cream-soft px-5 py-2.5 text-sm hover:bg-ink-soft transition-colors"
          >
            {isAuthenticated ? "Open your chart" : "Get your Chart"}
          </Link>
        </nav>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-cream px-6 py-4 flex flex-col gap-4">
          <NavLink to="/about" className={navLink} onClick={() => setOpen(false)}>
            About
          </NavLink>
          <NavLink to="/blog" className={navLink} onClick={() => setOpen(false)}>
            Blog
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/chat" className={navLink} onClick={() => setOpen(false)}>
              Chat
            </NavLink>
          )}
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={navLink} onClick={() => setOpen(false)}>
                Profile
              </NavLink>
              <button onClick={handleLogout} className={`${navLink} text-left`}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLink} onClick={() => setOpen(false)}>
              Login
            </NavLink>
          )}
          <Link
            to={isAuthenticated ? "/chat" : "/register"}
            className="rounded-full bg-ink text-cream-soft px-5 py-2.5 text-sm text-center"
            onClick={() => setOpen(false)}
          >
            {isAuthenticated ? "Open your chart" : "Get your Chart"}
          </Link>
        </div>
      )}
    </header>
  );
}
