import Chart from 'chart.js/auto';

export function initROI() {
  const teamSize = document.getElementById("team-size");
  const hoursLost = document.getElementById("hours-lost");
  const hourlyRate = document.getElementById("hourly-rate");
  
  const teamSizeVal = document.getElementById("team-size-val");
  const hoursLostVal = document.getElementById("hours-lost-val");
  const hourlyRateVal = document.getElementById("hourly-rate-val");
  
  const roiHours = document.getElementById("roi-hours");
  const roiSavings = document.getElementById("roi-savings");
  const roiFte = document.getElementById("roi-fte");

  if (!teamSize || !hoursLost || !hourlyRate) return;

  const AUREON_EFFICIENCY = 0.46;
  const WEEKS_PER_YEAR = 48;

  // Setup Chart.js
  const ctx = document.createElement('canvas');
  const chartContainer = document.querySelector('.roi-results');
  if (chartContainer) {
    chartContainer.appendChild(ctx);
  }

  let roiChart;

  const initChart = () => {
    roiChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sans Aureon', 'Avec Aureon'],
        datasets: [{
          label: 'Coût des processus (Annuel)',
          data: [0, 0],
          backgroundColor: ['#60636b', '#c6f35b'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'white' } },
          x: { ticks: { color: 'white' }, grid: { display: false } }
        }
      }
    });
  };

  initChart();

  const updateRangeFill = (input) => {
    const min = Number(input.min);
    const max = Number(input.max);
    const pct = ((Number(input.value) - min) / (max - min)) * 100;
    input.style.setProperty("--range-pct", `${pct}%`);
  };

  const formatNumber = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

  const calcROI = () => {
    const team = Number(teamSize.value);
    const hours = Number(hoursLost.value);
    const rate = Number(hourlyRate.value);

    teamSizeVal.textContent = team;
    hoursLostVal.textContent = `${hours}h`;
    hourlyRateVal.textContent = `${rate}€`;

    [teamSize, hoursLost, hourlyRate].forEach(updateRangeFill);

    const currentCost = team * hours * WEEKS_PER_YEAR * rate;
    const totalHoursSaved = team * hours * WEEKS_PER_YEAR * AUREON_EFFICIENCY;
    const savings = totalHoursSaved * rate;
    const newCost = currentCost - savings;
    const fte = totalHoursSaved / (35 * WEEKS_PER_YEAR);

    [roiHours, roiSavings, roiFte].forEach((el) => {
      el?.classList.add("updated");
      setTimeout(() => el?.classList.remove("updated"), 400);
    });

    if (roiHours) roiHours.textContent = formatNumber(totalHoursSaved);
    if (roiSavings) roiSavings.textContent = formatNumber(savings);
    if (roiFte) roiFte.textContent = fte.toFixed(1);

    // Update Chart
    if (roiChart) {
      roiChart.data.datasets[0].data = [currentCost, newCost];
      roiChart.update();
    }
  };

  [teamSize, hoursLost, hourlyRate].forEach((input) => {
    input?.addEventListener("input", calcROI);
  });
  
  calcROI();
}
