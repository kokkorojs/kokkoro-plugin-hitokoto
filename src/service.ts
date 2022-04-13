import axios from 'axios';
import { Hitokoto } from './type';

// 定时发送任务
export const api = 'https://v1.hitokoto.cn';

export async function getHitokoto(param = ''): Promise<string> {
  let message = '';

  await axios.get(api + param)
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
