import { toast } from 'react-toastify'

export const apiFetch = async (url: string) => {
  const separator = url.startsWith('/') ? '' : '/'
  const res = await fetch(`/api${separator}${url}`)
  let body

  try {
    body = await res.json()
  } catch (error: any) {
    toast.error(error.message, { position: 'top-center', autoClose: false })
  }

  console.log(777, 'API Fetch:', body)

  if (!res.ok) {
    console.log(777, 'API Fetch:', 'not ok!')
    toast.error(body?.message ?? body, { position: 'top-center', autoClose: false })
    return
  }

  console.log(777, 'API Fetch:', ' ok!')
  return body
}
