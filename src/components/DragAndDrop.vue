<template>
  <div class="drag-and-drop-holder">
    <Toast
      ref="toast"
      type="error"
      title="Arquivo inválido"
      text="O tipo de arquivo é inválido. Selecione um arquivo em formato .PFX ou .P10."
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
      <div v-if="files.length > 0" class="drag-and-drop__viewer">
        <div v-for="(file, index) in files" :key="index">
          <p>
            <img
              src="@/assets/images/icons/file-drop.svg"
              class="drag-and-drop__instructions__icon"
            />
            {{ file.name }}
          </p>
        </div>
      </div>

      <div v-else class="drag-and-drop__instructions">
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
import Toast from "@/components/Toast.vue";

export default {
  name: "app-drag-and-drop",

  components: {
    Toast,
  },

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
    };
  },

  methods: {
    handleDragOver() {
      this.isDragging = true;
    },

    handleDragEnter() {
      this.isDragging = true;
    },

    handleDragLeave() {
      this.isDragging = false;
    },

    handleDrop(event) {
      this.isDragging = false;
      const firstFile = event.dataTransfer.files[0];
      if (firstFile) {
        this.handleFiles([firstFile]);
      }
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

    validateFile(file) {
      if (!file) {
        return false;
      }

      const validExtensions = [".PFX", ".P12"];
      const fileName = file.name.toUpperCase();
      return validExtensions.some((ext) => fileName.endsWith(ext));
    },

    saveFile(file) {
      this.files = [file];
      this.emitFile(file);
    },

    handleFiles(fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (this.validateFile(file)) {
          this.saveFile(file);
        } else {
          this.showErrorToast();
        }
      }
    },

    emitFile(file) {
      this.$emit("onFileSelected", file);
    },
  },
};
</script>

<style lang=""></style>
