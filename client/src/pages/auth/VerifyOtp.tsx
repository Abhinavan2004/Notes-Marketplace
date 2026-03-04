import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '../../app/hooks'
import { verifyOtpThunk } from '../../redux/auth/authSlice'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'

const schema = z.object({
  otp: z.string().length(6),
})

type FormValues = z.infer<typeof schema>

export const VerifyOtp = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const email = useMemo(() => params.get('email') || '', [params])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { otp: '' },
  })

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(verifyOtpThunk({ email, otp: values.otp }))
    if (verifyOtpThunk.fulfilled.match(result)) {
      toast.success('Email verified. Please sign in.')
      navigate('/auth/login')
    } else {
      toast.error('OTP verification failed')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Verify email</h2>
      <p className="mt-1 text-sm text-zinc-300">Enter the 6-digit OTP sent to {email || 'your email'}.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-zinc-200">OTP</label>
          <input
            inputMode="numeric"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-indigo-400"
            {...form.register('otp')}
          />
          {form.formState.errors.otp ? (
            <div className="mt-1 text-xs text-red-300">{form.formState.errors.otp.message}</div>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Verify
        </button>
      </form>
    </div>
  )
}

