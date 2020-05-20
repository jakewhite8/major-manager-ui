<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        Player Selection
      </h3>
    </header>
    <p>
      <router-link to="/tournament-player-selection" class="nav-link">
        2020 PGA Championship
      </router-link>
    </p>
    <p>
      <router-link to="/tournament-player-selection" class="nav-link">
        2020 British Open
      </router-link>
    </p>
    <p>
      <strong>Email:</strong>
      {{currentUser.email}}
    </p>
    <strong>Authorities:</strong>
    <ul>
      <li v-for="(role,index) in currentUser.roles" :key="index">{{role}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },
};
</script>
