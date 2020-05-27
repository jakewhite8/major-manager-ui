<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{currentUser.email}}</strong> Profile
      </h3>
    </header>
    <p>
      <router-link to="/active-tournaments" class="nav-link">
        <font-awesome-icon icon="user-plus" />Join Tournament
      </router-link>
    </p>
    <p>
      <router-link to="/active-teams" class="nav-link">
        <font-awesome-icon icon="user-plus" />Active Teams
      </router-link>
    </p>
    <p>
      <router-link to="/past-teams" class="nav-link">
        <font-awesome-icon icon="user-plus" />Past Results
      </router-link>
    </p>
    <p>
      <strong>Id:</strong>
      {{currentUser.id}}
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
