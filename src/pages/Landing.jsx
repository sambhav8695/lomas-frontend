import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AstroWheel from "../components/AstroWheel";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../components/RegisterForm";

const FEATURES = [
  {
    glyph: "☉",
    title: "Astrological Intelligence",
    body: "Centuries of astrological wisdom meet modern AI. Lomas continuously learns, expands its knowledge, and evolves to deliver increasingly intelligent insight.",
  },
  {
    glyph: "☽",
    title: "Contextual Reasoning",
    body: "Every interpretation is shaped by context. Lomas applies the principle of Kaal, Desh, and Patra — time, place, and person — to deliver guidance that's precise, relevant, and deeply personal.",
  },
  {
    glyph: "☿",
    title: "Conversational Guidance",
    body: "Not just answers, but thoughtful conversation that understands, asks, reasons, and guides you through every stage of life.",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-28 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="font-display text-6xl md:text-7xl leading-[0.95]">Know yourself</h1>
          <div className="mt-8 space-y-1.5 text-lg text-ink-soft max-w-md">
            <p>A stairway to your deeper self — through astrology, conversation, and AI.</p>
            <p>
              Lomas is an AI astrologer that understands your birth chart, remembers your context, and helps
              you navigate your life.
            </p>
          </div>
          <Link
            to={isAuthenticated ? "/chat" : "/register"}
            className="inline-block mt-10 rounded-full bg-ink text-cream-soft px-7 py-3.5 text-[15px] hover:bg-ink-soft transition-colors"
          >
            Start your journey
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex justify-center"
        >
          <AstroWheel size={420} />
        </motion.div>
      </section>

      {/* Why Lomas */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <span className="eyebrow">Why Lomas</span>
        <h2 className="font-display text-4xl md:text-5xl mt-3 max-w-xl">Why Lomas</h2>
        <p className="mt-6 max-w-2xl text-ink-soft leading-relaxed">
          Lomas is built on one simple belief: meaningful guidance comes from understanding the complete
          picture. Rather than relying on isolated interpretations, Lomas connects multiple astrological
          systems, synthesizes vast knowledge, and reasons across your entire chart — delivering insight
          that's richer, more contextual, and uniquely yours.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-card border border-line bg-cream-soft p-7 hover:border-gold/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-gold-soft/50 border border-gold/30 flex items-center justify-center font-display text-2xl text-gold">
                {f.glyph}
              </div>
              <h3 className="font-display text-xl mt-6">{f.title}</h3>
              <p className="mt-3 text-sm text-stone leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sign up */}
      {!isAuthenticated && (
        <section className="mx-auto max-w-6xl px-6 py-28 grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow">Sign up</span>
            <h2 className="font-body font-bold text-4xl md:text-5xl mt-3 leading-[1.05]">
              Your journey begins here.
            </h2>
            <p className="mt-5 text-ink-soft max-w-sm">
              Create an account to receive personalized astrological guidance, tailored uniquely to you.
            </p>
          </div>
          <RegisterForm compact />
        </section>
      )}
    </div>
  );
}
