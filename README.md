# Buy48Ticket

逻辑是轮询检查 **本地**时间是否超过当前20时，之后执行下订单等流程。

成功率最高情况是服务器与执行脚本的机器时间一致，且执行脚本提前**一小段时间**（网络传输的时间? 100ms左右）



欢迎提出各种改进意见