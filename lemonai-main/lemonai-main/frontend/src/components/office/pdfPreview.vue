<template>
    <div class="pdf-viewer">
        <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="100%" style="border-radius: 10px;"></iframe>
        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    pdfArrayBuffer: { type: [ArrayBuffer, null], default: null }
});

const pdfUrl = ref(null);
const error = ref(null);

const loadPDF = (arrayBuffer) => {
    if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer) || arrayBuffer.byteLength === 0) {
        error.value = 'invalid PDF data';
        return;
    }
    try {
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        pdfUrl.value = URL.createObjectURL(blob);
    } catch (err) {
        error.value = `load PDF failed: ${err.message}`;
    }
};

watch(() => props.pdfArrayBuffer, (newBuffer) => {
    if (newBuffer) {
        loadPDF(newBuffer);
    }
});

onMounted(() => {
    if (props.pdfArrayBuffer) {
        loadPDF(props.pdfArrayBuffer);
    }
});

onUnmounted(() => {
    if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value);
    }
});
</script>

<style scoped>
.pdf-viewer {
    height: 100%;
    width: 100%;
    margin: 0 auto;
}

.pdf-header {
    margin-bottom: 10px;
}

.error {
    text-align: center;
    padding: 20px;
    color: #d32f2f;
    font-size: 14px;
}
</style>