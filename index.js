const { checkCommand, getOption, getSetting } = require('kokkoro-core');

const axios = require('axios');
const schedule = require('node-schedule');

const api = 'https://v1.hitokoto.cn?c=a&c=b&c=c';

// 定时发送任务
let send_job;

function autoSend(bot) {
  send_job = schedule.scheduleJob('0 0 0 * * ?', async () => {
    const { gl, uin } = bot;

    const message = await get();
    const setting = getSetting(uin);

    // 判断开启服务的群
    gl.forEach(async value => {
      const { group_id } = value;
      const { auto_send, cron } = setting[group_id].plugin.hitokoto;

      auto_send && bot.sendGroupMsg(group_id, message);
    })
  })
}

async function get() {
  return new Promise((resolve, reject) => {
    axios.get(api)
      .then(response => {
        const { data } = response;
        const { hitokoto, from } = data;
        const message = `${hitokoto}\n\t\t\t\t———— 「${from}」`;

        resolve(message);
      })
      .catch(error => {
        reject(error.message);
      });
  })
}

async function send(event) {
  const message = await get();

  event.reply(message)
}

const command = {
  send: /^(来|说)(点|句|段)骚话$/
}

const default_option = {
  auto_send: true,
  cron: '0 0 0 * * ?',
}

function listener(event) {
  const option = getOption(event);
  const mission = checkCommand(command, event.raw_message);

  if (option.switch) {
    mission && eval(`${mission}.bind(this)(event)`);
  }
}

function enable(bot) {
  autoSend(bot);
  bot.on('message.group', listener);
}

function disable(bot) {
  send_job.cancel();
  bot.off('message.group', listener);
}

module.exports = {
  enable, disable, default_option,
}