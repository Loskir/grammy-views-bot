import { Bot, session } from 'grammy'
import { FileAdapter } from '@grammyjs/storage-file'
import { ViewController } from '@loskir/grammy-views'

import { config } from './core/config'
import { CustomContext } from './types/context'
import callbackQuery from './passThruMiddlewares/callbackQuery'
import { MainView } from './views/main'
import { OrderCakeCommentView, OrderCakeConfirmView, OrderCakeDoughView, OrderCakeFillingsView } from './views/orderCake'
import { CartItemView, CartView } from './views/cart'

export function getBot() {
  const bot = new Bot<CustomContext>(config.token)

  bot.use(callbackQuery)
  bot.use(session({
    initial: () => ({
      cart: [],
    }),
    storage: new FileAdapter({ dirName: 'sessions' }),
  }))

  const viewController = new ViewController<CustomContext>()
  viewController.register(
    MainView,
    OrderCakeDoughView,
    OrderCakeFillingsView,
    OrderCakeCommentView,
    OrderCakeConfirmView,
    CartView,
    CartItemView,
  )

  bot.use(viewController)

  bot.catch(console.error)

  return bot
}
