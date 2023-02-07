<template>
  <header class="jumbotron">
      <h3>
        <strong v-if="teamName">{{ teamName }}</strong>
        {{ title }}
      </h3>
  </header>
</template>
<script>
module.exports = {
  props: {
    title: {
      required: true,
    },
    teamName: {
      required: false,
    },
  }
}
</script>