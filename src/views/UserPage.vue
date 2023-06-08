<template>
  <div class="container">
    <header class="jumbotron">
      <h3 v-if="user.team_name.length">{{user.team_name}}</h3>
      <h3 v-else>Error</h3>
    </header>
    <PastTournamentsTable
        v-if="tournaments.length"
        :tournaments=tournaments
        :loading=loading
        :headers=headers
        :columns=columns
        :message=message />
    <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
  </div>
</template>

<script>
import UserService from '../services/user.service';
import TournamentService from '../services/tournament.service';
import PastTournamentsTable from '../components/PastTournamentsTable';
import User from '../models/user'
export default {
  name: 'User',
  data() {
    return {
      user: new User('','',''),
      tournaments: [],
      headers: [],
      columns: [],
      loading: false,
      message: '',
    };
  },
  components: {
    PastTournamentsTable,
  },
  mounted() {
    this.user.id = this.$route.params.id

    UserService.getUserInformation(this.user.id).then(
      (userResponse) => {
        if (userResponse && userResponse.data[0]) {
          this.user.team_name = userResponse.data[0].team_name
          TournamentService.getPastTournamentsForAUser(this.user.id).then(
            (response) => {
              this.tournaments = response.data;
              // Instead of displaying start date, display the result
              this.headers = ['Tournaments', 'Start Date'];
              this.columns = ['name', 'start_date'];
              this.loading = false;
              this.message = '';
            },
            (error) => {
              this.message = (error.response && error.response.data)
                || error.message
                || error.toString();
              this.loading = false;
            },
          );
        } else {
          this.message = 'Error finding User'
        }
      },
      (userError) => {
        this.message = `${userError}`
      }
    );
  },
};
</script>
