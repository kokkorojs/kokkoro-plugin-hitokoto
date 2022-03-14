import { Option } from 'kokkoro';

export interface HitokotoOption extends Option {
  auto_send: boolean;
  get_param: string;
}

export interface Hitokoto {
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
