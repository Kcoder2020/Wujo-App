<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { MonthlyCollectionData } from "@/types";

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: MonthlyCollectionData[];
}

const props = defineProps<Props>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!chartCanvas.value || !props.data || props.data.length === 0) return;

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  const labels = props.data.map((item) => item.month);
  const amounts = props.data.map((item) => item.amount);
  const targets = props.data.map((item) => item.target || 0);

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Collected",
          data: amounts,
          borderColor: "#5FD9AC", // Wujo aquamarine
          backgroundColor: "rgba(95, 217, 172, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "#5FD9AC",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "#5FD9AC",
          pointHoverBorderColor: "#fff",
        },
        {
          label: "Target",
          data: targets,
          borderColor: "#014023", // Wujo dark green
          backgroundColor: "rgba(1, 64, 35, 0.05)",
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#014023",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
              weight: 600,
            },
            color: "#014023",
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: "#014023",
          titleColor: "#fff",
          bodyColor: "#5FD9AC",
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label +=
                  new Intl.NumberFormat("en-ET", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(context.parsed.y) + " ETB";
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(1, 64, 35, 0.1)",
          },
          ticks: {
            color: "#014023",
            font: {
              size: 11,
            },
            callback: function (value) {
              return new Intl.NumberFormat("en-ET", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value as number);
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#014023",
            font: {
              size: 12,
              weight: 600,
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  });
};

onMounted(() => {
  createChart();
});

watch(
  () => props.data,
  () => {
    createChart();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 200px;
}

canvas {
  max-height: 300px;
}
</style>
