import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchMyOrdersThunk } from '../redux/orders/ordersSlice'

export const Orders = () => {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((s) => s.orders)

  useEffect(() => {
    void dispatch(fetchMyOrdersThunk())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">My Orders</h2>

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div>
                <div className="font-medium">{o.note?.title ?? 'Unknown note'}</div>
                <div className="text-xs text-zinc-300">
                  Status: {o.status} • Amount: ₹{o.amount.toFixed(2)}
                </div>
              </div>
              {o.status === 'paid' && o.note?._id ? (
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/orders/${o.note._id}/download`}
                  className="rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
                >
                  Download
                </a>
              ) : (
                <span className="text-sm text-zinc-400">Download disabled</span>
              )}
            </div>
          ))}
          {orders.length === 0 ? <div className="text-zinc-300">No orders yet.</div> : null}
        </div>
      )}
    </div>
  )
}

