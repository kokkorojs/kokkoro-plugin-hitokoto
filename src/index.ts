import { Job, scheduleJob } from 'node-schedule';
import { GroupMessageEvent } from 'oicq';
import { Extension, Bot, Order, getOrder, getOption, getSetting } from 'kokkoro';

import { HitokotoOption } from './type';
import { getHitokoto } from './service';

export default class Hitokoto implements Extension {
  bot: Bot;
  send_job: Job;
  option: HitokotoOption = {
    auto_send: true,
    get_param: '?c=a&c=b&c=c',
  }
  orders: Order[] = [
    {
      func: this.sendHitokoto,
      regular: /^(来|说)(点|句|段)骚话$/,
    },
  ]

  constructor(bot: Bot) {
    this.bot = bot;
    this.send_job = this.autoSend();
  }

  async sendHitokoto(event: GroupMessageEvent, option: HitokotoOption) {
    const message = await getHitokoto(option.get_param);
    event.reply(message);
  }

  autoSend() {
    return scheduleJob('0 0 0 * * ?', async () => {
      const uin = this.bot.uin;
      const gl = this.bot.getGroupList();
      const message = await getHitokoto();
      const setting = getSetting(uin);

      // 判断开启服务的群
      gl.forEach(async group => {
        const { group_id, group_name } = group;
        const { apply, auto_send } = setting[group_id].plugin.hitokoto as HitokotoOption;

        if (apply && auto_send) {
          this.bot.sendGroupMsg(group_id, message)
            .catch(error => {
              this.bot.logger.error(`Error: ${group_name}(${group_id}) 消息发送失败，${error.message}`);
            })
        }
      })
    })
  }

  // 销毁定时任务
  cancelSchedule() {
    this.send_job.cancel();
  }

  onDestroy() {
    this.cancelSchedule();
  }

  onGroupMessage(event: GroupMessageEvent) {
    const raw_message = event.raw_message;
    const option = getOption(event);
    const order = getOrder(this.orders, raw_message);

    if (option.apply) {
      order && order.call(this, event, option);
    }
  }
}
