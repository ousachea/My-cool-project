<template>
  <div class="container-mpg">
            <a-input-number v-model="mpg"
 size="large" :min="1" :max="100000" />
    <div class="mpg-total">
      <h1 class="great" v-if="mpgConvert() <= 6">Great</h1>
      <h1 class="good" v-else-if="mpgConvert() <= 8">Good</h1>
      <h1 class="bad" v-else>Bad</h1>
      <br />
      <p>{{ mpgConvert() }} L/100Km</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mpg: "25",
    };
  },
  head: {
    title: "MPG to L/100km",
    meta: [
      {
        hid: "",
        name: "",
        content: "",
      },
    ],
  },
  methods: {
    mpgConvert: function () {
      return parseFloat(235.215 / this.mpg).toFixed(1);
    },
  },
};
</script>

<style scope>
.container-mpg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 75px 18px;
  margin: 0 auto;
  max-width: 500px;
}
.input-mpg {
  font-size: 16px;
  font-weight: bold;
  padding: 15px 18px;
  text-align: center;
}
input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
}
a-input {
  background-color: red;
}
.mpg-total {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  padding-top: 40px;
}
.mpg-total p {
  font-size: 24px;
  font-weight: bold;
}
.mpg-total h1 {
  font-size: 40px;
  font-weight: bold;
}
.mpg-total .great {
  color: green;
}
.mpg-total .good {
  color: orange;
}
.mpg-total .bad {
  color: red;
}
</style>
