<template>
  <div class="container">
    <PageTitle
      :customField=teamNameHeader
      :title="`Profile`" />
    <div class="profile-buttons row">
      <div class="col-12 col-lg-4 mb-3">
        <button
        type="button"
        class="btn btn-lg btn-block"
        v-on:click="routeTo('active-tournaments')">
          Join Tournament
        </button>
      </div>
      <div class="col-12 col-lg-4 mb-3">
        <button
        type="button"
        class="btn btn-lg btn-block"
        v-on:click="routeTo('active-teams')">
          Active Teams
        </button>
      </div>
      <div class="col-12 col-lg-4">
        <button
        type="button"
        class="btn btn-lg btn-block"
        v-on:click="routeTo('past-teams')">
          Current and Past Results
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle.vue';

export default {
  name: 'Profile',
  components: {
    PageTitle,
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    teamNameHeader() {
      return this.$store.state.auth.user.team_name + (this.$store.state.auth.user.team_name.charAt(this.$store.state.auth.user.team_name.length - 1) === 's' ? '\'' : '\'s');
    },
  },
  methods: {
    routeTo(route) {
      this.$router.push(route);
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },
};
</script>
<style scoped>
  .profile-buttons {
    margin-bottom: 2rem;
  }
  .profile-buttons button {
    background-color: #343a40;
    color: rgba(255,255,255,.75);
  }
  .profile-buttons button:hover {
    color: white;
  }
</style>
