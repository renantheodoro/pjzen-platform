<template>
  <div :class="`card table-section table-section--${tableType.toLowerCase()}`">
    <div v-if="!removeHeader" class="table-section__header">
      <h2 v-if="title">{{ title }}</h2>

      <div class="width-full flex-v-center flex-between">
        <div
          v-if="tableType !== 'SERVICE'"
          class="input-field width-full no-mgn-b"
        >
          <label class="label-wrapper">
            <input
              type="text"
              id="input-client-list-search"
              placeholder="Digite aqui"
              class="input--darkened"
              @keyup.enter="searchList"
            />
            <img
              src="@/assets/images/icons/search.svg"
              class="input-field__icon"
              @click="searchList"
            />
          </label>
        </div>

        <div v-else class="input-field width-full no-mgn-b">
          <button
            @click="$emit('onButtonAction')"
            class="button button--action button--outline"
          >
            <img
              src="@/assets/images/icons/plus-blue.svg"
              class="button--action__icon"
            />
            {{ buttonActionText }}
          </button>

          <label class="label-wrapper">
            <input
              type="text"
              id="input-client-list-search"
              :placeholder="searchText"
              class="input--darkened"
              @keyup.enter="searchList"
            />
            <img
              src="@/assets/images/icons/search.svg"
              class="input-field__icon"
              @click="searchList"
            />
          </label>
        </div>

        <button
          v-if="!removeFilter"
          class="button button--outline button--light button--filter"
        >
          <img
            src="@/assets/images/icons/filter.svg"
            class="button__icon button__icon--left-side"
          />
          Filtros
        </button>
      </div>
    </div>

    <div class="table-section__body">
      <div v-if="!removeSelectAll" class="input-field input-field--checkbox">
        <label class="label-wrapper">
          <input type="checkbox" />
          <div class="checkbox__checkmark"></div>
          <div class="checkbox__body">Selecionar todos</div>
        </label>
      </div>

      <table class="table-section__table">
        <thead>
          <th v-for="(headItem, index) in tableContent.head" :key="index">
            {{ headItem }}
          </th>
        </thead>

        <tbody>
          <tr
            v-for="(bodyList, bodyIndex) in tableContent.body"
            :key="bodyIndex"
          >
            <td v-for="(bodyItem, index) in bodyList" :key="index">
              <div
                v-if="bodyItem.type === 'checkbox'"
                class="input-field input-field--checkbox"
              >
                <label class="label-wrapper">
                  <input type="checkbox" />
                  <div class="checkbox__checkmark"></div>
                  <div class="checkbox__body">
                    {{ bodyItem.content }}
                  </div>
                </label>
              </div>

              <template v-if="bodyItem.type === 'text'">
                {{ bodyItem.content }}
              </template>

              <div
                v-if="bodyItem.type === 'status'"
                :class="`status status--${bodyItem.status}`"
              >
                {{ bodyItem.content }}
              </div>
            </td>
            <td>
              <Dropdown
                v-if="tableType === 'TAKER'"
                classList="dropdown--taker-options"
              >
                <li>
                  <a @click.prevent>
                    <img src="@/assets/images/icons/file-arrow-down.svg" />
                    <img
                      src="@/assets/images/icons/file-arrow-down-hover.svg"
                      class="hover"
                    />
                    Baixar NF
                  </a>
                </li>
                <li>
                  <a @click.prevent>
                    <img src="@/assets/images/icons/eye.svg" />
                    <img
                      src="@/assets/images/icons/eye-hover.svg"
                      class="hover"
                    />
                    Consultar NF
                  </a>
                </li>
                <li>
                  <a @click.prevent>
                    <img src="@/assets/images/icons/file-pdf.svg" />
                    <img
                      src="@/assets/images/icons/file-pdf-hover.svg"
                      class="hover"
                    />
                    Baixar NFIS
                  </a>
                </li>
                <li>
                  <a @click.prevent>
                    <img src="@/assets/images/icons/clone.svg" />
                    <img
                      src="@/assets/images/icons/clone-hover.svg"
                      class="hover"
                    />
                    Duplicar NF
                  </a>
                </li>
                <li>
                  <a @click.prevent class="red">
                    <img src="@/assets/images/icons/ban.svg" />
                    <img src="@/assets/images/icons/ban.svg" class="hover" />
                    Cancelar NF
                  </a>
                </li>
              </Dropdown>
              <Dropdown v-else>
                <li>
                  <a @click.prevent="$emit('onOpenProfile', bodyIndex)">
                    <img src="@/assets/images/icons/dropdown-plus.svg" />
                    Abrir perfil
                  </a>
                </li>
                <li>
                  <a @click.prevent>
                    <img src="@/assets/images/icons/dropdown-plus.svg" />
                    Editar Informações
                  </a>
                </li>
              </Dropdown>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!removePagination" class="table-section__pagination">
        <span class="table-section__pagination__pages">1-20 de 1.500</span>
        <div class="table-section__pagination__buttons">
          <a @click.prevent class="button-prev">
            <img src="@/assets/images/icons/pagination-angle-left.svg" />
          </a>
          <a @click.prevent class="button-next">
            <img src="@/assets/images/icons/pagination-angle-right.svg" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Dropdown from "@/components/Dropdown.vue";

export default {
  name: "app-table-section",

  props: {
    title: {
      type: String,
      required: true,
    },
    tableType: {
      type: String, // TAKER | CLIENT | SERVICE
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    removeHeader: {
      type: Boolean,
      required: false,
      default: false,
    },
    removeSelectAll: {
      type: Boolean,
      required: false,
      default: false,
    },
    removePagination: {
      type: Boolean,
      required: false,
      default: false,
    },
    removeFilter: {
      type: Boolean,
      required: false,
      default: false,
    },
    buttonActionText: {
      type: String,
      required: false,
    },
    searchText: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      tableContent: null,
    };
  },

  created() {
    this.tableContent = this.content;
  },

  methods: {
    searchList() {
      console.log("search list");
    },
  },

  components: {
    Dropdown,
  },
};
</script>
<style lang=""></style>
