import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const Home = () => {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_55%)]" />
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl font-semibold tracking-tight"
          >
            Buy and sell high-quality student notes.
          </motion.h1>
          <p className="mt-3 max-w-2xl text-zinc-300">
            Upload your PDFs, sell securely, and download purchases through protected routes after
            payment verification.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/marketplace"
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Explore marketplace
            </Link>
            <Link
              to="/auth/login"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

