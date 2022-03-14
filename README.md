# kokkoro-hitokoto

> ヒトコト

## 安装

``` shell
# 切换至 bot 目录
cd bot

# 安装 npm 包
npm i kokkoro-plugin-hitokoto
```

在 [kokkoro](https://github.com/kokkorojs/kokkoro) 成功运行并登录后，发送 `>enable hitokoto` 即可启用插件
使用 `>hitokoto <key> <value>` 可修改当前群聊的插件参数，例如关闭每日自动发送 `>hitokoto auto_send false`

## 参数

``` typescript
interface HitokotoOption {
  // 在每天凌晨自动发送
  auto_send: boolean;
  // 一言接口 get 请求参数
  get_param: string;
}
```

更多参数可查看 [hitokoto](https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0) 官方文档
