import { HydratedDocument } from 'mongoose'

export type One<Model> = HydratedDocument<Model> | null

export type Many<Model> = HydratedDocument<Model>[]
