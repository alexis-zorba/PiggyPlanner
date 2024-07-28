document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const elements = {
        form: document.getElementById('form'),
        cassaIniziale: document.getElementById('cassa-iniziale'),
        durata: document.getElementById('durata'),
        entrateTable: document.getElementById('entrate'),
        speseTable: document.getElementById('spese'),
        calcola: document.getElementById('calcola'),
        grafico: document.getElementById('grafico'),
        saldoFinale: document.getElementById('saldo-finale'),
        esposizioneMaxSpan: document.getElementById('esposizione-massima'),
        piccoMaxSpan: document.getElementById('picco-massimo'),
        totaleEntrateSpan: document.getElementById('totale-entrate'),
        totaleUsciteSpan: document.getElementById('totale-uscite'),
        risparmioSpan: document.getElementById('risparmio'),
        analisiSpese: document.getElementById('analisi-spese'),
        languageSelect: document.getElementById('language'),
        currencySelect: document.getElementById('currency'),
        themeSelect: document.getElementById('theme'),
        chartTypeSelect: document.getElementById('chart-type')
    };

    // State
    window.state = {
        currentLanguage: 'it',
        currentCurrency: 'EUR',
        currentTheme: 'light'
    };
	
    // Make state and other constants globally accessible
    window.state = state;
    window.translations = translations;
    window.frequenze = frequenze;

	function updateLanguage() {
		const t = translations[state.currentLanguage];
		const elementsToUpdate = [
			{ id: 'settings-title', text: t.settingsTitle },
			{ id: 'initial-balance-label', text: t.initialBalanceLabel },
			{ id: 'duration-label', text: t.durationLabel },
			{ id: 'income-title', text: t.incomeTitle },
			{ id: 'expenses-title', text: t.expensesTitle },
			{ id: 'results-title', text: t.resultsTitle },
			{ id: 'final-balance-label', text: t.finalBalanceLabel },
			{ id: 'max-exposure-label', text: t.maxExposureLabel },
			{ id: 'max-peak-label', text: t.maxPeakLabel },
			{ id: 'total-income-label', text: t.totalIncomeLabel },
			{ id: 'total-expenses-label', text: t.totalExpensesLabel },
			{ id: 'savings-label', text: t.savingsLabel },
			{ id: 'expense-analysis-title', text: t.expenseAnalysisTitle }
		];

		elementsToUpdate.forEach(el => {
			const element = document.getElementById(el.id);
			if (element) {
				element.textContent = el.text;
			} else {
				console.warn(`Element with id '${el.id}' not found`);
			}
		});

		// Update table headers
		['entrate', 'spese'].forEach(tableId => {
			const table = document.getElementById(tableId);
			if (table) {
				const headers = table.querySelector('tr');
				if (headers) {
					headers.children[0].textContent = t.categoryLabel;
					headers.children[1].textContent = t.amountLabel;
					headers.children[2].textContent = t.frequencyLabel;
					headers.children[3].textContent = t.startMonthLabel;
				}
			}
		});

		if (elements.calcola) {
			elements.calcola.textContent = t.calculateButton;
		} else {
			console.warn("Calculate button element not found");
		}

		// Update frequency options
		document.querySelectorAll('select').forEach(select => {
			if (select.id !== 'language' && select.id !== 'currency' && select.id !== 'theme' && select.id !== 'chart-type') {
				const selectedValue = select.value;
				select.innerHTML = '';
				frequenze.codes.forEach((code, index) => {
					const option = document.createElement('option');
					option.value = code;
					option.textContent = frequenze[state.currentLanguage][index];
					select.appendChild(option);
				});
				select.value = selectedValue;
			}
		});

		// Update chart type options
		if (elements.chartTypeSelect) {
			elements.chartTypeSelect.innerHTML = `
				<option value="saldoCumulato">${t.cumulativeBalanceLabel}</option>
				<option value="ricaviMensili">${t.monthlyIncomeLabel}</option>
				<option value="costiMensili">${t.monthlyExpensesLabel}</option>
				<option value="margineMensile">${t.monthlyMarginLabel}</option>
			`;
		} else {
			console.warn("Chart type select element not found");
		}
	}

    function updateCurrency() {
        const currencySymbol = state.currentCurrency === 'EUR' ? '€' : state.currentCurrency === 'USD' ? '$' : '£';
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.placeholder = `${currencySymbol}`;
        });
    }

    function updateTheme() {
        document.body.className = `theme-${state.currentTheme}`;
    }

    function popolaTabella(tabella, dati) {
        const t = translations[state.currentLanguage];
        tabella.innerHTML = `
            <tr>
                <th>${t.categoryLabel}</th>
                <th>${t.amountLabel}</th>
                <th>${t.frequencyLabel}</th>
                <th>${t.startMonthLabel}</th>
            </tr>
        `;
        dati.forEach(dato => {
            tabella.appendChild(creaRiga(dato.categoria, dato.importo, dato.frequenza, dato.meseInizio));
        });
        aggiungiEventListenerCategorie();
    }

    function aggiungiEventListenerCategorie() {
        document.querySelectorAll('.categoria-input').forEach(input => {
            input.addEventListener('change', (e) => {
                console.log(`Categoria modificata: ${e.target.value}`);
                calcolaEvent();
            });
        });
    }

    function calcolaEvent() {
        const cassaInizialeValue = parseFloat(elements.cassaIniziale.value);
        const durataValue = parseInt(elements.durata.value);
        let saldo = cassaInizialeValue;
        let totaleEntrate = 0;
        let totaleUscite = 0;
        let esposizioneMax = saldo;
        let piccoMax = saldo;
        const datiGrafico = {
            saldoCumulato: [saldo],
            entrateMensili: [],
            usciteMensili: []
        };
        const spesePerCategoria = {};

        const entrate = Array.from(elements.entrateTable.querySelectorAll('tr')).slice(1);
        const spese = Array.from(elements.speseTable.querySelectorAll('tr')).slice(1);

        for (let mese = 1; mese <= durataValue; mese++) {
            let entrateDelMese = 0;
            let usciteDelMese = 0;

            entrate.forEach(entrata => {
                const categoria = entrata.querySelector('.categoria-input').value;
                const importo = parseFloat(entrata.querySelector('input[type="number"]').value);
                const frequenza = entrata.querySelector('select').value;
                const meseInizio = parseInt(entrata.querySelectorAll('input[type="number"]')[1].value);
                const importoMensile = calcolaImportoPerMese(importo, frequenza, meseInizio, mese);
                entrateDelMese += importoMensile;
                totaleEntrate += importoMensile;
            });

            spese.forEach(spesa => {
                const categoria = spesa.querySelector('.categoria-input').value;
                const importo = parseFloat(spesa.querySelector('input[type="number"]').value);
                const frequenza = spesa.querySelector('select').value;
                const meseInizio = parseInt(spesa.querySelectorAll('input[type="number"]')[1].value);
                const importoMensile = calcolaImportoPerMese(importo, frequenza, meseInizio, mese);
                usciteDelMese += importoMensile;
                totaleUscite += importoMensile;
                
                if (!spesePerCategoria[categoria]) {
                    spesePerCategoria[categoria] = 0;
                }
                spesePerCategoria[categoria] += importoMensile;
            });

            saldo = saldo + entrateDelMese - usciteDelMese;
            
            if (saldo < esposizioneMax) {
                esposizioneMax = saldo;
            }
            
            if (saldo > piccoMax) {
                piccoMax = saldo;
            }

            datiGrafico.saldoCumulato.push(saldo);
            datiGrafico.entrateMensili.push(entrateDelMese);
            datiGrafico.usciteMensili.push(usciteDelMese);
        }

        const risparmio = saldo - cassaInizialeValue;

        const currencySymbol = state.currentCurrency === 'EUR' ? '€' : state.currentCurrency === 'USD' ? '$' : '£';
        elements.saldoFinale.textContent = `${currencySymbol} ${saldo.toFixed(2)}`;
        elements.esposizioneMaxSpan.textContent = `${currencySymbol} ${Math.min(0, esposizioneMax).toFixed(2)}`;
        elements.piccoMaxSpan.textContent = `${currencySymbol} ${piccoMax.toFixed(2)}`;
        elements.totaleEntrateSpan.textContent = `${currencySymbol} ${totaleEntrate.toFixed(2)}`;
        elements.totaleUsciteSpan.textContent = `${currencySymbol} ${totaleUscite.toFixed(2)}`;
        elements.risparmioSpan.textContent = `${currencySymbol} ${risparmio.toFixed(2)}`;

        creaGrafico(datiGrafico, elements.chartTypeSelect.value);
        analizzaSpese(spesePerCategoria, durataValue, totaleUscite);
    }

    // Event Listeners
    elements.languageSelect.addEventListener('change', (e) => {
        state.currentLanguage = e.target.value;
        updateLanguage();
        popolaTabella(elements.entrateTable, entrateDefault);
        popolaTabella(elements.speseTable, speseDefault);
        calcolaEvent();
    });

    elements.currencySelect.addEventListener('change', (e) => {
        state.currentCurrency = e.target.value;
        updateCurrency();
        calcolaEvent();
    });

    elements.themeSelect.addEventListener('change', (e) => {
        state.currentTheme = e.target.value;
        updateTheme();
    });

    elements.calcola.addEventListener('click', calcolaEvent);

    elements.chartTypeSelect.addEventListener('change', () => {
        calcolaEvent();
    });

    // Initialization
    popolaTabella(elements.entrateTable, entrateDefault);
    popolaTabella(elements.speseTable, speseDefault);
    updateLanguage();
    updateCurrency();
    updateTheme();
    calcolaEvent();
});