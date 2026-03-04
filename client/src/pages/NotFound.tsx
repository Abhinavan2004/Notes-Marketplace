import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <div className="text-5xl font-semibold">404</div>
      <div className="mt-2 text-zinc-300">This page doesn’t exist.</div>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
      >
        Back home
      </Link>
    </div>
  )
}

