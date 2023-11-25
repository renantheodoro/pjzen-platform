<template>
    <aside class="sidebar" :class="{'opened': isSidebarOpened}">
        <router-link to class="sidebar__home-link">
            <img src="@/assets/images/sidebar-logo.png" alt>
        </router-link>

        <nav>
            <ul class="sidebar__view-links">
                <li>
                    <router-link :to="{name: 'dashboard'}"
                        class="sidebar__view-links__link">
                        <img src="@/assets/images/icons/house.svg"
                            class="sidebar__view-links__link__icon sidebar__view-links__link__icon--normal">
                        <img src="@/assets/images/icons/house-active.svg"
                            class="sidebar__view-links__link__icon sidebar__view-links__link__icon--active">

                        <span class="sidebar__view-links__link__text">Home</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/teste" class="sidebar__view-links__link">
                        <img src="@/assets/images/icons/user.svg"
                            class="sidebar__view-links__link__icon sidebar__view-links__link__icon--normal">
                        <img src="@/assets/images/icons/user-active.svg"
                            class="sidebar__view-links__link__icon sidebar__view-links__link__icon--active">

                        <span class="sidebar__view-links__link__text">Clientes</span>
                    </router-link>
                </li>
            </ul>

            <ul class="sidebar__footer">
                <li>
                    <router-link to
                        class="sidebar__footer-links__link sidebar__footer-links__link--notification sidebar__footer-links__link--notification--has-notification">
                        <span class="wrapper">
                            <img src="@/assets/images/icons/bell.svg">
                        </span>
                    </router-link>
                </li>
                <li>
                    <router-link to
                        class="sidebar__footer-links__link sidebar__footer-links__link--profile">
                        <span class="wrapper">
                            <img src="@/assets/images/profile-example.png">
                        </span>
                    </router-link>
                </li>
            </ul>
        </nav>

        <button @click.prevent="toggleSidebar" class="sidebar__button">
            <img src="@/assets/images/icons/angle-right.svg"
                class="sidebar__button__icon">
        </button>
    </aside>
</template>
<script>
export default {
    name:  "app-sidebar",

    data() {
        return {
            isSidebarOpened: false,
        }
    },

    methods: {
        toggleSidebar() {
            this.isSidebarOpened = !this.isSidebarOpened;
        }
    },
}
</script>
<style lang>
    
</style>