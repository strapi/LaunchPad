# 模型可用性测试
方法：顺序执行测试
测试工具：apifox

##  Deepseek V3
```bash
curl --location --request POST 'http://localhost:9000/api/browser/task' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prompt": "访问微博，给出今日热点报告",
    "llm_config": {
        "model_name": "deepseek-chat",
        "api_key": "*********",
        "api_url": "https://api.deepseek.com/v1"
    }
}'
```
测试结果：✅

测试响应（部分）：
执行效果(最后一条)：
```json
{
                    "extracted_content": "Today's top 10 trending topics on Weibo are:\n1. 黄子韬6点起床给羊洗澡 (280,222 searches)\n2. 张凯毅 请把女厕的马桶取消吧 (Peaked at 10:28)\n3. 者来女清唱单依纯珠玉 (175,091 searches)\n4. 考生坐轮椅奔赴考场同学主动帮忙 (177,479 searches)\n5. 小沈阳女儿出道照 (385,403 searches)\n6. 空姐曝鹿晗关晓彤官宣前同游日本 (58,896 searches)\n7. 妍妍酱 塌房 (Peaked in the morning)\n8. 临江仙追剧团 (167,546 searches)\n9. 沈腾谁懂耗子踱着四方步就过来了 (133,689 searches)\n10. 两个拍出天价的Labubu都曾经是他的 (Peaked at 08:06)",
                    "url": "https://weibo.com/newlogin?tabtype=weibo&gid=102803&openLoginLayer=0&url=https%3A%2F%2Fweibo.com%2F",
                    "error": null
                }
```
执行信息：
```json
{
 "total_duration_seconds": 96.73932790756226,
            "total_tokens": 24909,
            "is_successful": true,
            "is_done": true,
            "number_of_steps": 5
}
```
##  DeepSeek R1
```bash
curl --location --request POST 'http://localhost:9000/api/browser/task' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prompt": "访问微博，给出今日前五热搜",
    "llm_config": {
        "model_name": "deepseek-reasoner",
        "api_key": "*********",
        "api_url": "https://api.deepseek.com/v1"
    }
}'
```
测试结果：✅--
测试响应（部分）：执行效果(最后一条)：
```json
{
"extracted_content": "今日微博前五热搜：\n1. 包文婧封肚 (07:21登顶)\n2. 妍妍酱 塌房 (上午霸榜)\n3. 张凯毅 请把女厕的马桶取消吧 (10:29登顶)\n4. Labubu爆火离不开这四大因素 (1166334热度)\n5. 邓紫棋6年没有收到版税 (12:37登顶)",
                    "url": "https://weibo.com/newlogin?tabtype=weibo&gid=102803&openLoginLayer=0&url=https%3A%2F%2Fweibo.com%2F",
                    "error": null
}
```
执行信息：
```json
{
"total_duration_seconds": 254.1361768245697,
            "total_tokens": 18893,
            "is_successful": true,
            "is_done": true,
            "number_of_steps": 3
}
反馈：这里任务改为了“访问微博，给出今日前五热搜”，因为“访问微博，给出今日热点报告”该任务执行非常慢，单步甚至可以达到300s+，无法接受，
```
##  qwen3-235b-a22b
```bash
curl --location --request POST 'http://localhost:9000/api/browser/task' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prompt": "访问微博，给出今日热点报告",
    "llm_config": {
        "model_name": "qwen3-235b-a22b",
        "api_key": "*********",
        "api_url": "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
}'
```
测试结果：✅
测试响应（部分）：执行效果(最后一条)：
```json
{
                    "extracted_content": "今日热点报告如下：\n1. 开放合作是人间正道\n2. 两个拍出天价的Labubu都曾经是他的\n3. 藏海传一句句台词传到台湾\n4. 中国外贸在复杂环境中稳健前行\n5. 张凯毅 请把女厕的马桶取消吧\n6. 小沈阳女儿出道照\n7. 108万labubu早期收藏者发声\n8. 周杰伦方回应花30亿台币买4层楼\n9. 诛仙\n10. 特朗普宣布移民金卡网站上线\n11. Labubu催生庞大周边产业链\n12. 罗帅宇事件\n13. 看似休息其实很耗气血行为\n14. 泡泡玛特\n15. 花漾少女杀人事件定档\n16. 黄子韬6点起床给羊洗澡\n17. 易烊千玺广州演唱会演出场所\n18. 焕羽定档",
                    "url": "https://weibo.com/newlogin?tabtype=search&gid=&openLoginLayer=0&url=https%3A%2F%2Fweibo.com%2F",
                    "error": null
                }
```
执行信息：
```json
{
    "total_duration_seconds": 34.543779611587524,
            "total_tokens": 15970,
            "is_successful": true,
            "is_done": true,
            "number_of_steps": 3
}
```
##  qwen3-32b
```bash
curl --location --request POST 'http://localhost:9000/api/browser/task' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prompt": "访问微博，给出今日热点报告",
    "llm_config": {
        "model_name": "qwen3-32b",
        "api_key": "*********",
        "api_url": "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
}'
```
测试结果：✅
测试响应（部分）：执行效果(最后一条)：
```json
{
                    "extracted_content": "Here is today's Weibo hot topics report:\n\n1. 黄子韬6点起床给羊洗澡 - 250,162 mentions\n2. 张凯毅 请把女厕的马桶取消吧 - 10 mentions\n3. 者来女清唱单依纯珠玉 - 184,724 mentions\n4. 京东电竞日抽沙特电竞世界杯门票 - 60,945 mentions\n5. 奔驰 - 573,226 mentions\n6. 小沈阳女儿出道照 - 64,347 mentions\n7. 空姐曝鹿晗关晓彤官宣前同游日本 - 100 mentions\n8. 妍妍酱 塌房 - 155 mentions\n9. 哪吒汽车董事长回应员工讨薪 - 135,728 mentions\n10. 工信部回应车企60天内付款 - 69,472 mentions",
                    "url": "https://weibo.com/newlogin?tabtype=weibo&gid=102803&openLoginLayer=0&url=https%3A%2F%2Fweibo.com%2F",
                    "error": null
                }
```
执行信息：
```json
{
     "total_duration_seconds": 53.5604522228241,
            "total_tokens": 23055,
            "is_successful": true,
            "is_done": true,
            "number_of_steps": 4
}
```
##  qwen3-14b
```bash
curl --location --request POST 'http://localhost:9000/api/browser/task' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prompt": "访问微博，给出今日热点报告",
    "llm_config": {
        "model_name": "qwen3-14b",
        "api_key": "*********",
        "api_url": "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
}'
```
测试结果：✅
测试响应（部分）：执行效果(最后一条)：
```json
{
                    "extracted_content": "今日微博热点报告如下：\n\n1. #高考试卷真的在监狱印刷吗# - 2,279次讨论\n   - 相关链接: https://weibo.com/ttarticle/p/show?id=2309405176415577833919\n\n2. #洛杉矶华人称不敢去宵禁区域# - 628次讨论\n   - 相关链接: https://weibo.com/1496814565/Pw9VXxdXW\n\n3. #陷入我们的热恋撕哈撕哈# - 76,000次讨论\n   - 相关链接: https://video.weibo.com/show?fid=1034:5174838197944429&mark_id=999_reallog_mark_ad%3A999%7CWeiboADNatural\n\n4. #特朗普向加州增派两千国民警卫队# - 152次讨论\n   - 相关链接: https://weibo.com/1671109627/PwalgksRe\n\n5. #高考加油# - 1,386次讨论\n   - 相关链接: https://video.weibo.com/show?fid=1034:5175942071648284\n\n搜索热门榜单：\n\n1. 黄子韬6点起床给羊洗澡 - 238,607次讨论\n2. 张凯毅 请把女厕的马桶取消吧 - 10:28次讨论（登顶）\n3. 小沈阳女儿出道照 - 423,430次讨论\n4. 高仿LABUBU必须被拿下 - 141,233次讨论\n5. 空姐曝鹿晗关晓彤官宣前同游日本 - 63,961次讨论\n6. 妍妍酱 塌房 - 上午霸榜\n7. 步行者替补发威 - 100,028次讨论\n8. 泰勒斯威夫特疑秘密结婚 - 01:50登顶\n9. 柳智敏 黄铉辰 - 10:09登顶\n10. 雷霆vs步行者 - 65,284次讨论",
                    "url": "https://weibo.com/newlogin?tabtype=weibo&gid=102803&openLoginLayer=0&url=https%3A%2F%2Fweibo.com%2F",
                    "error": null
                }
```
执行信息：
```json
{
            "total_duration_seconds": 79.28797626495361,
            "total_tokens": 23888,
            "is_successful": true,
            "is_done": true,
            "number_of_steps": 4
}
```

