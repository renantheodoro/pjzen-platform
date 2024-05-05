<template>
  <aside class="sidebar" :class="{ opened: isSidebarOpened }">
    <router-link to class="sidebar__home-link">
      <img src="@/assets/images/sidebar-logo.png" alt />
    </router-link>

    <nav>
      <ul class="sidebar__view-links">
        <!-- <li>
          <router-link
            :to="{ name: 'initial' }"
            class="sidebar__view-links__link"
          >
            <img
              src="@/assets/images/icons/house.svg"
              class="sidebar__view-links__link__icon sidebar__view-links__link__icon--normal"
            />
            <img
              src="@/assets/images/icons/house-active.svg"
              class="sidebar__view-links__link__icon sidebar__view-links__link__icon--active"
            />

            <span class="sidebar__view-links__link__text">Home</span>
          </router-link>
        </li> -->
        <li>
          <router-link
            :to="{ name: 'clients' }"
            class="sidebar__view-links__link"
          >
            <img
              src="@/assets/images/icons/user.svg"
              class="sidebar__view-links__link__icon sidebar__view-links__link__icon--normal"
            />
            <img
              src="@/assets/images/icons/user-active.svg"
              class="sidebar__view-links__link__icon sidebar__view-links__link__icon--active"
            />

            <span class="sidebar__view-links__link__text">Clientes</span>
          </router-link>
        </li>
      </ul>

      <ul class="sidebar__footer">
        <!-- <li>
          <router-link
            to
            class="sidebar__footer-links__link sidebar__footer-links__link--notification sidebar__footer-links__link--notification--has-notification"
          >
            <span class="wrapper">
              <img src="@/assets/images/icons/bell.svg" />
            </span>
          </router-link>
        </li> -->
        <li>
          <a
            @click.prevent="toggleConfigBox"
            class="sidebar__footer-links__link sidebar__footer-links__link--profile"
          >
            <span class="wrapper">
              <img src="@/assets/images/profile-image.png" />
            </span>
          </a>
        </li>
      </ul>
    </nav>

    <div v-if="showConfigBox" class="box-config">
      <div class="box-header">
        <img
          src="@/assets/images/profile-image.png"
          class="box-header__image"
        />
        <div class="box-header__content">
          <h3>
            {{ accountName }}
          </h3>
          <p>{{ permission }}</p>
        </div>
      </div>

      <ul class="box-links">
        <li v-if="isAdmin">
          <router-link :to="{ name: 'configuration' }" @click="toggleConfigBox">
            <img src="@/assets/images/icons/cog.svg" alt="" />
            <span> Configurações </span>
          </router-link>
        </li>
        <li class="divider"></li>
        <li>
          <a @click.prevent="logout" @click="toggleConfigBox">
            <img src="@/assets/images/icons/sign-out.svg" alt="" />
            <span> Sair </span>
          </a>
        </li>
      </ul>
    </div>

    <button @click.prevent="toggleSidebar" class="sidebar__button">
      <img
        src="@/assets/images/icons/angle-right.svg"
        class="sidebar__button__icon"
      />
    </button>
  </aside>
</template>
<script>
import { setTokenToSessionStorage } from "@/helpers/session-storage";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";
import {
  setAccountancyDataToLocalStorage,
  setProfileDataToLocalStorage,
  getProfileDataFromLocalStorage,
  getUserSessionStorage,
  setUserSessionStorage,
} from "@/helpers/local-storage";

import {
  USER_SESSION_PROFILE_TYPE,
  USER_SESSION_ACCOUNTANCY_TYPE,
} from "@/data/const/user-session-type.js";

export default {
  name: "app-sidebar",

  data() {
    return {
      isSidebarOpened: false,
      showConfigBox: false,
      currentAccountancy: null,

      profileAccount: null,

      userSession: null,
    };
  },

  computed: {
    isAdmin() {
      return this.userSession?.sessionType === USER_SESSION_ACCOUNTANCY_TYPE;
    },

    permission() {
      switch (this.profileAccount?.permission) {
        case "collaborator":
          return "Colaborador";
        case "editor":
          return "Editor";
        default:
          return "Administrador";
      }
    },

    accountName() {
      if (this.userSession?.sessionType === USER_SESSION_PROFILE_TYPE) {
        return `${this.profileAccount.firstName} ${this.profileAccount.lastName}`;
      } else {
        return `${this.currentAccountancy.firstName} ${this.currentAccountancy.lastName}`;
      }
    },
  },

  methods: {
    toggleSidebar() {
      this.isSidebarOpened = !this.isSidebarOpened;
    },

    toggleConfigBox() {
      this.showConfigBox = !this.showConfigBox;
    },

    getAccountancyData() {
      const accoutanncy = getAccountancyDataFromLocalStorage();
      this.currentAccountancy = accoutanncy;
    },

    getProfileData() {
      const profileData = getProfileDataFromLocalStorage();
      this.profileAccount =
        profileData != "" && profileData != null ? profileData : null;
    },

    getUserSession() {
      const userSession = getUserSessionStorage();
      this.userSession = userSession;
    },

    getData() {
      this.getUserSession();
      this.getAccountancyData();

      if (this.userSession.sessionType === USER_SESSION_PROFILE_TYPE) {
        this.getProfileData();
      }
    },

    logout() {
      setAccountancyDataToLocalStorage("");
      setProfileDataToLocalStorage("");
      setTokenToSessionStorage("");
      setUserSessionStorage("");
      this.$router.push({ name: "login" });
    },
  },

  mounted() {
    this.getData();
  },
};
</script>
<style lang></style>
