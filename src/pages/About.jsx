import AstroWheel from "../components/AstroWheel";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <span className="eyebrow">About Lomas</span>
      <h1 className="font-display text-5xl mt-3 max-w-xl">
        Guidance built from the whole chart, not a single line of it.
      </h1>

      <div className="grid md:grid-cols-2 gap-16 items-center mt-16">
        <div className="space-y-6 text-ink-soft leading-relaxed">
          <p>
            Most astrology tools give you an isolated reading: a sun-sign horoscope, a single transit, a
            fragment of a much larger picture. Lomas was built differently.
          </p>
          <p>
            It reasons across your whole birth chart at once — planetary placements, houses, aspects — and
            applies the classical principle of <em>Kaal, Desh, and Patra</em>: time, place, and person.
            The same placement means something different at nineteen than it does at forty, in Mumbai than
            in Manchester.
          </p>
          <p>
            And because it remembers your context from one conversation to the next, Lomas isn't a search
            box for horoscopes. It's closer to a thoughtful advisor who already knows your chart, and asks
            good questions before it answers.
          </p>
        </div>
        <div className="flex justify-center">
          <AstroWheel size={320} />
        </div>
      </div>
    </div>
  );
}
