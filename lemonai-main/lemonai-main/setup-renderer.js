// renderer/setup-renderer.js

// 从 window.electronAPI 访问暴露的 API
// 如果 preload 脚本中暴露的属性名不同，这里也需要相应修改
const { on, invoke,send } = window.electronAPI;

const statusMessageEl = document.getElementById('status-message');
const progressBarEl = document.getElementById('progress-bar');
const progressBarContainerEl = document.getElementById('progress-bar-container');
const errorMessageEl = document.getElementById('error-message');

// 监听主进程发送的状态更新
// 使用暴露的 on 方法
// 注意：暴露的 on 方法通常会去掉 event 参数
on('setup-status', (status) => {
    //第一步 checking-docker
    console.log('status:', status);
    if  (status.step === 'checking-docker') {
        //找到第一个 step-number 多个 取第一个 增加一个类名 active
        const stepNumberEl = document.getElementsByClassName('step-number')[0]
        console.log("stepNumberEl",stepNumberEl)
        stepNumberEl.classList.add('active');
        statusMessageEl.innerText =  status.message;
    }
    if  (status.step === 'startDocker') {
        const stepNumberEl = document.getElementsByClassName('step-number')[1]
        console.log("stepNumberEl",stepNumberEl)
        stepNumberEl.classList.add('active');
        statusMessageEl.innerText = status.message;
    }
    //checkDockerImages
    if  (status.step === 'checkDockerImages') {
        const stepNumberEl = document.getElementsByClassName('step-number')[2]
        console.log("stepNumberEl",stepNumberEl)
        stepNumberEl.classList.add('active');
        statusMessageEl.innerText =  status.message;
    }

    console.log('Setup status received:', status);
    statusMessageEl.innerText = status.message;

    if (status.step === 'downloading' && status.progress !== undefined) {
        //显示 #progress-bar-container
        progressBarContainerEl.style.display = 'block';
        const percentage = Math.round(status.progress * 100);
        progressBarEl.style.width = percentage + '%';
        progressBarEl.innerText = percentage + '%';
        progressBarContainerEl.style.display = 'block'; // 显示进度条
    } else {
         progressBarContainerEl.style.display = 'none'; // 其他步骤隐藏进度条
    }

    if (status.step === 'error') {
        errorMessageEl.innerText = status.message;
        errorMessageEl.style.display = 'block';
        // 可以添加一个重试按钮或者引导用户如何解决问题
    } else if (status.step === 'complete') {
         // 设置完成，等待主进程加载主页面
         errorMessageEl.style.display = 'none';
    }
});