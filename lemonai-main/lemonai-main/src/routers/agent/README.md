## run agent

```shell
curl -N --location 'http://localhost:3000/api/agent/run' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer xxx' \
--data '{"question": "请查看工作目录中的文件, 找到 README.md 文件, 读取文件内容, 并输出内容"}'
```
