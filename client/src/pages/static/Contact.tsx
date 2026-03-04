import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

type FormValues = z.infer<typeof schema>

export const Contact = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  })

  const onSubmit = async () => {
    toast.info('Contact form backend wiring comes next.')
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6"
      >
        <div>
          <label className="text-sm text-zinc-200">Name</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
            {...form.register('name')}
          />
        </div>
        <div>
          <label className="text-sm text-zinc-200">Email</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
            {...form.register('email')}
          />
        </div>
        <div>
          <label className="text-sm text-zinc-200">Message</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
            rows={5}
            {...form.register('message')}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Send
        </button>
      </form>
    </div>
  )
}

