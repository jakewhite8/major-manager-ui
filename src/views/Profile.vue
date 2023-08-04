<template>
  <div class="container">
    <PageTitle
      :customField=teamNameHeader
      :title="`Profile`" />
    <div class="profile-buttons row">
      <div class="col-12 mb-3">
        <button
        type="button"
        class="btn btn-lg btn-block"
        v-on:click="routeTo('active-tournaments')">
          Join Tournament
        </button>
      </div>
    </div>
    <div v-if="activeTournaments.length > 0" class="row container-margin">
      <div class="col-12">
        <PageTitle
          :title="`Active Tournaments`" />
      </div>
      <div class="col-12">
        <PastTournamentsTable
            :tournaments=activeTournaments
            :loading=loading
            :headers=headers
            :columns=columns
            :message=message />
      </div>
    </div>
    <div v-if="tournaments.length > 0" class="row container-margin">
      <div class="col-12">
        <PageTitle
          :customField=teamNameHeader
          :title="`Past Tournaments`" />
      </div>
      <div class="col-12">
        <PastTournamentsTable
            :tournaments=tournaments
            :loading=loading
            :headers=headers
            :columns=columns
            :message=message
            :user=user />
      </div>
    </div>
  </div>
</template>

<script>
import TournamentService from '../services/tournament.service';
import PageTitle from '../components/PageTitle.vue';
import PastTournamentsTable from '../components/PastTournamentsTable.vue';
import User from '../models/user';

export default {
  name: 'Profile',
  data() {
    return {
      user: new User('', '', ''),
      tournaments: [],
      loading: false,
      headers: [],
      columns: [],
      message: '',
      activeTournaments: [],
    };
  },
  components: {
    PageTitle,
    PastTournamentsTable,
  },
  computed: {
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
    this.user = this.$store.state.auth.user
    if (!this.user) {
      this.$router.push('/login');
    }
    this.loading = true;
    TournamentService.getPastTournamentsForAUser(this.user.id).then(
      (response) => {
        this.tournaments = response.data;
        // Instead of displaying start date, display the result
        this.headers = ['Tournaments', 'Start Date'];
        this.columns = ['name', 'start_date'];
        this.message = '';
        this.loading = false;
        if (this.tournaments.length > 0) {
          const currentDate = new Date()
          const fiveDaysAgo = new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000);
          function activeTournament(startDate, fiveDaysAgo) {
            const tournamentStartDate = new Date(startDate)
            return tournamentStartDate.getTime() - fiveDaysAgo.getTime() > 0;
          }
          this.activeTournaments = this.tournaments.filter((tournament) => activeTournament(tournament.start_date, fiveDaysAgo))  
        }
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
  .container-margin {
    margin-bottom: 47px;
  }
</style>
