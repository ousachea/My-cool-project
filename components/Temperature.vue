<template>
  <div class="container" :style="{ backgroundColor: backgroundColor }">
    <div class="card">
      <h2>Check Your Carrier</h2>
      <div class="phone-card">
        <input
          v-model="phoneNumber"
          ref="phoneInput"
          placeholder="Enter two digits"
          @input="formatAndDetectCarrier"
          class="input"
          :class="{ shakeLoop: invalidInput, matched: matchedPrefix }"
          :style="{ borderColor: inputBorderColor }"
          maxlength="2"
        />
      </div>

      <transition name="fade-pop">
        <div class="carrier-info" v-if="carrier !== 'Unknown Carrier'">
          <p class="carrier">
            Carrier: <span>{{ carrier }}</span>
          </p>
        </div>
      </transition>

      <div class="prefix-list">
        <h3>Valid Phone Prefixes</h3>
        <div class="carrier-list">
          <div
            v-for="(carrierData, name) in carriers"
            :key="name"
            class="carrier-card"
            :class="{ faded: carrier && carrier !== name }"
          >
            <h4 :style="{ color: carrierData.color }">{{ name }}</h4>
            <div class="prefixes">
              <span
                v-for="prefix in carrierData.prefixes"
                :key="prefix"
                class="prefix-badge"
                :style="{ backgroundColor: carrierData.color }"
                :class="{ pulse: matchedPrefix === prefix, highlighted: matchedPrefix === prefix }"
              >
                {{ prefix }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const phoneNumber = ref('');
const matchedPrefix = ref(null);
const invalidInput = ref(false);
const carrier = ref('Unknown Carrier');

const carriers = {
  Cellcard: {
    name: 'Cellcard',
    color: '#FF9800',
    prefixes: [
      '11',
      '12',
      '17',
      '61',
      '76',
      '77',
      '78',
      '79',
      '85',
      '89',
      '92',
      '95',
      '99',
    ],
  },
  Smart: {
    name: 'Smart',
    color: '#00A859',
    prefixes: [
      '10',
      '15',
      '16',
      '69',
      '70',
      '81',
      '86',
      '87',
      '93',
      '96',
      '98',
    ],
  },
  Metfone: {
    name: 'Metfone',
    color: '#E60012',
    prefixes: ['88', '97'],
  },
};

const inputBorderColor = computed(() => {
  return carrier.value !== 'Unknown Carrier'
    ? carriers[carrier.value]?.color
    : '#ddd';
});

const backgroundColor = computed(() => {
  return carrier.value !== 'Unknown Carrier'
    ? carriers[carrier.value]?.color + '20'  // Carrier-specific color with transparency
    : '#f5f5f5';  // Default background color
});

watch(phoneNumber, (newValue) => {
  if (!/^[0-9]{1,2}$/.test(newValue)) {
    invalidInput.value = true;
    setTimeout(() => (invalidInput.value = false), 500);
  } else {
    invalidInput.value = false;
  }
});

const formatAndDetectCarrier = () => {
  // Prepend a "0" if the input is less than two digits
  const input = phoneNumber.value.padStart(2, '0').slice(0, 2);
  matchedPrefix.value = null;
  carrier.value = 'Unknown Carrier';

  for (const [key, carrierData] of Object.entries(carriers)) {
    if (carrierData.prefixes.includes(input)) {
      carrier.value = key;
      matchedPrefix.value = input;
      return;
    }
  }
  invalidInput.value = true;
  setTimeout(() => (invalidInput.value = false), 500);
};
</script>

<style scoped>
/* Overall container style */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(to bottom, #e3f2fd, #bbdefb);
  transition: background-color 0.5s ease-in-out;
  font-family: 'Arial', sans-serif;
}

/* Card style */
.card {
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 480px;
  transition: transform 0.3s ease;
}

/* Card hover effect */
.card:hover {
  transform: translateY(-10px);
}

/* Input styling */
.phone-card {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px; /* Increased margin for better spacing */
}

.input {
  flex-grow: 1;
  padding: 18px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 22px;
  outline: none;
  text-align: center;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

.input.shakeLoop {
  animation: shakeLoop 0.5s ease-in-out;
}

.input.matched {
  background-color: #f0f8ff;
  color: #007bff;
}

/* Carrier info styling */
.carrier-info {
  margin-top: 25px; /* Increased margin to add more space */
}

.carrier {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.carrier-info span {
  color: #007bff;
  font-weight: bold;
}

/* Carrier list styling */
.prefix-list {
  margin-top: 40px; /* Increased margin to create separation */
}

.carrier-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30px; /* Increased gap for better spacing between carrier cards */
  justify-content: center;
}

.carrier-card {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 140px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.carrier-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.shakeLoop {
  animation: shakeLoop 0.5s ease-in-out;
}

@keyframes shakeLoop {
  0%,
  100% {
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
}

.prefix-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: white;
  margin: 5px;
  transition: background-color 0.3s ease;
}

.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

.highlighted {
  background-color: #ffeb3b; /* Highlight matched prefix with a yellow background */
  color: black;
}
</style>
