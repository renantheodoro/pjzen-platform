<template>
  <div class="drag-and-drop-holder">
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
            :pdf="file.blobUrl"
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

    <div v-if="isValid === false" class="input-field">
      <span class="helper-text helper-text--error">{{ errorMessage }}</span>
    </div>
  </div>
</template>
<script>
import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";
import Toast from "@/components/Toast.vue";

export default {
  name: "app-drag-and-drop",

  props: {
    isValid: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      files: [],
      isDragging: false,
      numPages: 0,
    };
  },

  methods: {
    handleDragOver() {
      // console.log("handleDragOver");
      this.isDragging = true;
    },

    handleDragEnter() {
      // console.log("handleDragEnter");
      this.isDragging = true;
    },

    handleDragLeave() {
      // console.log("handleDragLeave");
      this.isDragging = false;
    },

    async handleDrop(event) {
      this.isDragging = false;

      const firstFile = event.dataTransfer.files[0];

      if (firstFile) {
        await this.handleFiles([firstFile]);
      }
    },

    formatSize(size) {
      const mbSize = size / (1024 * 1024);
      return mbSize.toFixed(2);
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

    isPDF(file) {
      return file && file.type === "application/pdf";
    },

    emitFile(file) {
      this.$emit("onFileSelected", file.blobUrl);
    },

    getPreview(file) {
      return URL.createObjectURL(file);
    },

    saveFile(file) {
      const blobUrl = this.getPreview(file);
      const fileToBeSaved = {
        name: file.name,
        size: file.size,
        blobUrl,
      };
      this.files = [];
      this.files.push(fileToBeSaved);
      this.emitFile(fileToBeSaved);
    },

    async handleFiles(fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        if (this.isPDF(file) && this.formatSize(file.size) < 300) {
          // arquivo deve ser menor que 300mb
          this.saveFile(file);
        } else {
          this.showErrorToast();
        }
      }
    },
  },

  components: { VuePdfApp, Toast },
};
</script>
<style lang=""></style>
