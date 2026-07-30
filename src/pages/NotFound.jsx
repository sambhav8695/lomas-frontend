import { Link } from "react-router-dom";
import AstroWheel from "../components/AstroWheel";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6 px-6">
      <AstroWheel size={200} animate={false} />
      <div>
        <h1 className="font-display text-4xl">This house is empty</h1>
        <p className="text-stone mt-2">The page you're looking for isn't in this chart.</p>
      </div>
      <Link to="/" className="rounded-full bg-ink text-cream-soft px-6 py-3 text-sm hover:bg-ink-soft">
        Back home
      </Link>
    </div>
  );
}
