function fetchJson(url, options) {
    return fetch(url, options).then((r) => {
        if(r.ok) {
            return r.json(); 
        } else {
            throw new Error(r.statusText);
        }
    }).catch((error) => {
        throw error;
    });

}

const baseUrl = "https://api.covid19api.com";

function listSummary() {
    return fetchJson(`${baseUrl}/summary`);
}

function listCountries() {
    return fetchJson(`${baseUrl}/countries`);
}

function ByCountryAllStatus(countrySlug, dia, diaAnterior) {
    return fetchJson(`${baseUrl}/country/${countrySlug}?from=${diaAnterior}T00:00:00Z&to=${dia}T00:00:00Z`);
}