##  Doubao（火山引擎）
这里测试多类模型

测试请求格式如下：

```bash
curl --location --request POST 'http://localhost:9000/api/browser/task' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prompt": "检查www.baidu.com 是否正常运行",
    "llm_config": {
        "model_name": [model_name],
        "api_key": "*********",
        "api_url": "https://ark.cn-beijing.volces.com/api/v3"
    }
}'
```

|             Model_name              | 是否可用 | Function Call | Json_mode | 报错信息 | 备注                                      |
| :---------------------------------: | :------: | :-----------: | :-------: | :------: | ----------------------------------------- |
|  doubao-1-5-thinking-pro-m-250428   |    ✅     |       ✅       |     ❌     |  Bad_2   | 需要设置response_type为raw                |
|       doubao-seed-1-6-250615        |    ✅     |       ✅       |     ✅     |          |                                           |
|   doubao-seed-1-6-thinking-250615   |    ✅     |       ✅       |     ✅     |          |                                           |
|    doubao-seed-1-6-flash-250615     |    ✅     |       ✅       |     ✅     |          |                                           |
|      doubao-1-5-pro-32k-250115      |    ✅     |       ✅       |    X✅?    |  Bad_1   | 需要设置use_vision为False（不支持多模态） |
|       doubao-lite-128k-240828       |    ✅     |       ✅       |    X✅?    |  Bad_1   | 效果比较差                                |
|         deepseek-v3-250324          |    ✅     |       ✅       |    ❌?     |          |                                           |
| deepseek-r1-distill-qwen-32b-250120 |    ✅     |       ❌       |    ❌?     |          |                                           |



默认配置下报错信息表

| 错误编号 | 详细信息模版                                                 | 备注 |
| :------: | :----------------------------------------------------------- | :--: |
|  Bad_1   | Error code: 400 - {'error': {'code': 'InvalidParameter', 'message': 'One or more parameters specified in the request are not valid. Request id: {id}', 'param': '', 'type': 'BadRequest'}} |      |
|  Bad_2   | Error code: 400 - {'error': {'code': 'InvalidParameter', 'message': 'The parameter `response_format.type` specified in the request are not valid: `json_object` is not supported by this model. Request id: {id}', 'param': 'response_format.type', 'type': 'BadRequest'}} |      |
|          |                                                              |      |

