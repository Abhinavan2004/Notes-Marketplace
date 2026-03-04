import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '../../app/hooks'
import { signupThunk } from '../../redux/auth/authSlice'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export const Signup = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(signupThunk(values))
    if (signupThunk.fulfilled.match(result)) {
      toast.info('OTP sent to your email')
      navigate(`/auth/verify-otp?email=${encodeURIComponent(values.email)}`)
    } else {
      toast.error('Signup failed')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Create account</h2>
      <p className="mt-1 text-sm text-zinc-300">We’ll send an OTP to verify your email.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-zinc-200">Full name</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-indigo-400"
            {...form.register('name')}
          />
        </div>
        <div>
          <label className="text-sm text-zinc-200">Email</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-indigo-400"
            {...form.register('email')}
          />
        </div>
        <div>
          <label className="text-sm text-zinc-200">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-indigo-400"
            {...form.register('password')}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Sign up
        </button>
      </form>

      <div className="mt-4 text-sm text-zinc-300">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-indigo-300 hover:text-indigo-200">
          Sign in
        </Link>
      </div>
    </div>
  )
}

