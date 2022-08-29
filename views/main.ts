import { createView } from '@loskir/grammy-views'
import { CustomContext } from '../types/context'
import { ConstantCodec } from '../lib/codec'
import { goToOrderCake } from './orderCake'
import { goToCart } from './cart'

export const MainView = createView<CustomContext>('main')
MainView.render((ctx) => {
  const answer = (...args: Parameters<typeof ctx['editMessageText']>) => ctx.callbackQuery ? ctx.editMessageText(...args) : ctx.reply(...args)
  return answer('Welcome to grammY bakery!', {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Order a cake',
          callback_data: goToOrderCake(),
        }],
        [{
          text: 'Your orders',
          callback_data: goToCart(),
        }],
      ]
    },
  })
})
MainView.global.command(['start', 'cancel'], (ctx) => MainView.enter(ctx))

export const MainMenuCodec = new ConstantCodec('main-menu')
export const goToMainMenu = () => MainMenuCodec.encode()

MainView.global.filter(MainMenuCodec.filter, (ctx) => MainView.enter(ctx))
