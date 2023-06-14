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
    <div class="text-center">
      <h4 class="mb-3">
        League History        
      </h4>
    </div>
    <div class="row">
      <PastTournamentsTable
        :tournaments=tournaments
        :loading=loading
        :headers=headers
        :columns=columns
        :message=message />
    </div>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle.vue';
import PastTournamentsTable from '../components/PastTournamentsTable.vue';
import TournamentService from '../services/tournament.service';

export default {
  name: 'Profile',
  data() {
    return {
      loading: false,
      tournaments: [],
      headers: [],
      columns: [],
      message: '',
    }

  },
  components: {
    PageTitle,
    PastTournamentsTable
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
    this.loading = true;
    TournamentService.getConcludedTournaments().then(
      (response) => {
        this.tournaments = response.data;
        this.headers = ['Tournaments', 'Start Date'];
        this.columns = ['name', 'start_date'];
        this.loading = false;
      },
      (error) => {
        this.message = (error.response && error.response.data)
          || error.message
          || error.toString();
        this.loading = false;
      },
    );
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
