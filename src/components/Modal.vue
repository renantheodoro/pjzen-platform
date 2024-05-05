<template lang="">
  <div
    :class="{ active: isModalOpen }"
    class="modal-overlay"
    @click="close()"
  ></div>
  <div
    :key="modalKey"
    :class="{
      active: isModalOpen,
      'modal--center': textCenter,
      'modal--form': modalForm,
      'modal--popup': modalPopup,
    }"
    ref="modal"
    class="modal card"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "app-modal",

  props: {
    modalForm: {
      type: Boolean,
      default: false,
    },
    modalPopup: {
      type: Boolean,
      default: false,
    },
    textCenter: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isModalOpen: false,
      modalKey: 0,
    };
  },

  methods: {
    open() {
      this.isModalOpen = true;
    },

    close() {
      this.modalKey++;
      this.isModalOpen = false;
    },
  },

  components: {
    // TestimonialVideo
  },
};
</script>
<style lang=""></style>
