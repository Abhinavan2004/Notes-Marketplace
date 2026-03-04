import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { loginThunk } from '../../redux/auth/authSlice'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector((s) => s.auth.loading)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(loginThunk(values))
    if (loginThunk.fulfilled.match(result)) {
      toast.success('Welcome back')
      navigate('/marketplace')
    } else {
      toast.error('Login failed')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <p className="mt-1 text-sm text-zinc-300">Use your verified email account.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-zinc-200">Email</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-indigo-400"
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <div className="mt-1 text-xs text-red-300">{form.formState.errors.email.message}</div>
          ) : null}
        </div>
        <div>
          <label className="text-sm text-zinc-200">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-indigo-400"
            {...form.register('password')}
          />
          {form.formState.errors.password ? (
            <div className="mt-1 text-xs text-red-300">
              {form.formState.errors.password.message}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 text-sm text-zinc-300">
        No account?{' '}
        <Link to="/auth/signup" className="text-indigo-300 hover:text-indigo-200">
          Create one
        </Link>
      </div>
    </div>
  )
}

