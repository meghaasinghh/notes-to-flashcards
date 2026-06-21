import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 bg-paper">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 sm:px-12 py-8 max-w-6xl mx-auto">
        <span className="font-handwritten text-3xl font-bold text-ink">
          notes2flashcards
        </span>
        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-ink">
          <a href="#features" className="hover:text-coral transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-coral transition-colors">
            How it works
          </a>
          <Link
            href="/signup"
            className="bg-ink text-paper px-5 py-2.5 rounded-xl font-semibold hover:bg-coral transition-colors"
          >
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 sm:px-12 pt-8 pb-20 grid sm:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-highlight text-ink text-sm font-semibold px-4 py-1.5 rounded-full -rotate-2 mb-5">
            ✦ Turn messy notes into memory
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.05] text-ink mb-5">
            Your handwriting,
            <br />
            <span className="font-handwritten text-coral text-6xl sm:text-7xl">
              turned into flashcards
            </span>
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-md">
            Snap a photo of your notes. Our AI reads it, structures it, and
            builds a deck you can actually study — with spaced repetition
            built in.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/signup"
              className="bg-coral text-paper px-7 py-3.5 rounded-xl font-semibold shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Get started — it&apos;s free
            </Link>
            
             <a href="#how-it-works" className="font-semibold text-ink underline decoration-highlight decoration-[3px] underline-offset-4"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Tilted card illustration */}
        <div className="relative h-[340px] hidden sm:block">
          <div className="absolute top-2 left-2 w-56 bg-white border-2 border-ink rounded p-4 tilt-left-strong shadow-hard-line">
            <p className="font-handwritten text-lg text-ink leading-snug">
              Mitochondria is the powerhouse of the cell — produces ATP via
              cellular resp...
            </p>
          </div>
          <div className="absolute top-16 left-32 w-60 bg-paper border-2 border-ink rounded-xl p-5 tilt-right shadow-hard-coral">
            <p className="text-xs font-bold text-sage uppercase tracking-wide mb-2">
              Question
            </p>
            <p className="text-base font-semibold text-ink leading-snug">
              What is the function of mitochondria?
            </p>
          </div>
          <div className="absolute top-52 left-16 w-60 bg-paper border-2 border-ink rounded-xl p-5 tilt-left shadow-hard-sage">
            <p className="text-xs font-bold text-coral uppercase tracking-wide mb-2">
              Answer
            </p>
            <p className="text-base font-semibold text-ink leading-snug">
              Produces ATP through cellular respiration
            </p>
          </div>
        </div>
      </section>

      {/* Stats ticker */}
      <div className="bg-ink py-3.5 px-8 flex flex-wrap gap-x-12 gap-y-2 justify-center overflow-hidden">
        <span className="font-mono text-highlight text-xs sm:text-sm">
          12,400+ DECKS CREATED
        </span>
        <span className="font-mono text-paper text-xs sm:text-sm">
          94% RETENTION RATE
        </span>
        <span className="font-mono text-coral text-xs sm:text-sm">
          SM-2 SPACED REPETITION
        </span>
      </div>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-8 sm:px-12 py-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-12 text-center">
          Everything you need to{" "}
          <span className="font-handwritten text-coral text-4xl sm:text-5xl">
            actually remember
          </span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-ink rounded-xl p-6 shadow-hard-line">
            <div className="text-3xl mb-3">📸</div>
            <h3 className="font-bold text-ink text-lg mb-2">
              Upload any notes
            </h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              Photos, scans, or PDFs — handwritten or typed, we extract the
              text automatically.
            </p>
          </div>
          <div className="bg-white border-2 border-ink rounded-xl p-6 shadow-hard-line">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-bold text-ink text-lg mb-2">
              AI-built flashcards
            </h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              Q&amp;A, fill-in-the-blank, and multiple choice cards — generated
              automatically from your notes.
            </p>
          </div>
          <div className="bg-white border-2 border-ink rounded-xl p-6 shadow-hard-line">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-bold text-ink text-lg mb-2">
              Spaced repetition
            </h3>
            <p className="text-ink/70 text-sm leading-relaxed">
              Reviews scheduled with the SM-2 algorithm, so you study exactly
              when you&apos;re about to forget.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-line py-8 px-8 sm:px-12 text-center text-sm text-ink/60">
        Built by Megha Singh —{" "}
        <a
          href="https://github.com/meghaasinghh/notes-to-flashcards"
          className="underline hover:text-coral">
        
          view on GitHub
        </a>
      </footer>
    </div>
  );
}