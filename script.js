document.getElementById('calculator-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const solarCapacity = parseFloat(document.getElementById('solar-capacity').value);
    const noOfDays = parseFloat(document.getElementById('no-of-days').value);
    const temperatureCoefficient = parseFloat(document.getElementById('temperature-coefficient').value) / 100;
    const shadowLossPercentage = parseFloat(document.getElementById('shadow-loss-percentage').value) / 100;
    const place = document.getElementById('place').value;
    const startTime = new Date(document.getElementById('start-time').value);
    const endTime = new Date(document.getElementById('end-time').value);
    const noOfYears = parseFloat(document.getElementById('no-of-years').value);

    // Placeholder energy yield calculation (replace with your actual logic)
    const energyYield = 1000; // Placeholder value, replace with actual energy yield calculation

    // Monthly average temperature data (example values, replace with actual data)
    const temperatureData = {
        1: 25.025, 2: 27.325, 3: 27.9, 4: 28.425, 5: 30.1, 6: 28.8, 7: 27.975, 8: 27.325, 9: 29, 10: 29.45, 11: 27.825, 12: 25.825
    };

    // Calculate average daily temperature for the given date range
    const startYear = startTime.getFullYear();
    const startMonth = startTime.getMonth() + 1;
    const endYear = endTime.getFullYear();
    const endMonth = endTime.getMonth() + 1;

    let totalTemperature = 0;
    let count = 0;

    for (let year = startYear; year <= endYear; year++) {
        const start = (year === startYear) ? startMonth : 1;
        const end = (year === endYear) ? endMonth : 12;
        for (let month = start; month <= end; month++) {
            totalTemperature += temperatureData[month];
            count++;
        }
    }

    const dailyTemperature = totalTemperature / count;

    // Constants
    const NOCT = 45;
    const fixedDeratingFactor = 0.83;

    // Calculate derating factors
    const cellCoefficient = dailyTemperature + NOCT - 20;
    const temperatureDeratingFactor = 1 - (temperatureCoefficient * (cellCoefficient - 25));
    const shadowDeratingFactor = 1 - shadowLossPercentage;

    let degradationFactor;
    if (noOfYears <= 1) {
        degradationFactor = 1;
    } else if (noOfYears <= 2) {
        degradationFactor = 1 - (0.03 * (noOfYears - 1));
    } else {
        degradationFactor = 1 - (0.0065 * (noOfYears - 2));
    }

    const totalDeratingFactor = temperatureDeratingFactor * shadowDeratingFactor * fixedDeratingFactor * degradationFactor;

    // Calculate GHI
    let ghi;
    if (energyYield > 0) {
        ghi = energyYield / (solarCapacity * noOfDays * totalDeratingFactor);
    } else {
        ghi = 'N/A';
    }

    // Calculate specific yield
    const specificYield = energyYield / solarCapacity / 30;

    // Display results
    document.getElementById('result').innerHTML = `
        <p>GHI is: ${ghi} kWh/m2/day</p>
        <p>Specific yield is: ${specificYield.toFixed(2)}</p>
    `;
});
