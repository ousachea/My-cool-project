<template>
  <div class="gold-wrapper">
    <h1 class="fade-in">Live Gold Price</h1>

    <!-- Display the last stored price -->
    <div class="last-price fade-in">
      <strong>Live Gold Price:</strong> <span>{{ lastRequestPrice || 'Loading...' }}</span>
    </div>

    <!-- Stored Gold Price (Hidden) -->
    <span id="stored-price" style="display: none">{{ lastStoredPrice }}</span>

    <!-- Gold Price Details with Cool Animation -->
    <div class="price fade-in pulse-animation bounce-animation">
      💰 Ounce: <span>{{ goldPrice.ounce || 'Loading...' }}</span>
    </div>
    <div class="price fade-in pulse-animation bounce-animation">
      🔶 មួយដំឡឹង (Damlung):
      <span>{{ goldPrice.damlung || 'Loading...' }}</span>
    </div>
    <div class="price fade-in pulse-animation bounce-animation">
      🟡 មួយជី (Chi): <span>{{ goldPrice.chi || 'Loading...' }}</span>
    </div>

    <!-- Custom Chi Price -->
    <h2 class="slide-up glow-animation">Check Price for Custom Chi (ជី)</h2>
    <input
      type="number"
      step="0.01"
      v-model.number="customChiAmount"
      placeholder="Enter Chi"
      min="0"
      @input="calculateChiPrice"
      class="hover-animate shake-animation"
    />
    <div class="price fade-in">
      💲 តម្លៃ <span>{{ customChiAmount }}</span> ជី:
      <span>{{ customChiPrice || '--' }}</span>
    </div>

    <div class="timestamp fade-in slide-up">Last updated: {{ lastUpdated }}</div>
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
    };
  },
  mounted() {
    this.lastStoredPrice = document
      .getElementById('stored-price')
      .innerText.trim();
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

        // Update stored price and the price displayed
        if (updateUI) {
          this.goldPrice = newPrice;
          this.lastUpdated = new Date().toLocaleTimeString();
          this.calculateChiPrice(); // Update custom chi price
          document.getElementById('stored-price').innerText = newPrice.ounce;
          this.lastRequestPrice = newPrice.ounce; // Store the last price
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
  },
};
</script>

<style>
/* General Styles */
.gold-wrapper {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  margin: 20px auto;
  text-align: center;
  font-family: 'Arial', sans-serif;
}

h1 {
  color: #ffb300;
  font-size: 26px;
  margin-bottom: 20px;
  text-transform: uppercase;
}

h2 {
  font-size: 22px;
  color: #444;
  margin-top: 25px;
}

.price {
  font-size: 18px;
  margin: 12px 0;
  color: #555;
}

input {
  width: 100%;
  padding: 14px;
  font-size: 18px;
  border: 2px solid #ddd;
  border-radius: 6px;
  margin: 15px 0;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ffb300;
  outline: none;
}

.timestamp {
  color: #777;
  margin-top: 15px;
  font-size: 14px;
}

.price span {
  font-weight: bold;
  color: #333;
}

.price, .timestamp {
  font-family: 'Arial', sans-serif;
}

/* Animation Effects */
.fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.pulse-animation {
  animation: pulse 1.5s infinite alternate;
}

.bounce-animation {
  animation: bounce 2s infinite;
}

.slide-up {
  animation: slideUp 0.8s ease-out forwards;
}

.glow-animation {
  animation: glow 1.5s infinite alternate;
}

.shake-animation {
  animation: shake 1s infinite;
}

.hover-animate:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

/* Animation Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes glow {
  0% {
    text-shadow: 0 0 10px #ffb300, 0 0 20px #ffb300, 0 0 30px #ffb300;
  }
  100% {
    text-shadow: 0 0 15px #ffb300, 0 0 25px #ffb300, 0 0 35px #ffb300;
  }
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

/* Responsive Styles for Mobile */
@media (max-width: 600px) {
  .gold-wrapper {
    padding: 15px;
    max-width: 100%;
  }

  h1 {
    font-size: 22px;
  }

  h2 {
    font-size: 18px;
  }

  .price {
    font-size: 16px;
  }

  input {
    font-size: 16px;
    padding: 12px;
  }

  .timestamp {
    font-size: 12px;
  }
}

@media (max-width: 400px) {
  .gold-wrapper {
    padding: 10px;
  }

  h1 {
    font-size: 20px;
  }

  h2 {
    font-size: 16px;
  }

  .price {
    font-size: 14px;
  }

  input {
    font-size: 14px;
    padding: 10px;
  }

  .timestamp {
    font-size: 10px;
  }
}
</style>
