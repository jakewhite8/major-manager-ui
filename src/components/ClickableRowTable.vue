<template>
  <div class="table-responsive">
    <table class="table table-sm table-bordered table-hover">
      <thead class="thead-dark">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            :style="dynamicHeaderWidth">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- onClickFunction art -->
        <tr v-for="data in rowData"
          :key="data.id"
          v-on:click="
            onClickFunction ?
              onClickFunction(
                data.id,
                data['start_date'] ? data['start_date'] : false)
              : true"
          class="clickableRow"
          v-bind:class="[(data.selected) ? 'selectedBackground' : '']">
            <td v-for="column in columns" :key="column">
              <span v-if="column.indexOf('date') > -1">
                {{ createDateString(new Date(data[column])) }}
              </span>
              <span v-else-if="column.indexOf('cut') > -1">
                <span v-if="data[column]">
                  <font-awesome-icon class="cutFail" icon="times" />
                </span>
                <span v-else>
                  <font-awesome-icon class="cutSuccess" icon="check" />
                </span>
              </span>
              <span v-else-if="column.indexOf('last_name') > -1">{{data['first_name']}} {{data['last_name']}}</span>
              <span v-else>{{ data[column] }}</span>
            </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
module.exports = {
  props: {
    rowData: {
      required: true,
    },
    headers: {
      required: true,
    },
    columns: {
      required: true,
    },
    onClickFunction: {
      required: false,
    },
  },
  data() {
    return {
      dynamicHeaderWidth: {
        width: `${Math.floor(100 / this.headers.length)}%`
      },
    }
  },
  methods: {
    createDateString(date) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();
      return `${monthNames[month]} ${day}, ${year}`;
    },
  },
};
</script>

<style>
tr.clickableRow:hover {
  cursor: pointer;
}
tr.selectedBackground {
  background-color: #343a40;
  color: rgba(255,255,255,.75);
}
.cutSuccess {
  color: green;
}
.cutFail {
  color: red;
}
</style>
