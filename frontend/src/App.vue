<template>
  <div class="upload-container" @dragover.prevent @drop.prevent="handleDrop">
    <p v-if="!selectedFile">拖拽图片到此处或点击上传</p>
    <p v-else>已选择文件：{{ selectedFile.name }}</p>
    <input type="file" accept="image/*" ref="fileInput" @change="handleFileSelect" style="display: none;" />
    <button @click="triggerFileInput">选择文件</button>
    <button @click="uploadFile" :disabled="!selectedFile">上传</button>
    <div v-if="uploadResult">
      <p>上传成功：</p>
      <p>文件名：{{ uploadResult.outputFilename }}</p>
      <p>url ：{{process.env.VUE_APP_REMOTE_HOST+'/i/'+uploadResult.outputFilename }}</p>
      <button @click="copyToClipboard(uploadResult.outputFilename)">复制 url 到剪贴板</button>
      <p v-if="copyMessage" class="copy-message">{{ copyMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 文件上传相关变量
const selectedFile = ref(null)
const uploadResult = ref(null)
const fileInput = ref(null)
const copyMessage = ref('')

// 触发文件选择框
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const files = event.target.files
  if (files && files[0]) {
    selectedFile.value = files[0]
  }
}

// 处理拖拽文件
const handleDrop = (event) => {
  const files = event.dataTransfer.files
  if (files && files[0]) {
    selectedFile.value = files[0]
  }
}

// 上传文件
const uploadFile = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await fetch(process.env.VUE_APP_REMOTE_HOST+'/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('上传失败')

    const result = await response.json()
    uploadResult.value = result
  } catch (error) {
    console.error('上传失败:', error)
  }
}

// 复制文件名到剪贴板
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(process.env.VUE_APP_REMOTE_HOST+'/i/'+text)
    copyMessage.value = 'url 已成功复制到剪贴板！'
    setTimeout(() => {
      copyMessage.value = ''
    }, 3000) // 3秒后清除提示信息
  } catch (err) {
    console.error('复制失败:', err)
    copyMessage.value = '复制失败，请手动复制。'
    setTimeout(() => {
      copyMessage.value = ''
    }, 3000) // 3秒后清除提示信息
  }
}
</script>

<style scoped>
.upload-container {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  width: 400px;
  margin: 50px auto;
  border-radius: 10px;
}

button {
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.copy-message {
  margin-top: 10px;
  color: green;
  font-size: 14px;
}
</style>
