import { createView } from "@loskir/grammy-views";
import { Codec, ConstantCodec } from "../lib/codec";
import { CustomContext } from "../types/context";
import { answer } from "../utils/answer";
import { goToMainMenu } from "./main";

const CartCodec = new ConstantCodec('cart')
export const goToCart = () => CartCodec.encode()

const CartPageCodec = new Codec<number>({
  encode(page) {
    return `cart-page-${page}`
  },
  decode(s) {
    const match = s.match(/^cart-page-(\d+)$/)
    if (!match) {
      return null
    }
    return Number(match[1])
  },
})
const goToCartPage = (page: number) => CartPageCodec.encode(page)

const sliceBack = <T>(items: T[], start: number, end: number): T[] => {
  return items.slice().reverse().slice(start, end)
}

const ITEMS_PER_PAGE = 3

export const CartView = createView<CustomContext, { page: number }>('cart').setDefaultState(() => ({ page: 0 }))
CartView.global.filter(CartPageCodec.filter, (ctx) => CartView.enter(ctx, { page: ctx.codec }))
CartView.global.filter(CartCodec.filter, (ctx) => CartView.enter(ctx))

CartView.render((ctx) => {
  const pageNumber = ctx.view.state.page
  const startIndex = pageNumber * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const itemsEntries = sliceBack(ctx.session.cart.map((item, i) => [i, item] as const), startIndex, endIndex)

  const paginationRow = []

  if (pageNumber > 0) {
    // we have prev page
    paginationRow.push({
      text: '<',
      callback_data: goToCartPage(pageNumber - 1),
    })
  }

  if (endIndex < ctx.session.cart.length) {
    // we have next page
    paginationRow.push({
      text: '>',
      callback_data: goToCartPage(pageNumber + 1),
    })
  }

  return answer(ctx)('Here you can see your previous orders', {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        ...itemsEntries.map(([i, item]) => [{
          text: item.created_at.toString(),
          callback_data: goToItem(i, ctx.view.state.page),
        }]),
        paginationRow,
        [{
          text: '‹ Back',
          callback_data: goToMainMenu(),
        }],
      ],
    },
  })
})

const CartItemCodec = new Codec<{ id: number, backToPage: number }>({
  encode({ id, backToPage }) {
    return `cart-item-${id}-${backToPage}`
  },
  decode(s) {
    const match = s.match(/^cart-item-(\d+)-(\d+)$/)
    if (!match) {
      return null
    }
    return {
      id: Number(match[1]),
      backToPage: Number(match[2]),
    }
  },
})
const goToItem = (id: number, backToPage: number) => CartItemCodec.encode({ id, backToPage })

export const CartItemView = createView<CustomContext, { id: number, backToPage?: number }>('cart-item')
CartItemView.global.filter(CartItemCodec.filter, (ctx) => CartItemView.enter(ctx, ctx.codec))

CartItemView.render((ctx) => {
  const item = ctx.session.cart[ctx.view.state.id]
  if (!item) {
    ctx.answerCallbackQuery({ text: 'Order not found :(' })
    return CartView.enter(ctx)
  }
  return answer(ctx)(`Order #${ctx.view.state.id}
  
Dough: <b>${item.dough}</b>
Fillings: <b>${item.fillings.join('</b>, <b>')}</b>
Comment: ${item.comment ? `<b>${item.comment}</b>` : '<i>No comment</i>'}

Created at: ${item.created_at}`, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '‹ Back', callback_data: goToCart() }],
      ],
    },
  })
})
