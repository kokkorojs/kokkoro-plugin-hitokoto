import { Plugin, getBotList } from 'kokkoro';

import { getHitokoto } from './service';
import { HitokotoOption } from './type';

const option: HitokotoOption = {
  apply: true,
  lock: false,
  auto_send: true,
  param: '?c=a&c=b&c=c',
};
export const plugin = new Plugin('hitokoto', option).version(require('../package.json').version);

plugin
  .schedule('0 0 0 * * ?', async () => {
    const bot_list = getBotList();
    const hitokoto = await getHitokoto(option.param);

    for (const [_, bot] of bot_list) {
      const group_list = bot.getGroupList();

      // 判断开启服务的群
      group_list.forEach(async group => {
        const { group_id } = group;
        const { apply, auto_send } = bot.getOption(group_id, 'hitokoto');

        if (apply && auto_send) {
          bot.sendGroupMsg(group_id, hitokoto);
        }
      })
    }
  })
  .command('say', 'group')
  .description('发送一言')
  .sugar(/^(来|说)(点|句|段)骚话$/)
  .action(async function () {
    const hitokoto = await getHitokoto((this.option as HitokotoOption).param);
    this.event.reply(hitokoto);
  })
