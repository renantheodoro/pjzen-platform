<template>
  <div class="input-field input--autocomplete">
    <label for="">{{ label }}</label>
    <label class="label-wrapper">
      <input
        type="text"
        ref="autocompleteField"
        v-model="currentValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        @focusin="focusIn = true"
        @blur="$emit('blur')"
        @input="updateValue"
      />

      <img src="@/assets/images/icons/search.svg" class="input-field__icon" />

      <ul v-if="focusIn && !isDisabled" class="autocomplete-list">
        <li
          v-for="(item, index) in filteredList"
          :key="index"
          @click="selectItem(item)"
        >
          {{ item }}
        </li>

        <li v-if="filteredList.length === 0">
          Nada foi encontrado com o termo:
          <strong>{{ this.currentValue }}.</strong>
          Tente novamente.
        </li>
      </ul>
    </label>

    <span v-if="hasError" class="helper-text helper-text--error">{{
      errorMessage
    }}</span>
  </div>
</template>
<script>
export default {
  name: "app-autocomplete",

  props: {
    placeholder: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    itemList: {
      type: Array,
      required: true,
    },
    hasError: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      required: true,
    },
    currentData: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  watch: {
    currentData(newValue) {
      this.currentValue = newValue;
    },
  },

  data() {
    return {
      focusIn: false,
      currentValue: this.currentData,
    };
  },

  computed: {
    filteredList() {
      if (this.currentValue === null || this.currentValue === "") {
        return this.itemList;
      }
      return this.itemList.filter(
        (item) =>
          item.toLowerCase() === this.currentValue.toLowerCase() ||
          item.toLowerCase().includes(this.currentValue.toLowerCase())
      );
    },
  },

  methods: {
    updateValue() {
      // this.focusIn = false;
      this.$emit("updateValue", this.currentValue);
    },

    selectItem(itemSelected) {
      this.currentValue = itemSelected;
      this.focusIn = false;
      this.$emit("selectItem", itemSelected);
    },
  },

  mounted() {
    const self = this;
    window.addEventListener("click", (e) => {
      if (self.focusIn) {
        if (
          e.target.closest(".input--autocomplete") == null ||
          e.target.closest(".input--autocomplete") == undefined
        ) {
          self.focusIn = false;
        }
      }
    });
  },
};
</script>
<style lang=""></style>
