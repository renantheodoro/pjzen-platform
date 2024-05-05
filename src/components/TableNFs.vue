<template>
  <div :class="`card table-section table-section--taker`">
    <div v-if="!removeHeader" class="table-section__header">
      <h2 v-if="title">{{ title }}</h2>

      <div class="width-full flex-v-center flex-between">
        <div class="input-field width-full no-mgn-b">
          <!-- <button
            @click="$emit('onButtonAction')"
            class="button button--action button--outline"
          >
            <img
              src="@/assets/images/icons/plus-blue.svg"
              class="button--action__icon"
            />
            {{ buttonActionText }}
          </button> -->

          <label class="label-wrapper">
            <input
              type="text"
              id="input-client-list-search"
              placeholder="Busque pela nota fiscal de serviço"
              class="input--darkened"
              v-model="search"
            />
            <img
              src="@/assets/images/icons/search.svg"
              class="input-field__icon"
            />
          </label>
        </div>

        <!-- <button
          v-if="!removeFilter"
          class="button button--outline button--light button--filter"
        >
          <img
            src="@/assets/images/icons/filter.svg"
            class="button__icon button__icon--left-side"
          />
          Filtros
        </button> -->
      </div>
    </div>

    <div class="table-section__body">
      <!-- <div v-if="!removeSelectAll" class="input-field input-field--checkbox">
        <label class="label-wrapper">
          <input type="checkbox" />
          <div class="checkbox__checkmark"></div>
          <div class="checkbox__body">Selecionar todos</div>
        </label>
      </div> -->

      <div v-if="!tableContent.body.length">
        Não foram encontradas notas fiscais para serem exibidas.
      </div>

      <div v-if="tableContent.body.length && !filteredTableBody.length">
        Nenhum resultado para o termo: <strong>{{ this.search }}</strong>
      </div>

      <table
        v-if="
          tableContent.body.length > 0 &&
          (this.search === '' || filteredTableBody.length > 0)
        "
        class="table-section__table"
      >
        <thead>
          <th
            v-for="(headItem, index) in tableContent.head"
            :key="index"
            :colspan="index + 1 === tableContent.head.length ? '2' : '1'"
          >
            {{ headItem }}
          </th>
        </thead>

        <tbody>
          <tr
            v-for="(bodyList, bodyIndex) in filteredTableBody"
            :key="bodyIndex"
          >
            <td v-for="(bodyItem, index) in bodyList" :key="index">
              <!-- <div
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
              </div> -->

              <template v-if="bodyItem.type === 'name'">
                <a @click.prevent="$emit('consult', bodyIndex)">
                  {{ bodyItem.content }}
                </a>
              </template>

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
            <td class="text-right">
              <Dropdown classList="dropdown--taker-options">
                <li>
                  <a @click.prevent="$emit('downloadNf', bodyIndex)">
                    <img src="@/assets/images/icons/file-arrow-down.svg" />
                    <img
                      src="@/assets/images/icons/file-arrow-down-hover.svg"
                      class="hover"
                    />
                    Baixar NF
                  </a>
                </li>
                <li>
                  <a @click.prevent="$emit('consult', bodyIndex)">
                    <img src="@/assets/images/icons/eye.svg" />
                    <img
                      src="@/assets/images/icons/eye-hover.svg"
                      class="hover"
                    />
                    Consultar NF
                  </a>
                </li>
                <!-- <li>
                  <a @click.prevent>
                    <img src="@/assets/images/icons/file-pdf.svg" />
                    <img
                      src="@/assets/images/icons/file-pdf-hover.svg"
                      class="hover"
                    />
                    Baixar NFIS
                  </a>
                </li> -->
                <li>
                  <a @click.prevent="$emit('duplicate', bodyIndex)">
                    <img src="@/assets/images/icons/clone.svg" />
                    <img
                      src="@/assets/images/icons/clone-hover.svg"
                      class="hover"
                    />
                    Duplicar NF
                  </a>
                </li>
                <li>
                  <a @click.prevent="$emit('cancel', bodyIndex)" class="red">
                    <img src="@/assets/images/icons/ban.svg" />
                    <img src="@/assets/images/icons/ban.svg" class="hover" />
                    Cancelar NF
                  </a>
                </li>
              </Dropdown>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- <div v-if="!removePagination" class="table-section__pagination">
        <span class="table-section__pagination__pages">1-20 de 1.500</span>
        <div class="table-section__pagination__buttons">
          <a @click.prevent class="button-prev">
            <img src="@/assets/images/icons/pagination-angle-left.svg" />
          </a>
          <a @click.prevent class="button-next">
            <img src="@/assets/images/icons/pagination-angle-right.svg" />
          </a>
        </div>
      </div> -->
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
  },

  data() {
    return {
      tableContent: null,
      search: "",
    };
  },

  created() {
    this.tableContent = this.content;
  },

  computed: {
    filteredTableBody() {
      if (this.search && this.search.trim() !== "") {
        const searchTerm = this.search.toLowerCase(); // Converter o termo de pesquisa para minúsculas

        // Filtrar os subarrays cujo pelo menos um item atende aos critérios de filtro
        return this.tableContent.body.filter((subArray) => {
          return subArray.some(
            (item) =>
              item.type === "name" &&
              item.content.toLowerCase().includes(searchTerm)
          );
          // Converter o conteúdo do item para minúsculas antes de comparar
        });
      } else {
        // Se o v-model search estiver vazio, retorna o array de arrays original sem filtrar
        return this.tableContent.body;
      }
    },
  },

  components: {
    Dropdown,
  },
};
</script>
<style lang=""></style>
