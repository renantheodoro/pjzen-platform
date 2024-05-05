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
        <h3>Selecionar cliente</h3>

        <a @click.prevent="close">
          <img src="@/assets/images/icons/times-blue.svg" alt="" />
        </a>
      </div>

      <div class="sidebar-filter__row">
        <div class="input-field width-full no-mgn-b">
          <label class="label-wrapper">
            <input
              type="text"
              id="input-client-list-search"
              placeholder="Buscar"
              class="input--darkened"
              v-model="search"
            />
            <img
              src="@/assets/images/icons/search.svg"
              class="input-field__icon"
            />
          </label>
        </div>
      </div>

      <div class="divider"></div>

      <ul class="sidebar-filter__list">
        <!-- Iterar sobre o objeto clientList -->
        <li v-for="(clients, letter) in filteredList" :key="letter">
          <span class="letter">{{ letter }}</span>
          <!-- Iterar sobre os clientes dentro de cada letra -->
          <ul>
            <li v-for="client in clients" :key="client">
              <router-link
                :to="{ name: 'client', params: { id: client.id } }"
                >{{ client.name }}</router-link
              >
            </li>
          </ul>
        </li>

        <li v-if="Object.keys(filteredList).length <= 0 && this.search != ''">
          Não foram encontrados clientes com o termo:
          <span class="letter">{{ this.search }}</span>
        </li>

        <li v-if="Object.keys(filteredList).length <= 0 && this.search == ''">
          <span class="letter">Não foram encontrados clientes.</span>
        </li>
      </ul>
    </div>

    <div class="sidebar-filter__footer">
      <a @click.prevent="changeClient" class="button button--primary">
        Confirmar
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-sidebar-client-search",

  props: {
    currentClientList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      search: "",

      clientList: [],

      showSidebarFilter: false,
    };
  },

  created() {
    this.sortClients();
  },

  computed: {
    filteredList() {
      if (this.search && this.search.trim() !== "") {
        const searchTerm = this.search.toLowerCase(); // Converter o termo de pesquisa para minúsculas

        // Filtrar os clientes com base no termo de pesquisa
        const filteredClients = Object.keys(this.clientList).reduce(
          (acc, letter) => {
            const filteredClientsForLetter = this.clientList[letter].filter(
              (client) => client.toLowerCase().includes(searchTerm)
            );
            if (filteredClientsForLetter.length > 0) {
              acc[letter] = filteredClientsForLetter;
            }
            return acc;
          },
          {}
        );

        return filteredClients;
      } else {
        return this.clientList;
      }
    },
  },

  methods: {
    sortClients() {
      // Criar um objeto vazio para armazenar os clientes agrupados por letra inicial
      const groupedClients = {};

      // Iterar sobre a lista de clientes atual
      this.currentClientList.forEach((client) => {
        // Extrair a primeira letra do nome do cliente
        let firstLetter = client.businessName[0].toUpperCase();

        // Se a primeira letra for um número, encontrar a primeira letra válida na string
        if (/^\d/.test(firstLetter)) {
          const validFirstLetterMatch = client.businessName.match(/[A-Za-z]/);
          if (validFirstLetterMatch) {
            firstLetter = validFirstLetterMatch[0].toUpperCase();
          }
        }

        // Adicionar o cliente ao grupo correspondente à sua letra inicial
        if (!groupedClients[firstLetter]) {
          groupedClients[firstLetter] = [];
        }
        groupedClients[firstLetter].push({
          id: client.cpfCnpj, // Adicionar o ID do cliente
          name: client.businessName, // Adicionar o nome do cliente
        });
      });

      // Ordenar os grupos alfabeticamente e os clientes dentro de cada grupo
      const sortedGroupedClients = {};
      Object.keys(groupedClients)
        .sort()
        .forEach((key) => {
          sortedGroupedClients[key] = groupedClients[key].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        });

      // Atribuir a lista de clientes ao data clientList
      this.clientList = sortedGroupedClients;
    },

    show() {
      this.showSidebarFilter = true;
    },

    close() {
      this.showSidebarFilter = false;
    },

    changeClient() {},
  },
};
</script>
<style lang=""></style>
