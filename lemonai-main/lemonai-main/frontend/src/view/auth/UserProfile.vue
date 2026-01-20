<template>
  <div class="usage">
    <div class="account-management">
      <div class="username-section" style="margin-bottom: 16px;">
        <div>
          <span class="label">{{ t('account.usernameLabel') }}</span>
          <span>{{ user.user_name }}</span>
        </div>
        <button @click="openUpdateName">{{ t('account.edit') }}</button>
      </div>

      <div class="password-reset-section">
        <span class="label">{{ t('account.passwordLabel') }}</span>
        <button @click="resetPassword">{{ t('account.resetPassword') }}</button>
      </div>

    <a-modal
      centered
      :title="t('account.editUsernameTitle')"
      v-model:open="isUsernameModalVisible"
    >
      <a-input v-model:value="newUsername" :placeholder="t('account.newUsernamePlaceholder')" />
      <template #footer>
        <button @click="isUsernameModalVisible = false" style="background-color: #0000330f; border-color: #0000330f; color:#1a1a19; margin-right: 8px; ">{{ t('account.cancel') }}</button>
        <button type="primary" @click="updateUsername">
          {{ t('account.save') }}
        </button>
      </template>
    </a-modal>
    <a-modal
      centered
      :title="t('account.resetPasswordTitle')"
      v-model:open="isPasswordModalVisible"
    >
      <a-input-password v-model:value="newPassword" :placeholder="t('account.newPasswordPlaceholder')" />
      <template #footer>
        <button @click="isPasswordModalVisible = false" style="background-color: #0000330f; border-color: #0000330f; color:#1a1a19; margin-right: 8px; ">{{ t('account.cancel') }}</button>
        <button type="primary" @click="updatePassword">
          {{ t('account.save') }}
        </button>
      </template>
    </a-modal>
  </div>
    <a-card :title="t('account.ordersTitle')">
      <a-table :columns="columns" @change="handleTableChange" :data-source="data" row-key="id"
        :pagination="{ current: page, pageSize: pageSize, page, total: total }" />
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import membershipService from '@/services/membership'
import authService from '@/services/auth'
import { useUserStore } from '@/store/modules/user.js'
const { user, membership, points } = useUserStore();
import dayjs from 'dayjs'
import { useRouter } from "vue-router";
const router = useRouter();
import { message } from 'ant-design-vue';
// --- 国际化引入 ---
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

onMounted(() => {
  getOrderList()
})

//分页
const page = ref(1)
const pageSize = ref(5)
const total = ref(0)
const data = ref([
])
const isUsernameModalVisible = ref(false)
const newUsername = ref('')

const isPasswordModalVisible = ref(false)
const newPassword = ref('')


const openUpdateName = () =>{
  isUsernameModalVisible.value = true;
  newUsername.value = user.user_name
}

const resetPassword = async () => {
  isPasswordModalVisible.value = true;
  newPassword.value = ''
}

const updateUsername = async () => { 
  await authService.updateUsername(newUsername.value)
  isUsernameModalVisible.value = false
  user.user_name = newUsername.value
  message.success(t("account.updateSuccess"))
}

const updatePassword = async () => { 
  await authService.resetPassword("", newPassword.value,user.mobile)
  isPasswordModalVisible.value = false
  message.success(t("account.updateSuccess"))
}
const getOrderList = async () => {
  const res = await membershipService.getOrderList(
    { page: page.value, pageSize: pageSize.value }
  )
  console.log(res)
  total.value = res.total
  data.value = res.list
}

const handleTableChange = (pagination) => {
  page.value = pagination.current
  pageSize.value = pagination.pageSize
  getOrderList()
}
const columns = [
  {
    title: t("account.table.orderId"),
    dataIndex: 'order_sn',
    key: 'order_sn'
  },
  {
    title: t("account.table.orderAmount"),
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: t("account.table.time"),
    dataIndex: 'created_at',
    key: 'created_at',
    customRender: ({ text }) => {
      return dayjs(text).format('YYYY-MM-DD HH:mm')
    }
  },
  {
    title: t("account.table.status"),
    key: 'status',
    customRender: ({ record }) => {
     //pending(待支付)、paid(已支付)、cancelled(已取消)、failed(支付失败)
     switch (record.status) {
       case 'pending':
         return t("account.orderStatus.pending")
       case 'paid':
       return t("account.orderStatus.paid")
       case 'cancelled':
       return t("account.orderStatus.cancelled")
       case 'failed':
       return t("account.orderStatus.failed")
       default:
       return t("account.orderStatus.unknown")
     }
    }
  }
]

</script>

<style scoped>
.usage {
  padding: 24px;
}

.mb-4 {
  margin-bottom: 16px;
}

.account-management {
  border-radius: 12px;
  padding: 1rem;
  background-color: #37352f0a;
  border: 1px solid #0000000f;
  margin-bottom: 16px;
}

.plan-name {
  font-weight: 700;
  font-size: 1rem;
  line-height: 28px;
}

.points-details {
  margin-top: 12px;
}

.points-details-text {
  font-weight: 700;
  font-size: 1rem;
  line-height: 28px;
}

.points-details-text-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-details-accounts {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expiration-date {
  color: #858481;
  line-height: 18px;
  font-size: 13px;

}

.points-accounts {
  color: #858481;
  line-height: 18px;
  font-size: 13px;
}

button {
  color: #fff;
  background-color: #1a1a19;
  padding-left: .75rem;
  padding-right: .75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  font-family: none;
}
.username-section{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.password-reset-section{
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.recharge-products {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  background-color: #f8f8f7;
  padding: 24px;
  justify-content: space-between;
}

.product-card {
  width: calc(33.333% - 11px);
  /* 3列布局，减去间距 */
  border: 1px solid #f0f0f0;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
  text-align: center;
  /* 文字居中 */
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
<style lang="scss">
.recharge-modal {
  .ant-modal-content {
    background-color: #f8f8f7 !important;
  }

  .ant-modal-title {
    background-color: #f8f8f7 !important;
  }
}
</style>