// Entrate di default
const entrateDefault = [
    { categoria: 'Stipendio', importo: 2500, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Bonus', importo: 3000, frequenza: 'annually', meseInizio: 12 },
    { categoria: 'Interessi bancari', importo: 50, frequenza: 'quarterly', meseInizio: 1 },
    { categoria: 'Affitto percepito', importo: 800, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Dividendi', importo: 500, frequenza: 'semi-annually', meseInizio: 6 }
];

// Spese di default
const speseDefault = [
    { categoria: 'Affitto/Mutuo', importo: 1000, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Spese alimentari', importo: 400, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Bollette (luce, gas, acqua)', importo: 150, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Internet e telefono', importo: 50, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Trasporti', importo: 100, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Assicurazione auto', importo: 600, frequenza: 'annually', meseInizio: 3 },
    { categoria: 'Abbonamento palestra', importo: 40, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Spese mediche', importo: 200, frequenza: 'quarterly', meseInizio: 1 },
    { categoria: 'Abbigliamento', importo: 150, frequenza: 'quarterly', meseInizio: 1 },
    { categoria: 'Intrattenimento', importo: 100, frequenza: 'monthly', meseInizio: 1 },
    { categoria: 'Vacanze', importo: 1500, frequenza: 'annually', meseInizio: 7 },
    { categoria: 'Regali', importo: 200, frequenza: 'quarterly', meseInizio: 1 },
    { categoria: 'Imprevisti', importo: 100, frequenza: 'monthly', meseInizio: 1 }
];

window.frequenze = {
    codes: ['one-time', 'daily', 'weekly', 'monthly', 'quarterly', 'semi-annually', 'annually'],
    it: ['una tantum', 'giornaliera', 'settimanale', 'mensile', 'trimestrale', 'semestrale', 'annuale'],
    en: ['one-time', 'daily', 'weekly', 'monthly', 'quarterly', 'semi-annually', 'annually']
};
