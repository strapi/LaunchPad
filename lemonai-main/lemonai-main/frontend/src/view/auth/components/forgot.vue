<template>
  <div>
    <!-- Forgot Password Form -->
    <a-form :model="forgotForm" name="forgot-form" @finish="handleForgotPassword" autocomplete="off" layout="vertical">
      
      <!-- 邮箱（海外）或手机号（国内） -->
      <a-form-item
        v-if="isAbroad"
        name="email"
        :rules="[
          { required: true, message: $t('auth.pleaseInputEmail') },
          { type: 'email', message: $t('auth.pleaseInputValidEmail') }
        ]"
      >
        <div class="form-label">{{ $t('auth.email') }}<span class="required-mark">*</span></div>
        <a-input v-model:value="forgotForm.email" :placeholder="$t('auth.pleaseInputEmail')" />
      </a-form-item>

      <a-form-item
        v-else
        name="phone"
        :rules="[
          { required: true, message: $t('auth.pleaseInputPhone') },
          { pattern: /^1[3-9]\d{9}$/, message: $t('auth.pleaseInputValidPhone') }
        ]"
      >
        <div class="form-label">{{ $t('auth.phone') }}<span class="required-mark">*</span></div>
        <a-input v-model:value="forgotForm.phone" :placeholder="$t('auth.pleaseInputPhone')" />
      </a-form-item>

      <!-- 验证码 -->
      <a-form-item v-if="!isAbroad" name="smsCode" :rules="[{ required: true, message: $t('auth.pleaseInputSMSCode') }]">
          <div class="form-label">
            {{ $t('auth.smsCode') }}<span class="required-mark">*</span>
          </div>
          <a-input-group compact>
            <a-input v-model:value="forgotForm.smsCode" style="width: 65%;" :placeholder="$t('auth.pleaseInputSMSCode')" />
            <a-button
              style="width: 30%; margin-left: 5%; color:#fff"
              :disabled="smsCountdown > 0"
              @click="sendSMSCode"
            >
              {{ smsCountdown > 0 ? `${smsCountdown}s` : $t('auth.sendCode') }}
            </a-button>
          </a-input-group>
      </a-form-item>
      <!-- 邮箱 验证码 -->
      <a-form-item
        v-if="isAbroad"
        name="code"
        :rules="[{ required: true, message: $t('auth.pleaseInputVerifyCode') }]"
      >
        <div class="form-label">
          {{ $t('auth.verifyCode') }}<span class="required-mark">*</span>
        </div>
        <a-input-group compact>
          <a-input
            v-model:value="forgotForm.code"
            style="width: 65%;"
            :placeholder="$t('auth.pleaseInputVerifyCode')"
          />
          <a-button
            style="width: 30%; margin-left: 5%; color:#fff"
            :disabled="emailCountdown > 0"
            @click="sendEmailCode"
          >
            {{ emailCountdown > 0 ? `${emailCountdown}s` : $t('auth.sendCode') }}
          </a-button>
        </a-input-group>
      </a-form-item>
      <!-- 新密码 -->
      <a-form-item
        name="password"
        :rules="[{ required: true, message: $t('auth.pleaseInputNewPassword') }]"
      >
        <div class="form-label">{{ $t('auth.password') }}<span class="required-mark">*</span></div>
        <a-input-password v-model:value="forgotForm.password" :placeholder="$t('auth.pleaseInputNewPassword')" />
      </a-form-item>

      <!-- 确认密码 -->
      <a-form-item
        name="confirmPassword"
        :rules="[{ required: true, message: $t('auth.pleaseConfirmPassword') },{ validator: validateConfirmPassword }]"
      >
        <div class="form-label">{{ $t('auth.pleaseConfirmPassword') }}<span class="required-mark">*</span></div>
        <a-input-password
          v-model:value="forgotForm.confirmPassword"
          :placeholder="$t('auth.pleaseConfirmPassword')"
        />
      </a-form-item>

      <!-- 提交按钮 -->
      <a-form-item>
        <a-button type="primary" :disabled="!isForgotValid" html-type="submit" block :loading="loading">
          {{ $t('auth.resetPasswordButton') }}
        </a-button>
      </a-form-item>

      <!-- 返回登录 -->
      <div class="auth-footer">
        <a @click="toLogin">{{ $t('auth.backToLogin') }}</a>
      </div>
    </a-form>
  </div>
</template>
<script setup>
import { computed, reactive,ref } from 'vue';
import google from '@/assets/svg/google.svg';
import { message } from 'ant-design-vue';
import { MobileOutlined } from '@ant-design/icons-vue';
//判断是国内还是海外 VITE_REGION
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
import auth from '@/services/auth';
const emit = defineEmits(['toLogin','handleForgotPassword']);

