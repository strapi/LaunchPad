<template>
    <div class="user-center-popup">
        <div class="userInfo" v-if="isLogin">
            <div class="userName">
                {{ userName }}
            </div>
            <div class="userEmail">
                {{ user.user_email }}
            </div>
        </div>
        <!-- 会员信息 -->
        <div class="memberInfo" v-if="isLogin">
            <span>{{ membership?.planName || $t("member.freePlan") }}</span>
            <button @click="toMember" class="upgrade">{{ $t("member.upgrade") }}</button>
        </div> 
        <!-- 积分 -->
        <div v-if="isLogin">
            <div class="score" @click="toUsage">
                <div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.2102 1.57437C15.2709 1.39188 15.529 1.39188 15.5897 1.57437L15.9325 2.60482C16.1315 3.20299 16.6008 3.67234 17.199 3.87131L18.2294 4.21408C18.4119 4.27478 18.4119 4.53293 18.2294 4.59363L17.199 4.9364C16.6008 5.13537 16.1315 5.60472 15.9325 6.20289L15.5897 7.23334C15.529 7.41583 15.2709 7.41583 15.2102 7.23334L14.8674 6.20289C14.6684 5.60472 14.1991 5.13537 13.6009 4.9364L12.5705 4.59363C12.388 4.53293 12.388 4.27478 12.5705 4.21408L13.6009 3.87131C14.1991 3.67234 14.6684 3.20299 14.8674 2.60482L15.2102 1.57437Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8.10529 6.19431C7.64765 7.5701 6.56814 8.6496 5.19235 9.10724L2.42617 10.0274C1.96992 10.1791 1.96992 10.8245 2.42617 10.9763L5.19236 11.8964C6.56815 12.354 7.64765 13.4335 8.10529 14.8093L9.02543 17.5755C9.17719 18.0318 9.82255 18.0318 9.97431 17.5755L10.8945 14.8093C11.3521 13.4335 12.4316 12.354 13.8074 11.8964L16.5736 10.9763C17.0298 10.8245 17.0298 10.1791 16.5736 10.0274L13.8074 9.10724C12.4316 8.6496 11.3521 7.5701 10.8945 6.19431L9.97431 3.42812C9.82255 2.97188 9.17719 2.97188 9.02543 3.42812L8.10529 6.19431ZM9.49987 7.22075C8.86634 8.69339 7.69143 9.86829 6.2188 10.5018C7.69143 11.1354 8.86634 12.3103 9.49987 13.7829C10.1334 12.3103 11.3083 11.1354 12.7809 10.5018C11.3083 9.86829 10.1334 8.69339 9.49987 7.22075Z" fill="currentColor"></path></svg>
                <span>{{ $t("member.points") }}</span>
            </div>
            <span>{{ points.total }}</span>
            </div>
            
            
        </div>
        <!-- 设置 -->
        <div @click="toSetting" >
            <svg t="1744338498135" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="5527" width="20" height="20">
                <path
                    d="M439.816 101.851c-8.631-16.952-28.007-25.48-46.337-20.396-70.066 19.435-133.165 55.501-184.82 103.628-12.909 12.028-16.413 31.094-8.623 46.926 5.374 10.92 8.414 23.234 8.414 36.376 0 45.555-36.833 82.347-82.1 82.347-0.381 0-0.762-0.003-1.142-0.008-17.691-0.253-33.448 11.147-38.74 28.031C73.159 421.209 66 466.344 66 513.078c0 30.844 3.118 61.001 9.07 90.156 4.1 20.082 22.714 33.816 43.111 31.808a83.069 83.069 0 0 1 8.169-0.399c45.267 0 82.1 36.791 82.1 82.346 0 20.276-7.254 38.74-19.334 53.086-13.177 15.649-12.423 38.718 1.748 53.472 52.742 54.916 119.403 96.417 194.376 118.784 20.888 6.231 42.918-5.408 49.543-26.174 10.616-33.275 41.714-57.212 78.217-57.212s67.601 23.937 78.217 57.212c6.625 20.766 28.655 32.405 49.543 26.174 74.973-22.367 141.634-63.868 194.376-118.784 14.17-14.755 14.924-37.823 1.748-53.471-12.08-14.346-19.334-32.811-19.334-53.087 0-45.554 36.834-82.346 82.1-82.346 2.773 0 5.496 0.135 8.169 0.399 20.397 2.008 39.011-11.726 43.111-31.808 5.951-29.155 9.07-59.312 9.07-90.156 0-46.734-7.16-91.869-20.468-134.323-5.292-16.884-21.049-28.285-38.741-28.031-0.379 0.005-0.76 0.008-1.141 0.008-45.266 0-82.1-36.792-82.1-82.347 0-13.142 3.04-25.456 8.414-36.376 7.79-15.832 4.286-34.898-8.623-46.926-51.655-48.127-114.754-84.193-184.82-103.628-18.33-5.084-37.706 3.444-46.337 20.396-13.648 26.806-41.357 44.97-73.184 44.97-31.827 0-59.536-18.164-73.184-44.97zM288.45 268.385c0-14.471-1.9-28.535-5.47-41.936 31.114-25.118 66.377-45.232 104.576-59.156 29.686 36.285 74.82 59.528 125.444 59.528 50.624 0 95.758-23.243 125.444-59.528 38.199 13.924 73.462 34.038 104.576 59.156a162.748 162.748 0 0 0-5.47 41.936c0 79.513 57.113 145.772 132.604 159.667 6.434 27.261 9.846 55.723 9.846 85.026 0 14.581-0.845 28.951-2.485 43.065-79.109 10.814-139.965 78.769-139.965 160.846 0 26.162 6.201 50.922 17.202 72.84-30.829 27.076-66.197 49.043-104.786 64.612-28.717-45.337-79.271-75.496-136.966-75.496-57.695 0-108.249 30.159-136.966 75.496-38.589-15.569-73.957-37.536-104.787-64.612 11.002-21.918 17.203-46.678 17.203-72.84 0-82.077-60.856-150.032-139.965-160.846A373.007 373.007 0 0 1 146 513.078c0-29.304 3.411-57.765 9.845-85.026 75.492-13.894 132.605-80.154 132.605-159.667zM513 336c-97.202 0-176 78.798-176 176s78.798 176 176 176 176-78.798 176-176-78.798-176-176-176zM409 512c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104z"
                    fill="#666" p-id="5528"></path>
            </svg>
            <span>{{  $t("settings") }}</span>
        </div>
        <div class="logout" @click="logOut" v-if="isLogin">
            <Logout />
            <span>{{ $t(`auth.logOut`) }}</span>
        </div>
        <!-- 去登录 -->
         <div class="login" v-else @click="handleLogin">
            <svg t="1749714854005" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5537" width="20" height="20"><path d="M832 896H298.666667a104.533333 104.533333 0 0 1-106.666667-102.4v-101.973333h53.333333v102.826666A52.48 52.48 0 0 0 298.666667 845.653333h533.333333a52.48 52.48 0 0 0 53.333333-51.2V229.546667a52.48 52.48 0 0 0-53.333333-51.2H298.666667a52.48 52.48 0 0 0-53.333334 51.2v102.826666H192V229.546667A104.533333 104.533333 0 0 1 298.666667 128h533.333333A104.533333 104.533333 0 0 1 938.666667 229.546667v564.906666A104.533333 104.533333 0 0 1 832 896zM601.173333 352a25.6 25.6 0 0 1 0-36.693333 27.733333 27.733333 0 0 1 37.546667 0l184.32 177.066666a30.293333 30.293333 0 0 1 0 39.253334L640 708.693333a27.733333 27.733333 0 0 1-37.546667 0 25.173333 25.173333 0 0 1 0-36.266666l139.946667-134.826667H112.213333a25.6 25.6 0 1 1 0-51.2h628.906667z" fill="#2c2c2c" p-id="5538"></path></svg>
            <span>{{ $t(`auth.login`) }}</span>
        </div>
    </div>
