<template lang="">
  <div
    :class="{ 'sidebar-overlay--visible': showSidebarFilter }"
    @click="close"
    class="sidebar-overlay"
  ></div>

  <div
    :class="{ 'sidebar-filter--visible': showSidebarFilter }"
    class="sidebar-filter"
  >
    <div class="sidebar-filter__wrapper">
      <div class="sidebar-filter__row">
        <h3>Filtra por</h3>

        <a @click.prevent="close">
          <img src="@/assets/images/icons/times-blue.svg" alt="" />
        </a>
      </div>

      <div class="sidebar-filter__row">
        <h4>Status de cliente</h4>
      </div>

      <div class="sidebar-filter__row">
        <div class="input-field input-field--checkbox">
          <label class="label-wrapper">
            <input type="checkbox" v-model="filter.searchForActive" />
            <div class="checkbox__checkmark"></div>
            <div class="checkbox__body">Ativo</div>
          </label>
        </div>
      </div>

      <div class="sidebar-filter__row">
        <div class="input-field input-field--checkbox">
          <label class="label-wrapper">
            <input type="checkbox" v-model="filter.searchForInactive" />
            <div class="checkbox__checkmark"></div>
            <div class="checkbox__body">Inativo</div>
          </label>
        </div>
      </div>
    </div>

    <div class="sidebar-filter__footer">
      <a @click.prevent="cleanFilter" class="button button--outline">
        Limpar filtro
      </a>
      <a @click.prevent="applyFilter" class="button button--primary">
        Aplicar filtro
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-sidebar-client-filter",

  props: {
    currentClientList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      search: "",
      showSidebarFilter: false,

      filter: {
        searchForActive: false,
        searchForInactive: false,
      },
    };
  },

  created() {},

  computed: {},

  methods: {
    show() {
      this.showSidebarFilter = true;
    },

    close() {
      this.showSidebarFilter = false;
    },

    cleanFilter() {
      this.filter = {
        searchForActive: false,
        searchForInactive: false,
      };
      this.$emit("applyFilter", this.filter);
    },

    applyFilter() {
      this.$emit("applyFilter", this.filter);
    },
  },
};
</script>
<style lang=""></style>
