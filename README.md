# kokkoro-hitokoto

> ヒトコト

## 安装

``` shell
# 切换至 bot 目录
cd bot

# 安装 npm 包
npm i kokkoro-hitokoto
```

在 [kokkoro](https://github.com/kokkorojs/kokkoro) 成功运行并登录后，发送 `>enable hitokoto` 即可启用插件
使用 `>hitokoto <key> <value>` 可修改当前群聊的插件参数，例如关闭每日自动发送 `>hitokoto auto_send false`

## 参数

``` json
"option": {
  // 每日自动发送一言
  "auto_send": true,
  // 自动发送时间段（cron 表达式）
  "cron": "0 0 0 * * ?",
  // 接口请求参数，可查看 https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0
  "params": "?c=a&c=b&c=c",
}
```