import { useChatStore } from '@/store/modules/chat';
import { timestamp } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import time from './time';
// 初始化 chatStore 和 messages
const chatStore = useChatStore();


// 提取所有 meta.action_type 为 plan 的消息中 meta.json 的 actions，合并为扁平列表
function viewRealTime( messages){
  const result = [];
  // 遍历 messages
  messages.value.forEach((message) => {
    // 检查 meta.action_type 是否为 plan
    if (message.meta?.action_type === 'plan') {
      // 确保 meta.json 存在且是数组
      if (Array.isArray(message.meta.json)) {
        // 遍历 meta.json
        message.meta.json.forEach((jsonItem) => {
          // 确保 actions 存在且是数组
          if (Array.isArray(jsonItem.actions)) {
            // 将 actions 添加到结果列表
            jsonItem.actions.forEach((action) => {
              // 添加 action
              if(action.status!== 'running'){
                result.push(action)
              }
            });
          }
        });
      }
    }
  });
  return result;
};

// 
function viewLocal(messages,passImg){
  const result = [];
  messages.forEach((message)=>{
    if (message.meta?.action_type === 'finish_summery' || message.meta?.action_type === 'question') {
      // 确保 meta.json 存在且是数组
      if (Array.isArray(message.meta.json)) {
        // 循环添加进result并添加id
        message.meta.json.forEach((jsonItem) => {
          result.push({
            timestamp: message.timestamp,
            ...jsonItem
          });
        });
      }
    }
  })
  if(passImg){
    return handlePassImg(result);
  }
  return result;
};


const imageType = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico']
function handlePassImg(fileList){
  const result = [];
  fileList.forEach(element => {
    if (!imageType.includes(element?.filename?.split('.').pop())) {
      result.push(element);
    }
  });
return result;
}


export const viewList = {
  viewRealTime,
  viewLocal
};