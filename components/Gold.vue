<template>
  <div class="page-wrapper">
    <div
      :class="[
        'gold-wrapper',
        darkMode ? 'dark-mode' : 'light-mode',
        'fade-transition',
      ]"
    >
      <h1 class="gold-glow fade-in slide-down">Live Gold Price</h1>

      <!-- Display the last stored price -->
      <div class="last-price fade-in scale-up">
        <strong>Live Gold Price:</strong>
        <span class="gold-glow">{{ lastRequestPrice || 'Loading...' }}</span>
      </div>

      <!-- Gold Price Details -->
      <div class="price fade-in">
        💰 Ounce: <span>{{ goldPrice.ounce || 'Loading...' }}</span>
      </div>
      <div class="price fade-in">
        🔶 មួយដំឡឹង (Damlung):
        <span>{{ goldPrice.damlung || 'Loading...' }}</span>
      </div>
      <div class="price fade-in">
        🟡 មួយជី (Chi): <span>{{ goldPrice.chi || 'Loading...' }}</span>
      </div>

      <!-- Custom Chi Price -->
      <h2 class="slide-in">Check Price for Custom Chi (ជី)</h2>
      <input
        type="number"
        step="0.01"
        v-model.number="customChiAmount"
        placeholder="Enter ជី"
        min="0"
        @input="calculateChiPrice"
        :class="['big-input', darkMode ? 'dark-glow' : 'light-glow']"
      />
      <div class="price fade-in">
        💲 តម្លៃ <span class="gold-glow">{{ customChiAmount }}</span> ជី:
        <span class="gold-glow">{{ customChiPrice || '--' }}</span>
      </div>

      <div class="timestamp fade-in slide-up">
        Last updated: {{ lastUpdated }}
      </div>

      <!-- Dark Mode Toggle Button -->
      <button @click="toggleDarkMode" class="toggle-mode">
        <transition name="fade">
          <span v-if="darkMode">☀️ Light Mode</span>
          <span v-else>🌙 Dark Mode</span>
        </transition>
      </button>
    </div>
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
      lastStoredPrice: '',
      lastRequestPrice: '',
      darkMode: false,
    };
  },
  mounted() {
    this.darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    this.lastStoredPrice = localStorage.getItem('last_gold_price') || '';
    this.lastRequestPrice = this.lastStoredPrice;
    this.checkGoldPrice();
  },
  methods: {
    async checkGoldPrice() {
      if (process.client) {
        const lastUpdateTime = localStorage.getItem('last_gold_update');
        const now = new Date().getTime();

        if (lastUpdateTime && now - lastUpdateTime < this.checkInterval) {
          console.log(
            'Skipping API call, last update was less than 30 min ago.'
          );
          return;
        }

        const newPrice = await this.fetchGoldPrice(false);
        if (newPrice && newPrice.ounce !== this.lastStoredPrice) {
          await this.fetchGoldPrice(true);
          localStorage.setItem('last_gold_update', now);
          localStorage.setItem('last_gold_price', newPrice.ounce);
        }
      }
    },
    async fetchGoldPrice(updateUI) {
      try {
        const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
          headers: { 'x-access-token': 'goldapi-vf9wd19m6tl90rg-io' },
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
          this.calculateChiPrice();
          this.lastRequestPrice = newPrice.ounce;
        }

        return newPrice;
      } catch (error) {
        console.error('Error fetching gold price', error);
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
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    },
  },
};
</script>

<style>
/* General Styling */
.page-wrapper {
  position: relative;
  text-align: center;
  padding-top: 60px;
}

.gold-wrapper {
  position: relative;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.15);
  max-width: 450px;
  margin: 20px auto;
  text-align: center;
  font-family: 'Arial', sans-serif;
  transition: background 0.5s ease-in-out, color 0.5s ease-in-out;
}

/* Light & Dark Mode */
.light-mode {
  background: linear-gradient(135deg, #ffd700, #ffcc00, #b8860b);
  color: #111;
}

.dark-mode {
  background: linear-gradient(135deg, #222, #444, #111);
  color: #fff;
}

/* Smooth Theme Change */
.fade-transition {
  transition: background 0.5s ease, color 0.5s ease;
}

/* Toggle Button */
.toggle-mode {
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  border: 2px solid #ffd700;
  background: #222;
  color: #ffd700;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.toggle-mode:hover {
  background: #ffd700;
  color: #222;
  box-shadow: 0 0 15px rgba(255, 215, 0, 1);
}

/* Neon Glow for Input */
.big-input {
  width: 100%;
  padding: 20px;
  font-size: 22px;
  border-radius: 6px;
  margin: 15px 0;
  text-align: center;
  outline: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.light-glow {
  border: 2px solid #ffd700;
  background: #fff;
  color: #111;
  box-shadow: 0 0 10px #ffd700;
}

.dark-glow {
  border: 2px solid #ffd700;
  background: #111;
  color: #fff;
  box-shadow: 0 0 15px #ffcc00;
}

/* Smooth Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
