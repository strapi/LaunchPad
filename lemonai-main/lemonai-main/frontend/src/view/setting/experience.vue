<template>
  <div class="experience">
    <h2>{{ $t('setting.experience.title') }}</h2>
    <div class="main">
      <div class="sidebar">
        <div class="list">
          <div
              v-for="type in types"
              :key="type.id"
              class="item"
              @click="handleType(type)"
              :class="currentTypeIndex === type.id ? 'active' : ''"
          >
            <component :is="type.icon" class="icon"/>
            <span>{{ type.title }}</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="header">
          <span class="title">{{ types[currentTypeIndex].title }}</span>
          <div class="des">
            <span class="description">{{ types[currentTypeIndex].des }}</span>
            <a-button @click="showAdd = true" style="display: flex;justify-items: center;align-items: center"
                      class="btn-add">
              <addSvg/>
              {{ $t('setting.experience.addExperience') }}
            </a-button>
          </div>
        </div>
        <div class="list">
          <a-table
              :data-source="types[currentTypeIndex].data"
              :columns="columns"
              row-key="id"
              :pagination="false"
              :scroll="{ y: 560 }"
              class="a-table"
          >
            <template #headerCell="{ column, title }">
              <template v-if="column.key === 'is_enabled'">
                <div></div>
              </template>
              <template v-else-if="column.key === 'operation'">
                <div>
                  <div style="display: flex; justify-content: end;padding-right: 10px"></div>
                </div>
              </template>
              <template v-else>
                {{ title }}
              </template>
            </template>

            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'title'">
                {{ record.title }}
              </template>
              <template v-else-if="column.key === 'operation'">
                <div style="display:flex;justify-content: end" class="operation-buttons">
                  <a-button type="link" danger @click="handleDelete(record.id, true)" class="btn">
                    <deleteSvg style="height: 18px;width: 18px;"/>
                  </a-button>
                  <a-button type="link" @click="currentExperienceId=record.id;handleCopy(record.id);showEdit=true"
                            class="btn">
                    <editSvg style="height: 18px;width: 18px;color: #8b8b8b"/>
                  </a-button>
                </div>
              </template>
              <template v-else-if="column.key === 'is_enabled'">
                <div style="display:flex;flex-direction: row;align-items: center;gap: 5px;justify-content: end">
                  <a-switch size="small" v-model:checked="record[column.dataIndex]"
                            @change="handleStatusChange(record.id)"></a-switch>
                  <span :class="record[column.dataIndex] ? '' : 'opacity6'">
                    {{ record[column.dataIndex] ? $t('setting.experience.enabled') : $t('setting.experience.disabled') }}
                  </span>
                </div>
              </template>
              <template v-else-if="column.key === 'created_at'">
                <span class="time" style="color: #8b8b8b">{{ expFormatDate(record[column.dataIndex]) }}</span>
              </template>
            </template>
          </a-table>
        </div>
        <div class="footer">
          <span class="opacity6" style="font-weight: 400;font-size: 14px;padding:12px 16px;"
                v-show="types[currentTypeIndex].data.length > 7">
            {{ $t('setting.experience.totalExperience', { count: types[currentTypeIndex].data.length }) }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <!-- Add Modal -->
  <a-modal :open="showAdd" :footer="null" style="
        width: 60%; border-color: hsla(0, 0%, 100%, .05);
        border-width: 1px; border-radius: 20px; overflow: auto;
        flex-direction: column; max-width: 95%; max-height: 95%;
        " :closable="false" :centered="true" class="modal">
    <div class="modal-main">
      <div class="header">
        <div class="left">
          <h3 style="display: flex;flex-direction: row;justify-items: center;align-items: center;gap: 10px;line-height: 24px;font-weight: 600 ;font-size: 18px;margin-bottom: 0">
            {{ $t('setting.experience.addExperience') }}
          </h3>
        </div>
        <div class="right">
          <a-tooltip>
            <template #title>{{ $t('setting.experience.close') }}</template>
            <closeSvg style="width: 26px;height: 26px" class="icon" @click="showAdd = false;initNewKnowledge()"/>
          </a-tooltip>
        </div>
      </div>
      <div class="modal-content">
        <div class="item">
          <span>{{ $t('setting.experience.titleLabel') }} <span style="color: #eb4d4d">*</span></span>
          <a-input class="input-1" :placeholder="$t('setting.experience.titlePlaceholder')"
                   v-model:value="newKnowledge.title"></a-input>
        </div>
        <div class="item">
          <span>{{ $t('setting.experience.goalLabel') }} <span style="color: #eb4d4d">*</span></span>
          <a-input class="input-1" :placeholder="$t('setting.experience.goalPlaceholder')"
                   v-model:value="newKnowledge.goal"></a-input>
        </div>
        <div class="item">
          <span>{{ $t('setting.experience.contentLabel') }} <span style="color: #eb4d4d">*</span></span>
          <a-textarea class="input-textarea" :placeholder="$t('setting.experience.contentPlaceholder')"
                      :auto-size="{ minRows: 8, maxRows: 8 }" v-model:value="newKnowledge.content"/>
        </div>
        <div class="item-1" style="align-items: center">
          <span>{{ $t('setting.experience.statusLabel') }}</span>
          <a-switch size="small" v-model:checked="newKnowledge.is_enabled"></a-switch>
          <span :class="newKnowledge.is_enabled ? '' : 'opacity6'">
            {{ newKnowledge.is_enabled ? $t('setting.experience.enabled') : $t('setting.experience.disabled') }}
          </span>
        </div>
        <div class="footer">
          <div class="bins">
            <a-button type="default" class="btn-s" @click="showAdd = false;initNewKnowledge()">
              {{ $t('setting.experience.cancel') }}
            </a-button>
            <a-button type="primary" class="btn-s" @click="handleCreateExperience" :disabled="!canBeNew">
              {{ $t('setting.experience.save') }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
  <!-- Edit Modal -->
  <a-modal :open="showEdit" :footer="null" style="
        width: 60%; border-color: hsla(0, 0%, 100%, .05);
        border-width: 1px; border-radius: 20px; overflow: auto;
        flex-direction: column; max-width: 95%; max-height: 95%;
        " :closable="false" @cancel="showEdit = false" :centered="true" class="modal">
    <div class="modal-main">
      <div class="header">
        <div class="left">
          <h3 style="display: flex;flex-direction: row;justify-items: center;align-items: center;gap: 10px;line-height: 24px;font-weight: 600 ;font-size: 18px;margin-bottom: 0">
            {{ $t('setting.experience.editExperience') }}
          </h3>
        </div>
        <div class="right">
          <a-tooltip>
            <template #title>{{ $t('setting.experience.close') }}</template>
            <closeSvg style="width: 26px;height: 26px" class="icon" @click="showEdit = false;currentExperienceId=-1"/>
          </a-tooltip>
        </div>
      </div>
      <div class="modal-content">
        <div class="item">
          <span>{{ $t('setting.experience.titleLabel') }} <span style="color: #eb4d4d">*</span></span>
          <a-input class="input-1" :placeholder="$t('setting.experience.titlePlaceholder')"
                   v-model:value="currentExperienceCopy.title" maxlength=255></a-input>
        </div>
        <div class="item">
          <span>{{ $t('setting.experience.goalLabel') }} <span style="color: #eb4d4d">*</span></span>
          <a-input class="input-1" :placeholder="$t('setting.experience.goalPlaceholder')"
                   v-model:value="currentExperienceCopy.goal"></a-input>
        </div>
        <div class="item">
          <span>{{ $t('setting.experience.contentLabel') }} <span style="color: #eb4d4d">*</span></span>
          <a-textarea class="input-textarea" :placeholder="$t('setting.experience.contentPlaceholder')"
                      :auto-size="{ minRows: 8, maxRows: 8 }" v-model:value="currentExperienceCopy.content"/>
        </div>
        <div class="item-1" style="align-items: center">
          <span>{{ $t('setting.experience.statusLabel') }}</span>
          <a-switch size="small" v-model:checked="currentExperienceCopy.is_enabled"></a-switch>
          <span :class="currentExperienceCopy.is_enabled ? '' : 'opacity6'">
            {{ currentExperienceCopy.is_enabled ? $t('setting.experience.enabled') : $t('setting.experience.disabled') }}
          </span>
        </div>
        <div class="footer">
          <div class="bins">
            <a-button type="default" class="btn-s" danger @click="handleDelete(currentExperienceId, false)">
              {{ $t('setting.experience.delete') }}
            </a-button>
            <a-button type="default" class="btn-s" @click="handleCopy(currentExperienceId)">
              {{ $t('setting.experience.undoChanges') }}
            </a-button>
            <a-button type="primary" class="btn-s" @click="handleUpdateExperience(currentExperienceCopy)"
                      :disabled="!canBeEdit">
              {{ $t('setting.experience.save') }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
// SVG
import cameraSvg from '@/assets/experience/camera.svg';
import planSvg from '@/assets/experience/plan.svg';
import actionSvg from '@/assets/experience/action.svg';
import deleteSvg from '@/assets/svg/delete.svg';
import editSvg from '@/assets/experience/edit.svg';
import addSvg from '@/assets/svg/add.svg';
import updownSvg from '@/assets/experience/updown.svg';
import closeSvg from '@/assets/filePreview/close.svg';
// Services
import experienceService from '@/services/experience.js';
// References
import { computed, onMounted, ref, markRaw, h } from 'vue';
import { Button, Checkbox, message, Modal, Radio } from 'ant-design-vue';

const { t } = useI18n();

// CONST
const columns = [
  {
    title: t('setting.experience.tableTitle'),
    dataIndex: 'title',
    key: 'title',
    width: 100,
    ellipsis: true,
  },
  {
    title: t('setting.experience.tableContent'),
    dataIndex: 'content',
    key: 'content',
    width: 200,
    ellipsis: true,
  },
  {
    title: t('setting.experience.tableCreatedAt'),
    dataIndex: 'create_at',
    key: 'created_at',
    width: 50,
  },
  {
    title: t('setting.experience.tableStatus'),
    dataIndex: 'is_enabled',
    key: 'is_enabled',
    width: 50,
    filterMultiple: false,
    filterIcon: (filtered) => {
      return h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, [
        h('span', { style: { color: filtered ? '#000000' : '#000000', fontSize: '14px', fontWeight: '600' } }, t('setting.experience.tableStatus')),
        h(updownSvg, { style: { width: '16px', height: '16px', color: '#8b8b8b' } }),
      ]);
    },
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      return h(
          'div',
          { style: { padding: '8px', minWidth: '100px' } },
          [
            h('div', { style: { fontSize: '14px', fontWeight: '600', marginBottom: '8px' } }, t('setting.experience.tableStatus')),
            h(
                Radio.Group,
                {
                  value: selectedKeys[0] ?? 'all',
                  onChange: (e) => {
                    const value = e.target.value;
                    setSelectedKeys([value]);
                    confirm();
                  },
                  style: { display: 'flex', flexDirection: 'column', gap: '8px' },
                },
                {
                  default: () => [
                    h(Radio, { value: 'all', style: { display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'flex-end' } }, () => t('setting.experience.filterAll')),
                    h(Radio, { value: true, style: { display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'flex-end' } }, () => t('setting.experience.enabled')),
                    h(Radio, { value: false, style: { display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'flex-end' } }, () => t('setting.experience.disabled')),
                  ],
                }
            ),
          ]
      );
    },
    onFilter: (value, record) => {
      if (value === 'all') return true;
      return record.is_enabled === value;
    },
    filters: [
      { text: t('setting.experience.filterAll'), value: 'all' },
      { text: t('setting.experience.enabled'), value: true },
      { text: t('setting.experience.disabled'), value: false },
    ],
  },
  {
    title: t('setting.experience.tableOperation'),
    key: 'operation',
    width: 50,
  },
];

// ref
const showAdd = ref(false);
const showEdit = ref(false);
const currentTypeIndex = ref(0);
const currentExperienceId = ref(-1);
const currentExperienceCopy = ref({});
const types = ref([
  // {
  //   id: 0,
  //   title: t('setting.experience.detect'),
  //   type: 'detect',
  //   des: '',
  //   icon: markRaw(cameraSvg),
  //   data: [],
  // },
  {
    id: 1,
    title: t('setting.experience.plan'),
    type: 'plan',
    des: '',
    icon: markRaw(planSvg),
    data: [],
  },
  // {
  //   id: 2,
  //   title: t('setting.experience.action'),
  //   type: 'action',
  //   des: '',
  //   icon: markRaw(actionSvg),
  //   data: [],
  // },
]);
const newKnowledge = ref({
  title: '',
  type: 'detect',
  goal: '',
  content: '',
  is_enabled: true,
});

// computed var
const canBeNew = computed(() => {
  return newKnowledge.value.title.trim() !== '' && newKnowledge.value.content.trim() !== '' && newKnowledge.value.goal.trim() !== '';
});
const canBeEdit = computed(() => {
  return currentExperienceCopy.value?.title.trim() !== '' && currentExperienceCopy.value?.content.trim() !== '' && currentExperienceCopy.value?.goal.trim() !== '';
});

// Custom functions
function handleType(type) {
  currentTypeIndex.value = types.value.findIndex(item => item.id === type.id);
}

function handleDelete(id, confirm = true) {
  if (confirm) {
    Modal.confirm({
      title: t('setting.experience.deleteExperience'),
      icon: null,
      content: t('setting.experience.deleteConfirm'),
      okText: t('setting.experience.delete'),
      okType: 'danger',
      closable: true,
      centered: true,
      cancelText: t('setting.experience.cancel'),
      onOk() {
        experienceService.deleteExperience(id).then(res => {
          message.success(t('setting.experience.deleteSuccess'));
          init(currentTypeIndex.value);
        }).catch(err => {
          message.error(t('setting.experience.deleteFailed'));
        });
      },
    });
  } else {
    experienceService.deleteExperience(id).then(res => {
      message.success(t('setting.experience.deleteSuccess'));
      init(currentTypeIndex.value);
      showEdit.value = false;
    }).catch(err => {
      message.error(t('setting.experience.deleteFailed'));
    });
  }
}

function handleCreateExperience() {
  if (canBeNew.value) {
    newKnowledge.value.type = types.value[currentTypeIndex.value].type;
    experienceService.createExperience(newKnowledge.value).then(res => {
      message.success(t('setting.experience.createSuccess'));
      initNewKnowledge();
      init(currentTypeIndex.value);
      showAdd.value = false;
    }).catch(err => {
      message.error(t('setting.experience.createFailed'));
    });
  }
}

function initNewKnowledge() {
  newKnowledge.value = {
    title: '',
    type: '',
    goal: '',
    content: '',
    is_enabled: true,
  };
}

function handleStatusChange(id) {
  const item = types.value[currentTypeIndex.value].data.find(item => item.id === id);
  if (item) {
    experienceService.updateExperience({
      id: item.id,
      type: item.type,
      title: item.title,
      goal: item.goal,
      content: item.content,
      is_enabled: !item.is_enabled,
    }).then(res => {
    }).catch(err => {
      message.error(t('setting.experience.updateFailed'));
    });
  } else {
    message.error(t('setting.experience.updateFailedDataNotExist'));
  }
}

function handleUpdateExperience(experience) {
  experienceService.updateExperience({
    id: experience.id,
    type: experience.type,
    title: experience.title,
    goal: experience.goal,
    content: experience.content,
    is_enabled: experience.is_enabled,
  }).then(res => {
    message.success(t('setting.experience.updateSuccess'));
    init(currentTypeIndex.value);
    showEdit.value = false;
  });
}

function handleCopy(id) {
  const item = types.value[currentTypeIndex.value].data.find(item => item.id === id);
  if (item) {
    currentExperienceCopy.value = JSON.parse(JSON.stringify(item));
    showEdit.value = true;
  }
}

function init(index) {
  for (let i = 0; i < types.value.length; i++) {
    experienceService.getExperienceByType(types.value[i].type).then(res => {
      types.value[i].data = res;
    }).catch(err => {
      message.error(t('setting.experience.getDataError'));
    });
  }
  currentTypeIndex.value = index;
}

function expFormatDate(date_str) {
  const date = new Date(date_str);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();
  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth();
  const targetDate = date.getDate();
  const targetHours = String(date.getHours()).padStart(2, '0');
  const targetMinutes = String(date.getMinutes()).padStart(2, '0');

  if (targetYear === currentYear && targetMonth === currentMonth && targetDate === currentDate) {
    return `${targetHours}:${targetMinutes}`;
  }

  const startOfWeek = new Date(now.setDate(currentDate - now.getDay()));
  const endOfWeek = new Date(now.setDate(currentDate + (6 - now.getDay())));
  if (date >= startOfWeek && date <= endOfWeek) {
    const weekdays = [
      t('setting.experience.sunday'),
      t('setting.experience.monday'),
      t('setting.experience.tuesday'),
      t('setting.experience.wednesday'),
      t('setting.experience.thursday'),
      t('setting.experience.friday'),
      t('setting.experience.saturday'),
    ];
    return weekdays[date.getDay()];
  }

  if (targetYear === currentYear) {
    const month = String(targetMonth + 1).padStart(2, '0');
    const day = String(targetDate).padStart(2, '0');
    return `${month}-${day}`;
  }

  return t('setting.experience.earlier');
}

onMounted(() => {
  init(0);
});
</script>

<style lang="scss" scoped>
.experience {
  padding: 16px;
  height: 100%;
  overflow-y: hidden;

  .main {
    display: flex;
    flex-direction: row;
    padding: 1px;

    .sidebar {
      width: 250px;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      height: 80vh;

      .list {
        overflow-y: auto;
        height: 80vh;
        overflow-x: hidden;
        //padding: 8px;
        box-sizing: border-box;

        .item {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 8px;
          gap: 8px;
          border-radius: 4px;
          margin-bottom: 8px;
          height: 38px;

          .icon {
            width: 20px;
            height: 20px;
          }
        }

        .item:hover {
          background-color: #f0f0f0;
        }

        .active {
          background-color: #f0f0f0;
        }
      }
    }

    .content {
      flex: 5;
      display: flex;
      flex-direction: column;
      //overflow-y: auto;
      box-sizing: border-box;

      .header {
        display: flex;
        flex-direction: column;
        font-weight: bold;
        font-size: 18px;
        padding: 12px 16px;

        .des {
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;

          .description {
            font-size: 14px;
            opacity: 0.6;
          }

          .btn-add:hover {
            background-color: #f3f3f3;
            color: black;
          }
        }
      }

      .list {
        padding: 12px 16px;

        :deep(.ant-table-thead > tr > th) {
          background-color: white;
          font-weight: bold;
          border: none;
        }

        :deep(.ant-btn-link) {
          padding: 0 8px;
          border: none;
        }

        :deep(.ant-table-tbody > tr > td) {
          border: none;
        }

        :deep(.ant-table-tbody) {
          overflow-y: auto;
        }

        :deep(.ant-table-tbody::-webkit-scrollbar) {
          width: 2px;
        }
      }
    }
  }
}


.modal-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 1.25rem 24px 10px;
  gap: 0.5rem;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .right {

    }
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .item {
      display: flex;
      gap: .375rem;
      flex-direction: column;

      .input-1 {
        padding: 8px 12px 8px 16px;
        padding-inline-end: 34px;
      }

      .input-2 {
        display: flex;

        //height: 180px;
        padding: 8px 12px 8px 16px;
        padding-inline-end: 34px;
      }
    }

    .item-1 {
      display: flex;
      gap: 8px;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 100px;

      .bins {
        display: flex;
        padding: 10px 0px;
        gap: 10px;

        .btn-s {
          height: 36px !important;
        }
      }

      //高度为剩余全部高度
    ;
      //放置于窗口底部

    }
  }


}

