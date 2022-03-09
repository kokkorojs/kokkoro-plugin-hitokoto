import axios from 'axios';
import schedule from 'node-schedule';
import { GroupMessageEvent } from 'oicq';
import { Bot, Option } from 'kokkoro-core';
import { getSetting } from 'kokkoro-core/lib/setting';

// 定时发送任务
export let send_job: schedule.Job;
export const api = 'https://v1.hitokoto.cn';

export interface HitokotoOption extends Option {
  auto_send: boolean;
  get_param: string;
}

interface Hitokoto {
  // 一言标识
  id: string;
  // 一言正文 编码方式 unicode 使用 utf-8
  hitokoto: string;
  // 类型
  type: string;
  // 一言的出处
  from: string;
  // 一言的作者
  from_who: string;
  // 添加者
  creator: string;
  // 添加者用户标识
  creator_uid: string;
  // 审核员标识
  reviewer: string;
  // 一言唯一标识；可以链接到 https://hitokoto.cn?uuid=[uuid] (opens new window)查看这个一言的完整信息
  uuid: string;
  // 提交方式
  commit_from: string;
  // 添加时间
  created_at: string;
  // 句子长度
  length: number;
}

export interface HitokotoParam {
  // 句子类型
  c: string;
  // 返回编码
  encode: 'text' | 'json' | 'js' | string;
  // 字符集
  charset: 'utf-8' | 'gbk	' | string;
  // 调用的异步函数
  callback: string;
  // 选择器。配合 encode=js 使用
  select: string;
  // 返回句子的最小长度（包含）
  min_length: number;
  // 返回句子的最大长度（包含）
  max_length: number;
}

export async function getHitokoto(get_param = ''): Promise<string> {
  let message = '';

  await axios.get(api + get_param)
    .then(response => {
      const { data } = response;
      const { hitokoto, from } = data as Hitokoto;

      message = `${hitokoto}\n\t\t\t\t———— 「${from}」`;
    })
    .catch(error => {
      message = error.message;
    })

  return message;
}

export function autoSend(bot: Bot) {
  send_job = schedule.scheduleJob('0 0 0 * * ?', async () => {
    const { gl, uin } = bot;

    const message = await getHitokoto();
    const setting = getSetting(uin);

    // 判断开启服务的群
    gl.forEach(async value => {
      const { group_id, group_name } = value;
      const { apply, auto_send } = setting[group_id].plugin.hitokoto as HitokotoOption;

      if (apply && auto_send) {
        bot.sendGroupMsg(group_id, message)
          .catch(error => {
            bot.logger.error(`Error: ${group_name}(${group_id}) 消息发送失败，${error.message}`);
          })
      }
    })
  })
}

// 销毁定时任务
export function cancelSchedule() {
  send_job.cancel();
}

export async function send(event: GroupMessageEvent, option: HitokotoOption) {
  const message = await getHitokoto(option.get_param);
  event.reply(message)
}