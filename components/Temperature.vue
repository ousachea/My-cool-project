<template>
  <div class="slider-wrapper">
    <div class="fahrenheit-style">
      <h1 class="tem-header">{{ fahrenheit }} °F</h1>
      <a-slider
        v-model="fahrenheit"
        :min="60"
        :max="99"
        vertical
        :tooltip-visible="false"
      />
      <h1 class="tem-header">{{ toCelsius() }} °C</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fahrenheit: 75,
      celsius: 25,
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
  display: flex;
  justify-content: center;
}
.tem-header {
  padding: 10px;
}
.fahrenheit-style,
.celsius-style {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 250px;
  padding: 12px;
}
</style>
