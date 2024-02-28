<template>
  <div class="input-field input--autocomplete">
    <label for="">{{ label }}</label>
    <label class="label-wrapper">
      <input
        type="text"
        ref="autocompleteField"
        :placeholder="placeholder"
        @focusin="focusIn = true"
        @input="$emit('input', $value)"
        v-model="currentValue"
        @blur="$emit('blur')"
      />

      <img
        src="@/assets/images/icons/search.svg"
        class="input-field__icon"
        @click="searchList"
      />

      <ul v-if="focusIn" class="autocomplete-list">
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
  },

  data() {
    return {
      focusIn: false,
      currentValue: null,
    };
  },

  computed: {
    filteredList() {
      if (this.currentValue === null || this.currentValue === "") {
        return this.itemList;
      }

      return this.itemList.filter((item) =>
        item.toLowerCase().includes(this.currentValue.toLowerCase())
      );
    },
  },

  methods: {
    selectItem(item) {
      this.currentValue = item;
      this.focusIn = false;

      this.$emit("onSelect", this.currentValue);
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
