import { NextApiResponse } from 'next'

export const sendGenericError = (res: NextApiResponse, message: string) => {
  res.status(500).send({
    success: false,
    message,
  })
}
