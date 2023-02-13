<template>
  <header class="jumbotron">
      <h3>
        <strong v-if="customField">{{ customField }}</strong>
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
    customField: {
      required: false,
    },
  },
};
</script>
