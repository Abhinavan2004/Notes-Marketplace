import { useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { toggleDarkMode } from '../../redux/ui/uiSlice'

export const AppShell = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector((s) => s.ui.darkMode)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">
            Notes Marketplace
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-200">
            <Link to="/marketplace" className="hover:text-white">
              Marketplace
            </Link>
            <Link to="/orders" className="hover:text-white">
              Orders
            </Link>
            <button
              type="button"
              onClick={() => dispatch(toggleDarkMode())}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10"
            >
              Toggle theme
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}