const isAbroad = ref(true)

// 忘记密码表单
const forgotForm = reactive({
  email: '',
  code: '',//邮箱验证码
  password: '',
  phone: '',
  smsCode: '',//短信验证码
  confirmPassword: ''
});

const smsCountdown = ref(0)
let smsTimer = null

const emailCountdown = ref(0)
let emailTimer = null


const isForgotValid = computed(() => {
  const passwordValid =
    forgotForm.password &&
    forgotForm.confirmPassword &&
    forgotForm.password === forgotForm.confirmPassword;

  if (isAbroad.value) {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotForm.email);
    const emailCodeValid = !!forgotForm.code;
    return emailValid && emailCodeValid && passwordValid;
  } else {
    const phoneValid = /^1[3-9]\d{9}$/.test(forgotForm.phone);
    const smsCodeValid = !!forgotForm.smsCode;
    return phoneValid && smsCodeValid && passwordValid;
  }
});



const handleForgotPassword = (value) => {
  emit("handleForgotPassword",value)
};

function sendSMSCode() {
  if (!/^1[3-9]\d{9}$/.test(forgotForm.phone)) {
    message.error(t('auth.pleaseInputValidPhone'))
    return
  }
  auth.sendSmsCode(forgotForm.phone)
  // 模拟发送验证码
  smsCountdown.value = 60
  smsTimer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(smsTimer)
      smsTimer = null
    }
  }, 1000)
}

//发送邮箱验证码
function sendEmailCode() {
  if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(forgotForm.email)) {
    message.error(t('auth.pleaseEnterValidEmail'))
    return
  }
  auth.sendEmailVerification(forgotForm.email)
  // 模拟发送验证码
  emailCountdown.value = 60
  emailTimer = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(emailTimer)
      emailTimer = null
    }
  }, 1000)
  message.success(t('auth.codeSent'))
}

function validateConfirmPassword(_, value) {
  if (value !== forgotForm.password) {
    return Promise.reject(new Error(t('auth.passwordsDoNotMatch')))
  }
  return Promise.resolve()
}

const toLogin = () => {
  emit('toLogin')
}


</script>
<style lang="scss" scoped>
.social-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
    align-items: center;

    .social-button {
        width: 100%;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #333;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: none;
        background-color: white;
        color: #333;

        img {
            margin-right: 6px;
        }
    }

}


:deep(.ant-form-item-control-input-content) {
    width: 360px;
}

:deep(.ant-form-item) {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;

    .ant-form-item-control {
        width: 100%;
    }

    .ant-form-item-label>label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
    }

    .form-label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        margin-bottom: 4px;

        .required-mark {
            color: #ff4d4f;
            margin-left: 2px;
        }
    }

    .ant-input {
        width: 100%;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        background-color: #ffffff;

        &:hover,
        &:focus {
            border-color: #4f46e5;
        }
    }

    .ant-input-affix-wrapper {
        width: 100%;
        height: 40px !important;
        border-radius: 8px !important;
        border: 1px solid #d1d5db !important;
        background-color: #ffffff !important;
        box-shadow: none !important;
        padding: 0 11px !important;

        &:hover,
        &:focus,
        &-focused {
            border-color: #4f46e5 !important;
        }



        .ant-input {
            width: 100% !important;
            height: 38px !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            background-color: #ffffff !important;

            &:focus {
                box-shadow: none !important;
            }
        }

        .ant-input-suffix {
            margin-left: 0 !important;
        }
    }

    .ant-btn {
        width: 100%;
        height: 40px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        background-color: #4f46e5;
        border-color: #4f46e5;

        &:hover {
            background-color: #4338ca;
            border-color: #4338ca;
        }

        &[disabled] {
            background-color: #d1d5db;
            border-color: #d1d5db;
            color: white;
            cursor: not-allowed;

            &:hover {
                background-color: #d1d5db;
                border-color: #d1d5db;
            }
        }
    }
}

.divider {
    position: relative;
    text-align: center;
    margin: 24px 0;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background-color: #e5e7eb;
        z-index: 0;
    }

    span {
        position: relative;
        background-color: transparent;
        padding: 0 12px;
        color: #6b7280;
        font-size: 14px;
        z-index: 1;
    }
}

.auth-footer {
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
    color: #6b7280;

    a {
        color: #4f46e5;
        font-weight: 500;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
}

.password-label-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;

    .form-label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
    }

    .forgot-link {
        font-size: 14px;
        color: #4f46e5;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>