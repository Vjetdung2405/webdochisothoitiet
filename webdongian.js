<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bảng Điều Khiển Chất Lượng Không Khí</title>
  <link href="https://cdn.jsdelivr.net/npm/chart.js" rel="stylesheet">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    header {
      background: #0077b6;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      padding: 20px;
    }
    .card {
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .status {
      font-weight: bold;
      padding: 5px;
      border-radius: 5px;
    }
    .good { background: #90ee90; }
    .moderate { background: #f4e285; }
    .unhealthy { background: #f08080; }
    canvas {
      background: white;
      border-radius: 10px;
      padding: 10px;
    }
    footer {
      text-align: center;
      padding: 10px;
      background: #0077b6;
      color: white;
    }
  </style>
</head>
<body>
  <header>
    <h1>Bảng Điều Khiển Chất Lượng Không Khí</h1>
    <p id="datetime"></p>
  </header>

  <section class="grid" id="metrics">
    <!-- Cards dữ liệu sẽ được tạo động ở đây -->
  </section>

  <section style="padding: 20px;">
    <canvas id="aqiChart" width="400" height="150"></canvas>
  </section>

  <footer>
    &copy; 2025 - Dữ liệu từ API công khai
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    const metrics = [
      { name: "AQI", unit: "", key: "aqi" },
      { name: "PM2.5", unit: "μg/m³", key: "pm25" },
      { name: "PM10", unit: "μg/m³", key: "pm10" },
      { name: "CO", unit: "ppm", key: "co" },
      { name: "Nhiệt độ", unit: "°C", key: "temp" },
      { name: "Độ ẩm", unit: "%", key: "humidity" },
      { name: "Gó", unit: "km/h", key: "wind_speed" },
      { name: "Hướng gó", unit: "°", key: "wind_dir" },
      { name: "Lượng mưa", unit: "mm", key: "rain" },
    ];

    function getStatus(value) {
      if (value <= 50) return "good";
      if (value <= 100) return "moderate";
      return "unhealthy";
    }

    function updateDashboard(data) {
      const container = document.getElementById("metrics");
      container.innerHTML = "";
      metrics.forEach(metric => {
        const value = data[metric.key];
        const status = getStatus(value);
        container.innerHTML += `
          <div class="card">
            <h3>${metric.name}</h3>
            <p><strong>${value} ${metric.unit}</strong></p>
            <div class="status ${status}">${status.toUpperCase()}</div>
          </div>
        `;
      });
    }

    function updateTime() {
      const now = new Date();
      document.getElementById("datetime").textContent =
        now.toLocaleString("vi-VN");
    }

    // Biểu đồ thời gian thực
    const ctx = document.getElementById("aqiChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "AQI",
          data: [],
          borderColor: "#0077b6",
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "minute"
            }
          }
        }
      }
    });

    // Giả lập API
    function fetchFakeData() {
      return {
        aqi: Math.floor(Math.random() * 200),
        pm25: Math.random() * 100,
        pm10: Math.random() * 150,
        co: (Math.random() * 10).toFixed(2),
        temp: (20 + Math.random() * 10).toFixed(1),
        humidity: Math.floor(40 + Math.random() * 60),
        wind_speed: Math.floor(5 + Math.random() * 20),
        wind_dir: Math.floor(Math.random() * 360),
        rain: (Math.random() * 10).toFixed(1),
      };
    }

    function updateAll() {
      updateTime();
      const data = fetchFakeData(); // Đổi thành gọi API thật nếu cần
      updateDashboard(data);
      const timeLabel = new Date().toLocaleTimeString("vi-VN");
      chart.data.labels.push(timeLabel);
      chart.data.datasets[0].data.push(data.aqi);
      if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
      chart.update();
    }

    setInterval(updateAll, 5000);
    updateAll();
  </script>
</body>
</html>

