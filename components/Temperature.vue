<template>
  <div class="container-mpg">
        <a-input-number  v-model="f" size="large" :min="1" :max="100000" />
    <div class="mpg-total">
   <h1 class="great" v-if="toCelsius() <= 22">Cold</h1>
      <h1 class="good" v-else-if="toCelsius() <= 25">normarl</h1>
      <h1 class="bad" v-else>Hot</h1>
      <br />
      <p>{{ toCelsius() }} Celsius</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      f: "75",
      c:"",
    };
  },
  head: {
    title: "Fahrenheit to Celsius",
    meta: [
      {
        hid: "",
        name: "",
        content: "",
      },
    ],
  },
  methods: {
    toCelsius: function () {
      return parseFloat((this.f -32)* 5/9).toFixed(0);
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
