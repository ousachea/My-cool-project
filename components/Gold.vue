<template>
  <div class="gold-wrapper">
    <h1>Live Gold Price</h1>
    <p class="request-count">Requests today: {{ requestCount }} / {{ maxRequestsPerDay }}</p>

    <div class="price">
      💰 Ounce: <span>{{ goldPrice.ounce || "Loading..." }}</span>
    </div>
    <div class="price">
      🔶 Damlung: <span>{{ goldPrice.damlung || "Loading..." }}</span>
    </div>
    <div class="price">
      🟡 Chi: <span>{{ goldPrice.chi || "Loading..." }}</span>
    </div>

    <h2>Check Price for Custom Chi (ជី)</h2>
    <input 
      type="number" 
      v-model="customChiAmount" 
      placeholder="Enter Chi" 
      min="1" 
      inputmode="numeric"
    />
    <button @click="calculateChiPrice">Check Price</button>
    <div class="price">
      💲 Price for <span>{{ customChiAmount }}</span> Chi:
      <span>{{ customChiPrice || "--" }}</span>
    </div>

    <div class="timestamp">Last updated: {{ lastUpdated }}</div>
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
      requestCount: 0,
      maxRequestsPerDay: 100,
    };
  },
  created() {
    this.loadRequestCount();
    this.fetchGoldPrice();
  },
  methods: {
    loadRequestCount() {
      const today = new Date().toDateString();
      const savedData = JSON.parse(localStorage.getItem("goldPriceRequests")) || {};
      if (savedData.date === today) {
        this.requestCount = savedData.count;
      } else {
        this.requestCount = 0;
        localStorage.setItem("goldPriceRequests", JSON.stringify({ date: today, count: 0 }));
      }
    },
    updateRequestCount() {
      const today = new Date().toDateString();
      this.requestCount++;
      localStorage.setItem("goldPriceRequests", JSON.stringify({ date: today, count: this.requestCount }));
    },
    async fetchGoldPrice() {
      if (this.requestCount >= this.maxRequestsPerDay) {
        alert("Request limit reached for today. Try again tomorrow.");
        return;
      }

      try {
        const response = await fetch("https://www.goldapi.io/api/XAU/USD", {
          headers: { "x-access-token": "goldapi-vf9wd19m6tl90rg-io" },
        });
        const data = await response.json();

        const pricePerOunce = data.price;
        const pricePerGram = pricePerOunce / 31.1035;
        const pricePerDamlung = pricePerGram * 37.5;
        this.pricePerChi = pricePerDamlung / 10;

        this.goldPrice = {
          ounce: `$${pricePerOunce.toFixed(2)}`,
          damlung: `$${pricePerDamlung.toFixed(2)}`,
          chi: `$${this.pricePerChi.toFixed(2)}`,
        };

        this.lastUpdated = new Date().toLocaleTimeString();
        this.updateRequestCount();
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
.request-count {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.gold-wrapper {
  text-align: center;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.price {
  font-size: 1.5em;
  color: #ffb300;
  margin: 10px 0;
}

input {
  padding: 12px;
  font-size: 16px; /* Prevents zoom on iPhone */
  width: 100%;
  border: 2px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

button {
  background-color: #ffb300;
  border: none;
  color: white;
  padding: 10px 15px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}
</style>