.a-table :deep(.ant-table-body::-webkit-scrollbar) {
  width: 4px; /* 滚动条宽度 */
}

.a-table :deep(.ant-table-body::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.2); /* 滑块颜色 */
  border-radius: 4px; /* 滑块圆角 */
}

.a-table :deep(.ant-table-body::-webkit-scrollbar-track) {
  background-color: transparent; /* 轨道颜色 */
}
//操作按钮添加悬停相关样式
.a-table .ant-table-tbody > tr.ant-table-row .operation-buttons {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease; /* 添加平滑过渡 */
  //transition: opacity 0.3s ease, visibility 0.3s ease;
}

.a-table .ant-table-tbody > tr.ant-table-row:hover .operation-buttons {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s ease;
}
</style>

<style>

.btn {
  display: flex;
  justify-items: center;
  align-items: center;
  padding: 10px;
  flex-direction: row;
}

.btn:hover {
  background-color: #ededed;
}

.icon:hover {
  background-color: #ededed;
  border-radius: 8px;
}


.modal .ant-modal-content {
  padding: 0 !important;
  height: 680px !important;
  width: 100%;
  border: none !important;
}

.opacity6 {
  opacity: 0.6;
}

.input-textarea::-webkit-scrollbar {
  width: 4px;
}

.input-textarea::-webkit-scrollbar-thumb {
  background-color: #9f9f9f;
  border-radius: 3px;
}

.input-textarea::-webkit-scrollbar-track {
  background-color: #cdcdcd;
}
</style>