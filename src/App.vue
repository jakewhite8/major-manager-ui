<template>
  <div id="app">
    <vue-title title="Golf Pools"></vue-title>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link
              to="/home"
              class="nav-link"
              data-bs-toggle="tooltip"
              data-placement="bottom"
              title="Home">
            <font-awesome-icon icon="home" />
          </router-link>
        </li>
        <li v-if="showAdminPage" class="nav-item">
          <router-link to="/admin" class="nav-link">Admin Page</router-link>
        </li>
        <li v-if="showModeratorPage" class="nav-item">
          <router-link to="/mod" class="nav-link">Moderator Page</router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
        </li> -->
        <li class="nav-item">
          <router-link v-if="currentUser" to="/league-leaderboard" class="nav-link">
            League Leaderboard
          </router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link
              to="/register"
              class="nav-link"
              data-bs-toggle="tooltip"
              data-placement="bottom"
              title="Register">
            <font-awesome-icon icon="user-plus" />Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
              to="/login"
              id="nav-bar-login-button"
              class="nav-link"
              data-bs-toggle="tooltip"
              data-placement="bottom"
              title="Login">
            <font-awesome-icon icon="sign-in-alt" />Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item"
            data-bs-toggle="tooltip"
            data-bs-title="Profile">
          <router-link
              to="/profile"
              class="nav-link"
              data-bs-toggle="tooltip"
              data-placement="bottom"
              title="Profile">
            <font-awesome-icon icon="user" />
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
              to="/settings"
              class="nav-link"
              data-bs-toggle="tooltip"
              data-placement="bottom"
              title="Settings">
            <font-awesome-icon icon="cog"/>
          </router-link>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href @click.prevent="logOut"
            data-bs-toggle="tooltip"
            data-placement="bottom"
            title="Logout">
            <font-awesome-icon icon="sign-out-alt" />
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>

// import { Tooltip } from "bootstrap";
// new Tooltip(document.body, {
//   selector: "[data-bs-toggle='tooltip']",
// });

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminPage() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes(3);
      }

      return false;
    },
    showModeratorPage() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes(2);
      }

      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
  },
};
</script>
<style>
  .nav-item svg {
    font-size: 25px;
  }
</style>
