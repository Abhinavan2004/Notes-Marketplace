import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { api } from '../services/api'

const schema = z.object({
  title: z.string().min(3),
  subject: z.string().min(2),
  description: z.string().min(10),
  price: z.string().min(1),
  tags: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export const UploadNote = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', subject: '', description: '', price: '0', tags: '' },
  })

  const onSubmit = async (values: FormValues) => {
    const pdf = (document.getElementById('pdf') as HTMLInputElement | null)?.files?.[0]
    if (!pdf) {
      toast.error('Please select a PDF file')
      return
    }

    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('subject', values.subject)
    formData.append('description', values.description)
    const priceNumber = Number(values.price)
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      toast.error('Price must be a valid number')
      return
    }
    formData.append('price', String(priceNumber))
    if (values.tags) formData.append('tags', values.tags)
    formData.append('pdf', pdf)

    await api.post('/notes', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success('Note uploaded')
    form.reset()
    ;(document.getElementById('pdf') as HTMLInputElement | null)?.value && ((document.getElementById('pdf') as HTMLInputElement).value = '')
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Upload a note</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-zinc-200">Title</label>
            <input className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2" {...form.register('title')} />
          </div>
          <div>
            <label className="text-sm text-zinc-200">Subject</label>
            <input className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2" {...form.register('subject')} />
          </div>
        </div>
        <div>
          <label className="text-sm text-zinc-200">Description</label>
          <textarea className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2" rows={4} {...form.register('description')} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-zinc-200">Price (INR)</label>
            <input
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
              {...form.register('price')}
            />
          </div>
          <div>
            <label className="text-sm text-zinc-200">Tags (comma separated)</label>
            <input className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2" {...form.register('tags')} />
          </div>
        </div>
        <div>
          <label className="text-sm text-zinc-200">PDF</label>
          <input id="pdf" type="file" accept="application/pdf" className="mt-1 w-full text-sm text-zinc-200" />
        </div>
        <button type="submit" className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400">
          Upload
        </button>
      </form>
    </div>
  )
}