</template>
<script setup>
import { computed, inject, h,ref,onMounted,nextTick} from "vue";

import Logout from "@/assets/logout.svg";
import auth from '@/services/auth';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user.js'
const userStore = useUserStore();
const { user, membership, points } = storeToRefs(userStore);
import { useRouter } from "vue-router";
const router = useRouter();

// --- 国际化引入 ---
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const userName = computed(() => {
    return user.user_name || user.mobile || user.user_email;
});

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const toMember = () => {
    router.push({ name: "pricing" });
};

const toSetting = () => {
    router.push({ path: '/setting/basic' });
};

//判断是否登录
const  isLogin = computed(() => {
    //判断是否存在用户ID user
    if  (user.value.id) {
        return true;    
    }
    return false;
});


const logOut = async () => {
    await auth.logout();
    //跳转回登录 
    window.location.reload();
};

const handleLogin = async () => { 
    router.push({ name: "login" });
};

const toUsage = () => {
    router.push({ path: '/setting/usage' });
};

//获取用户信息 getUserInfo
async function getUserInfo() {
  //判断有没有登录
  if (!isLogin.value) {
    return;
  }
  let res = await auth.getUserInfo();
  //设置缓存
  membership.value = res.membership;
  points.value = res.points;
}

onMounted(() => {
  nextTick(() => {
    getUserInfo();
  });
});

</script>
<style lang="scss" scoped>
.user-center-popup {
    >div:not(.userInfo){
        padding: .5rem;
        display: flex;
        align-items: center;
        gap: .75rem;
        border-radius: .5rem;
    }
    >div:not(.userInfo):hover {
        background-color: #37352F0F;
    }
    .memberInfo{
        display: flex;
        background-color: #37352F0F;
        justify-content: space-between;
        padding: 12px!important;
        margin-bottom: .75rem;
        button{
            color: #fff;
            background-color: #1a1a19;
            padding-left: .75rem;
            padding-right: .75rem;
            border-radius: 99999px;
            cursor: pointer;

        }
    }
    .score{
        width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
        >div{
            display: flex;
            gap: .75rem;
            align-items: center;
            >div{
                display: flex;
                justify-content: space-between;
            }
        }
      
    }
    .userInfo {
        padding: 0px 0px 10px 0px;

        .userName {
            line-height: 22px;
            font-weight: 600;
            font-size: 1rem;
            color: #34322D;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .userEmail {
            line-height: 18px;
            font-weight: 400;
            font-size: 0.875rem;
            color: #858481;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

    }

    .user-name {
        margin-bottom: 5px;
    }

    .userCenter {
        margin-bottom: 10px;
        padding: 20px 16px 16px 20px;
        background-color: hsla(240, 9%, 59%, 0.1);
        ;
        border-radius: 6px;
        display: flex;
        justify-content: center;
    }

    .balance {
        margin-bottom: 10px;
    }
    
    .logout {
        cursor: pointer;
        padding: 8px;
        display: flex;
        justify-content: start;
        align-items: center;
        border-radius: 6px;
        line-height: 1.25rem;
        font-weight: 500;
        font-size: 0.875rem;
        color: #F25A5A;

        img {
            width: 20px;
            height: 20px;
        }

        &:hover {
            background-color: hsla(240, 9%, 59%, 0.1);
        }

        span {
            margin-left: 5px;
        }
    }
}
</style>