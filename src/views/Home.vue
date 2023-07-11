<template>
  <div class="container">
    <header class="jumbotron">
      <h2 style="text-align: center;">Gambling Problem?</h2>
      <h4 style="text-align: center;">Call 1-800-GAMBLER</h4>
    </header>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'Home',
  data() {
    return {
      content: '',
    };
  },
  mounted() {
    UserService.getPublicContent().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
};
</script>
