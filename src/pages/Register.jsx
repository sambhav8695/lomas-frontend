import AstroWheel from "../components/AstroWheel";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">
      <div className="hidden lg:flex flex-col items-start">
        <AstroWheel size={380} />
        <blockquote className="font-display text-2xl mt-8 max-w-sm leading-snug">
          "The chart doesn't tell you what will happen. It tells you who you're working with."
        </blockquote>
      </div>
      <div>
        <span className="eyebrow">Sign up</span>
        <h1 className="font-display text-4xl mt-3 mb-8">Your journey begins here.</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
