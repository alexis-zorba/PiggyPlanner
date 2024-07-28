function creaRiga(categoria, importo, frequenza, meseInizio) {
    const tr = document.createElement('tr');
    const frequenzaIndex = frequenze.codes.indexOf(frequenza);
    tr.innerHTML = `
        <td><input type="text" value="${categoria}" class="categoria-input"></td>
        <td><input type="number" value="${importo}"></td>
        <td>
            <select>
                ${frequenze.codes.map((f, index) => 
                    `<option value="${f}" ${index === frequenzaIndex ? 'selected' : ''}>
                        ${frequenze[state.currentLanguage][index]}
                     </option>`
                ).join('')}
            </select>
        </td>
        <td><input type="number" value="${meseInizio}" min="1" max="12"></td>
    `;
    return tr;
}
function calcolaImportoPerMese(importo, frequenza, meseInizio, mese) {
    if (mese < meseInizio) return 0;
    
    switch (frequenza) {
        case 'one-time':
            return (mese === meseInizio) ? importo : 0;
        case 'daily':
            return importo * 30;
        case 'weekly':
            return importo * 4;
        case 'monthly':
            return importo;
        case 'quarterly':
            return ((mese - meseInizio) % 3 === 0) ? importo : 0;
        case 'semi-annually':
            return ((mese - meseInizio) % 6 === 0) ? importo : 0;
        case 'annually':
            return ((mese - meseInizio) % 12 === 0) ? importo : 0;
        default:
            return 0;
    }
}

function analizzaSpese(spesePerCategoria, durataValue, totaleUscite) {
    const analisiSpeseElement = document.getElementById('analisi-spese');
    analisiSpeseElement.innerHTML = '';
    for (const [categoria, totale] of Object.entries(spesePerCategoria)) {
        const mediaSpesaMensile = totale / durataValue;
        const percentualeSulTotale = (totale / totaleUscite) * 100;
        
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${categoria}</strong><br>
            ${window.translations[window.state.currentLanguage].averageMonthly}: <span>${window.state.currentCurrency} ${mediaSpesaMensile.toFixed(2)}</span><br>
            ${window.translations[window.state.currentLanguage].percentageOfTotal}: <span>${percentualeSulTotale.toFixed(2)}%</span>
        `;
        analisiSpeseElement.appendChild(div);
    }
}