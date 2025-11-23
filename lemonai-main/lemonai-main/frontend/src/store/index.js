/**
 * @author YuGao 540846283@qq.com
 */
// https://pinia.vuejs.org/zh/core-concepts/
import { createPinia } from 'pinia'
// https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState())

export default pinia;
