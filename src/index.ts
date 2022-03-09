import { GroupMessageEvent } from 'oicq';
import { Extension, Bot, Order, getOrder, getOption } from 'kokkoro-core';

import { autoSend, cancelSchedule, HitokotoOption, send } from './param';

export default class implements Extension {
  bot: Bot;
  option: HitokotoOption = {
    auto_send: true,
    get_param: '?c=a&c=b&c=c',
  }
  orders: Order[] = [
    {
      func: send,
      regular: /^(来|说)(点|句|段)骚话$/,
    },
  ]

  constructor(bot: Bot) {
    this.bot = bot;
  }

  async onInit() {
    autoSend(this.bot);
  }

  onDestroy() {
    cancelSchedule();
  }

  onGroupMessage(event: GroupMessageEvent) {
    const raw_message = event.raw_message;
    const option = getOption(event);
    const order = getOrder(this.orders, raw_message);

    if (option.apply) {
      order && order.func.call(this.bot, event, option);
    }
  }
}