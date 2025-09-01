<template>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" width="100"/>
    </div>
  </template>
  
  <script>
  import { Bar } from "vue-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from "chart.js";
  import ChartDataLabels from "chartjs-plugin-datalabels";
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ChartDataLabels
  );
  
  export default {
    name: "RoutineChart",
    components: { Bar },
    props: {
      ejercicios: {
        type: Array,
        required: true,
      },
    },
    computed: {
      chartData() {
        const grupos = {};
        this.ejercicios.forEach((ej) => {
          const grupo = ej.ejercicio.Categoria || "Otros";
          grupos[grupo] = (grupos[grupo] || 0) + 1;
        });
  
        const total = this.ejercicios.length;
        const porcentajes = Object.values(grupos).map(
          (valor) => ((valor / total) * 100).toFixed(1)
        );
  
        return {
          labels: Object.keys(grupos),
          datasets: [
            {
              data: porcentajes,
              backgroundColor: [
                "currentColor", // color por defecto
              ],
            },
          ],
        };
      },
      chartOptions() {
        return {
          responsive: true,
          indexAxis: "y",
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }, // 🔥 quitamos tooltip
            datalabels: {
              color: "white", // texto dentro de barra
              anchor: "center",
              align: "center",
              font: {
                weight: "bold",
                size: 10,
              },
              formatter: (value) => `${value}%`,
            },
          },
          scales: {
            x: {
              display: false, // ❌ quitamos eje inferior
              max: 100,
            },
            y: {
              grid: { display: false, drawBorder: false },
            },
          },
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    border-radius: 10px;
  }
  </style>
  