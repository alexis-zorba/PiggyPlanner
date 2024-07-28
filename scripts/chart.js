function creaGrafico(dati, tipo = 'saldoCumulato') {
    const ctx = document.createElement('canvas');
    document.getElementById('grafico').innerHTML = '';
    document.getElementById('grafico').appendChild(ctx);

    let datasetLabel, dataToShow, chartType, backgroundColor, borderColor;
    switch (tipo) {
        case 'ricaviMensili':
            datasetLabel = translations[state.currentLanguage].monthlyIncomeLabel;
            dataToShow = dati.entrateMensili;
            chartType = 'bar';
            backgroundColor = 'rgba(75, 192, 192, 0.6)';
            borderColor = 'rgb(75, 192, 192)';
            break;
        case 'costiMensili':
            datasetLabel = translations[state.currentLanguage].monthlyExpensesLabel;
            dataToShow = dati.usciteMensili;
            chartType = 'bar';
            backgroundColor = 'rgba(255, 99, 132, 0.6)';
            borderColor = 'rgb(255, 99, 132)';
            break;
        case 'margineMensile':
            datasetLabel = translations[state.currentLanguage].monthlyMarginLabel;
            dataToShow = dati.entrateMensili.map((entrata, i) => entrata - dati.usciteMensili[i]);
            chartType = 'bar';
            backgroundColor = dataToShow.map(value => 
                value < 0 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)'
            );
            borderColor = dataToShow.map(value => 
                value < 0 ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)'
            );
            break;
        default:
            datasetLabel = translations[state.currentLanguage].cumulativeBalanceLabel;
            dataToShow = dati.saldoCumulato;
            chartType = 'line';
            backgroundColor = undefined;
            borderColor = 'rgb(75, 192, 192)';
    }

    new Chart(ctx, {
        type: chartType,
        data: {
            labels: Array.from({length: dataToShow.length}, (_, i) => `${translations[state.currentLanguage].durationLabel.split(' ')[0]} ${i}`),
            datasets: [{
                label: datasetLabel,
                data: dataToShow,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}