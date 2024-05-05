<template>
  <div class="card table-section">
    <div class="table-section__body">
      <div v-if="!tableContent.body.length">
        Não foram encontrados perfis para serem exibidos.
      </div>

      <div v-if="tableContent.body.length && !filteredTableBody.length">
        Nenhum resultado para o termo: <strong>{{ this.search }}</strong>
      </div>

      <table
        v-if="
          tableContent.body.length > 0 &&
          (this.search === '' || filteredTableBody.length > 0)
        "
        class="table-section__table table-section__table--profiles"
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
                <a
                  @click.prevent="$emit('onEditCollaborator', bodyIndex)"
                  class="button-action"
                >
                  {{ bodyItem.content }}</a
                >
              </div>

              <div class="body-item--text" v-if="bodyItem.type === 'text'">
                {{ bodyItem.content }}
              </div>

              <div
                v-if="bodyItem.type === 'status'"
                :class="`status status--${bodyItem.status}`"
              >
                {{ bodyItem.content }}
              </div>
            </td>

            <td class="text-right">
              <a
                @click.prevent="$emit('onEditCollaborator', bodyIndex)"
                class="button-action"
              >
                <img src="@/assets/images/icons/pencil-blue.svg" />
              </a>
              <a
                @click.prevent="$emit('onDeleteCollaborator', bodyIndex)"
                class="button-action"
              >
                <img src="@/assets/images/icons/trash-filled.svg" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
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
      tableContent: this.content,
      search: "",
    };
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
