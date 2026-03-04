import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchNotesThunk } from '../redux/notes/notesSlice'

export const Marketplace = () => {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.notes)

  useEffect(() => {
    void dispatch(fetchNotesThunk())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Marketplace</h2>
          <p className="text-sm text-zinc-300">Browse notes. Filters/search come next.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <div
              key={n._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <div className="text-xs text-indigo-300">{n.subject}</div>
              <div className="mt-1 text-lg font-semibold">{n.title}</div>
              <div className="mt-2 line-clamp-3 text-sm text-zinc-300">{n.description}</div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">₹{n.price.toFixed(2)}</div>
                <div className="text-xs text-zinc-300">⭐ {n.averageRating.toFixed(1)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

