<template>
    <pdfPreview v-if="fileExtendName==='pdf' " :pdfArrayBuffer="content"/>
    <xlsxPreview v-else-if="fileExtendName==='xlsx' " :xlsxArrayBuffer="content"/>
    <docxPreview v-else-if="fileExtendName==='docx' " :docxArrayBuffer="content"/>
    <div v-else>{{filename}} can be preview</div>
</template>
<script setup>
import { computed, defineProps } from 'vue';
import pdfPreview from '@/components/office/pdfPreview.vue';
import xlsxPreview from '@/components/office/xlsxPreview.vue';
import docxPreview from '@/components/office/docxPreview.vue';
const props = defineProps({
  content: {
    type: [ArrayBuffer],
    default:  null
  },
  filename: {
    type: String,
    default:  ""
  },
})

const fileExtendName = computed(() => {
  return props.filename.split('.').pop();
});
</script>
<style>

</style>