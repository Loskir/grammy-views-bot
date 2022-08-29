import type { Context, SessionFlavor } from 'grammy'
import { ViewContextFlavor } from '@loskir/grammy-views'
import { Cake } from './cake'

export type CustomContext = Context
  & SessionFlavor<{ cart: Cake[] }>
  & ViewContextFlavor
