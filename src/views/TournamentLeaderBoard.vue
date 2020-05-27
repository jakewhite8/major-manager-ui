<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{content}}</h3>
    </header>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'Home',
  data() {
    return {
      content: 'Leaderboard',
    };
  },
  mounted() {
    // Data needed:
    // - Tournament name
    // - A User's Team and their scores
    // - Other Users Team and scores

    // User data on top - then a leaderboard sorted team score

  },
};
</script>
