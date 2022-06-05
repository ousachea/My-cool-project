<template>
  <div class="slider-wrapper">
    <h1>{{ fahrenheit }} °F</h1>
    <a-slider v-model="fahrenheit" :min="50" :max="90" />
    <br />
    <br />
    <a-slider v-model="celsius" :min="1" :max="50" />
    <h1>{{ toCelsius() }} °C</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fahrenheit: "75",
      celsius: "",
    };
  },
  methods: {
    toCelsius: function () {
      return (this.celsius = parseFloat(
        ((this.fahrenheit - 32) * 5) / 9
      ).toFixed(0));
    },
  },
};
</script>
<style scoped>
.slider-wrapper {
  height: 100vh;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: aliceblue;
}
</style>
