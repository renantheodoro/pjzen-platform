<template>
  <div class="card table-section">
    <div class="table-section__body">
      <div v-if="!tableContent.body.length">
        Não foram encontrados certificados para serem exibidos.
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
              <div class="body-item--name" v-if="bodyItem.type === 'name'">
                {{ bodyItem.content }}
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
            <td class="text-right">
              <a @click.prevent="$emit('onDeleteCertificate', bodyIndex)">
                <img src="@/assets/images/icons/trash-filled.svg" />
              </a>
              <!-- <Dropdown>
                <li>
                  <a @click.prevent="$emit('onEditService', bodyIndex)">
                    <img src="@/assets/images/icons/pencil.svg" />
                    Editar
                  </a>
                </li>
                <li>
                  <a @click.prevent="$emit('onDeleteService', bodyIndex)">
                    <img src="@/assets/images/icons/trash.svg" />
                    Excluir
                  </a>
                </li>
              </Dropdown> -->
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
// import Dropdown from "@/components/Dropdown.vue";

export default {
  name: "app-table-section",

  components: {
    // /zDropdown,
  },

  props: {
    content: {
      type: Object,
      required: true,
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
};
</script>
<style lang=""></style>
