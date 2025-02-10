<template>
  <div class="gold-wrapper">
    <h1>Live Gold Price</h1>

    <!-- Stored Gold Price (Hidden) -->
    <span id="stored-price" style="display: none">{{ lastStoredPrice }}</span>

    <!-- Gold Price Details -->
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

    <!-- Custom Chi Price -->
    <h2>Check Price for Custom Chi (ជី)</h2>
    <input
      type="number"
      step="0.01"
      v-model.number="customChiAmount"
      placeholder="Enter Chi"
      min="0"
      @input="calculateChiPrice"
    />
    <div class="price">
      💲 តម្លៃ <span>{{ customChiAmount }}</span> ជី:
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
      checkInterval: 30 * 60 * 1000, // 30 minutes
      lastStoredPrice: "",
    };
  },
  mounted() {
    this.lastStoredPrice = document
      .getElementById("stored-price")
      .innerText.trim();
    this.checkGoldPrice();
  },
  methods: {
    async checkGoldPrice() {
      if (process.client) {
        const lastUpdateTime = localStorage.getItem("last_gold_update");
        const now = new Date().getTime();

        if (lastUpdateTime && now - lastUpdateTime < this.checkInterval) {
          console.log(
            "Skipping API call, last update was less than 30 min ago."
          );
          return;
        }

        const newPrice = await this.fetchGoldPrice(false);
        if (newPrice && newPrice.ounce !== this.lastStoredPrice) {
          await this.fetchGoldPrice(true);
          localStorage.setItem("last_gold_update", now);
        }
      }
    },
    async fetchGoldPrice(updateUI) {
      try {
        const response = await fetch("https://www.goldapi.io/api/XAU/USD", {
          headers: { "x-access-token": "goldapi-vf9wd19m6tl90rg-io" },
        });
        const data = await response.json();

        const pricePerOunce = data.price;
        const pricePerGram = pricePerOunce / 31.1035;
        const pricePerDamlung = pricePerGram * 37.5;
        this.pricePerChi = pricePerDamlung / 10;

        const newPrice = {
          ounce: `$${pricePerOunce.toFixed(2)}`,
          damlung: `$${pricePerDamlung.toFixed(2)}`,
          chi: `$${this.pricePerChi.toFixed(2)}`,
        };

        if (updateUI) {
          this.goldPrice = newPrice;
          this.lastUpdated = new Date().toLocaleTimeString();
          this.calculateChiPrice(); // Update custom chi price
          document.getElementById("stored-price").innerText = newPrice.ounce;
        }
        return newPrice;
      } catch (error) {
        console.error("Error fetching gold price", error);
        return null;
      }
    },
    calculateChiPrice() {
      if (this.customChiAmount > 0) {
        const totalPrice = this.pricePerChi * this.customChiAmount;
        this.customChiPrice = `$${totalPrice.toFixed(2)}`;
      } else {
        this.customChiPrice = null;
      }
    },
  },
};
</script>

<style>
/* Styles for Better UI */
.gold-wrapper {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: auto;
  text-align: center;
}

h1 {
  color: #ffb300;
  font-size: 24px;
}

.price {
  font-size: 20px;
  margin: 10px 0;
  color: #444;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.timestamp {
  color: #777;
  margin-top: 10px;
}
</style>
