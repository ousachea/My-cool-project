<template>
  <div>
    <a-row>
      <a-col :span="18">
        <a-slider v-model="f" :min="1" :max="100" />
      </a-col>
      <a-col :span="4">
        <a-input-number v-model="c" :min="1" :max="100" />
      </a-col>
    </a-row>
    <h1>{{ toCelsius() }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      f: "75",
      c: "1",
    };
  },

  methods: {
    toCelsius: function () {
      return parseFloat(((this.f - 32) * 5) / 9).toFixed(0);
    },
  },
};
</script>
<style scoped></style>
