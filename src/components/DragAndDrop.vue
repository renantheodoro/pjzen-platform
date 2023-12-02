<template>
  <Toast
    ref="toast"
    type="error"
    title="Arquivo inválido"
    text="O tipo de arquivo é inválido. Selecione um arquivo em formato PDF."
  />

  <div
    class="drag-and-drop"
    :class="{ 'drag-over': isDragging, 'drag-filled': files.length > 0 }"
    @click="openFilePicker"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @drop.prevent="handleDrop"
  >
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="handleFileChange"
    />

    <div class="drag-and-drop__instructions">
      <p class="drag-and-drop__instructions__title">
        <img
          src="@/assets/images/icons/file-drop.svg"
          class="drag-and-drop__instructions__icon"
        />
        Escolha o arquivo
      </p>
      <p class="drag-and-drop__instructions__text">
        ou <br />
        arraste os arquivos aqui
      </p>
    </div>

    <div v-if="files.length > 0" class="drag-and-drop__viewer">
      <template v-for="(file, index) in files" :key="index">
        <vue-pdf-app
          style="width: 100%; height: 100%"
          :pdf="file.preview"
          :page-scale="80"
          :config="{
            toolbar: false,
          }"
        ></vue-pdf-app>
      </template>
    </div>

    <div @dragleave="handleDragLeave" class="drag-and-drop__hover">
      <p class="drag-and-drop__hover__title">Solte o arquivo aqui</p>
    </div>
  </div>
</template>
<script>
import VuePdfApp from "vue3-pdf-app";
// import this to use default icons for buttons
import "vue3-pdf-app/dist/icons/main.css";
import Toast from "@/components/Toast.vue";

export default {
  name: "app-drag-and-drop",

  data() {
    return {
      files: [],
      isDragging: false,
      numPages: 0,
    };
  },
  methods: {
    handleDragOver() {
      console.log("handleDragOver");
      this.isDragging = true;
    },

    handleDragEnter() {
      console.log("handleDragEnter");
      this.isDragging = true;
    },

    handleDragLeave() {
      console.log("handleDragLeave");
      this.isDragging = false;
    },

    async handleDrop(event) {
      console.log("async");
      this.isDragging = false;
      await this.handleFiles(event.dataTransfer.files);
    },

    async handleFiles(fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        if (this.isPDF(file)) {
          this.saveFile(file);
        } else {
          this.showErrorToast();
        }
      }
    },

    isPDF(file) {
      return file && file.type === "application/pdf";
    },

    getPreview(file) {
      const preview = URL.createObjectURL(file);
      return preview;
    },

    saveFile(file) {
      const preview = this.getPreview(file);
      this.files = [];
      this.files.push({ name: file.name, size: file.size, preview });
    },

    formatSize(size) {
      const kbSize = size / 1024;
      if (kbSize < 1024) {
        return kbSize.toFixed(2) + " KB";
      } else {
        const mbSize = kbSize / 1024;
        return mbSize.toFixed(2) + " MB";
      }
    },

    onNumPages(numPages) {
      this.numPages = numPages;
    },

    openFilePicker() {
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const fileInput = event.target;
      this.handleFiles(fileInput.files);
      fileInput.value = "";
    },

    showErrorToast() {
      this.$refs.toast.show();
    },
  },

  components: { VuePdfApp, Toast },
};
</script>
<style lang=""></style>
