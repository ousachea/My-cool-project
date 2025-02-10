<template>
  <div>
    <!-- Gold Price Chart -->
    <div class="chart-container">
      <canvas id="goldPriceChart"></canvas>
    </div>

    <!-- Gold Price Details -->
    <div>
      <h1>Live Gold Price</h1>
      <div class="price">
        💰 Ounce: <span>{{ goldPrice.ounce || "Loading..." }}</span>
      </div>
      <div class="price">
        🔶 មួយដំឡឹង (Damlung): <span>{{ goldPrice.damlung || "Loading..." }}</span>
      </div>
      <div class="price">
        🟡 មួយជី (Chi): <span>{{ goldPrice.chi || "Loading..." }}</span>
      </div>

      <h2>Check Price for Custom Chi (ជី)</h2>
      <input
        type="number"
        v-model.number="customChiAmount"
        placeholder="Enter Chi"
        min="0"
      />
      <div class="price">
        💲 តម្លៃ <span>{{ customChiAmount }}</span> ជី:
        <span>{{ customChiPrice || "--" }}</span>
      </div>

      <div class="timestamp">Last updated: {{ lastUpdated }}</div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      goldPrice: {},
      customChiAmount: 1,
      customChiPrice: null,
      lastUpdated: null,
      pricePerChi: 0,
      hourlyPriceKey: "hourlyGoldPrice",
      priceHistory: [],
    };
  },
  created() {
    this.loadGoldPrice();
  },
  mounted() {
    this.initializeChart();
  },
  methods: {
    loadGoldPrice() {
      const savedData = JSON.parse(localStorage.getItem(this.hourlyPriceKey));
      const now = new Date();

      if (savedData && savedData.timestamp && new Date(savedData.timestamp).getTime() + 3600000 > now.getTime()) {
        this.goldPrice = savedData.goldPrice;
        this.lastUpdated = savedData.lastUpdated;
        this.pricePerChi = savedData.pricePerChi;
        this.priceHistory = savedData.priceHistory || [];
        this.updateChart();
      } else {
        this.fetchGoldPrice();
      }
    },
    saveGoldPriceToLocal() {
      const savedData = {
        goldPrice: this.goldPrice,
        lastUpdated: this.lastUpdated,
        pricePerChi: this.pricePerChi,
        priceHistory: this.priceHistory,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(this.hourlyPriceKey, JSON.stringify(savedData));
    },
    async fetchGoldPrice() {
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

        // Update price history
        this.priceHistory.push({
          time: new Date().toLocaleTimeString(),
          price: this.pricePerChi,
        });
        if (this.priceHistory.length > 24) {
          this.priceHistory.shift(); // Keep only the last 24 entries
        }

        this.saveGoldPriceToLocal();
        this.updateChart();
      } catch (error) {
        console.error("Error fetching gold price", error);
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
    initializeChart() {
      const ctx = document.getElementById("goldPriceChart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.priceHistory.map((entry) => entry.time),
          datasets: [
            {
              label: "Gold Price (Chi)",
              data: this.priceHistory.map((entry) => entry.price),
              borderColor: "#ffb300",
              backgroundColor: "rgba(255, 179, 0, 0.2)",
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    updateChart() {
      if (this.chart) {
        this.chart.data.labels = this.priceHistory.map((entry) => entry.time);
        this.chart.data.datasets[0].data = this.priceHistory.map((entry) => entry.price);
        this.chart.update();
      }
    },
  },
};
</script>

<style>
.chart-container {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
}
</style>
