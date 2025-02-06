<template>
  <div class="gold-wrapper">
    <h1>Live Gold Price</h1>
    <div class="price">
      💰 Ounce: <span>{{ goldPrice.ounce || "Loading..." }}</span>
    </div>
    <div class="price">
      🔶 មួយដំឡឹង (Damlung):
      <span>{{ goldPrice.damlung || "Loading..." }}</span>
    </div>
    <div class="price">
      🟡 មួយជី (Chi): <span>{{ goldPrice.chi || "Loading..." }}</span>
    </div>

    <h2>Check Price for Custom Chi (ជី)</h2>
    <input
      type="number"
      v-model="customChiAmount"
      placeholder="Enter Chi"
      min="1"
    />
    <button @click="calculateChiPrice">ពិនិត្យតម្លៃ</button>
    <div class="price">
      💲 តម្លៃ <span>{{ customChiAmount }}</span> ជី:
      <span>{{ customChiPrice || "--" }}</span>
    </div>

    <div class="timestamp">Last updated: {{ lastUpdated }}</div>
    <button @click="fetchGoldPrice">Refresh</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goldPrice: {},
      customChiAmount: 1,
      customChiPrice: null,
      lastUpdated: null,
      pricePerChi: 0,
    };
  },
  methods: {
    async fetchGoldPrice() {
      try {
        const response = await fetch("https://www.goldapi.io/api/XAU/USD", {
          headers: { "x-access-token": "goldapi-vf9wd19m6tl90rg-io" },
        });
        const data = await response.json();

        const pricePerOunce = data.price;
        const pricePerGram = pricePerOunce / 31.1035; // 1 ounce = 31.1035 grams
        const pricePerDamlung = pricePerGram * 37.5; // 1 Damlung = 37.5 grams
        this.pricePerChi = pricePerDamlung / 10; // 1 Damlung = 10 Chi

        // Update gold prices
        this.goldPrice = {
          ounce: `$${pricePerOunce.toFixed(2)}`,
          damlung: `$${pricePerDamlung.toFixed(2)}`,
          chi: `$${this.pricePerChi.toFixed(2)}`,
        };

        // Update last updated timestamp
        const now = new Date();
        this.lastUpdated = now.toLocaleTimeString();
      } catch (error) {
        this.goldPrice = {
          ounce: "Error fetching price",
          damlung: "Error fetching price",
          chi: "Error fetching price",
        };
      }
    },
    calculateChiPrice() {
      if (this.customChiAmount > 0) {
        const totalPrice = this.pricePerChi * this.customChiAmount;
        this.customChiPrice = totalPrice.toFixed(2);
      } else {
        this.customChiPrice = null;
      }
    },
  },
};
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Arial", sans-serif;
}

body {
  background-color: #f4f4f9;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

/* Container */
.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

/* Header Styles */
h1 {
  font-size: 2.5em;
  color: #ffb300;
  margin-bottom: 20px;
  font-weight: 700;
}

h2 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

/* Price Styles */
.price {
  font-size: 2em;
  color: #ffb300;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff8e1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.timestamp {
  font-size: 1em;
  color: #777;
  margin-bottom: 20px;
}

input {
  padding: 10px;
  font-size: 1em;
  width: 150px;
  border: 2px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

input:focus {
  border-color: #ffb300;
  outline: none;
}

button {
  background-color: #ffb300;
  border: none;
  color: white;
  padding: 12px 20px;
  font-size: 1.1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 160px;
  margin-top: 10px;
}

button:hover {
  background-color: #ff8f00;
}

button:active {
  background-color: #e07b00;
}

button:focus {
  outline: none;
}

/* Responsive Design for Mobile */
@media (max-width: 600px) {
  .container {
    padding: 30px;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  .price {
    font-size: 1.5em;
  }

  input {
    width: 120px;
    font-size: 0.9em;
  }

  button {
    width: 100%;
    font-size: 1.2em;
  }
}
</style>
