import { HydratedDocument } from 'mongoose'

export type FindOne<Model> = HydratedDocument<Model> | null
