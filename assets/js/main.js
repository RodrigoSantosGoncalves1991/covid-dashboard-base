let summary = [];
let countries = [];
let dataCountry;
let nameOption;
let dataChangeDate;

const selectElement = document.querySelector('select');

const actives = document.getElementById('actives');
const today = document.getElementById('today');
const active = document.getElementById('active');
const confirmed = document.getElementById('confirmed');
const death = document.getElementById('death');
const recovered = document.getElementById('recovered');
const tactive = document.getElementById('tactive');
const tconfirmed = document.getElementById('tconfirmed');
const tdeath = document.getElementById('tdeath');
const trecovered = document.getElementById('trecovered');

function renderCountries() {
  countries.sort((a, b) => {
    if (a.Country > b.Country) {
      return 1;
    }
    if (a.Country < b.Country) {
      return -1;
    }
    return 0;
  });
  for (const country of countries) {
    const option = document.createElement('option');
    option.textContent = country.Country;
    selectElement.appendChild(option);
  }
}

function renderDashboardBySelectCountry() {
  //console.log(dataChangeDate);
  //console.log(dataCountry);
  if (dataChangeDate) {
    actives.textContent = 'Ativos';
    active.textContent = dataChangeDate.TotalActives.toLocaleString('pt-BR');
    confirmed.textContent =
      dataChangeDate.TotalConfirmed.toLocaleString('pt-BR');
    death.textContent = dataChangeDate.TotalDeaths.toLocaleString('pt-BR');
    recovered.textContent =
      dataChangeDate.TotalRecovered.toLocaleString('pt-BR');
    tactive.innerHTML = `<img src="./assets/img/${
      dataChangeDate.comparationNewActives
    }.png"> Diário ${dataChangeDate.NewActives.toLocaleString('pt-BR')}`;
    tconfirmed.innerHTML = `<img src="./assets/img/${
      dataChangeDate.comparationNewConfirmed
    }.png"> Diário ${dataChangeDate.NewConfirmed.toLocaleString('pt-BR')}`;
    tdeath.innerHTML = `<img src="./assets/img/${
      dataChangeDate.comparationNewDeaths
    }.png"> Diário ${dataChangeDate.NewDeaths.toLocaleString('pt-BR')}`;
    trecovered.innerHTML = `<img src="./assets/img/${
      dataChangeDate.comparationNewRecovered
    }.png"> Diário ${dataChangeDate.NewRecovered.toLocaleString('pt-BR')}`;
  } else {
    if (dataCountry) {
      actives.textContent = 'Ativos';
      let NumberActives =
        dataCountry.TotalConfirmed -
        dataCountry.TotalDeaths -
        dataCountry.TotalRecovered;
      active.textContent = NumberActives.toLocaleString('pt-BR');
      confirmed.textContent =
        dataCountry.TotalConfirmed.toLocaleString('pt-BR');
      death.textContent = dataCountry.TotalDeaths.toLocaleString('pt-BR');
      recovered.textContent =
        dataCountry.TotalRecovered.toLocaleString('pt-BR');
      let data = dataCountry.Date;
      [data, horario] = data.split('T');
      today.value = data;
    } else if (!nameOption) {
      const arrayGlobal = summary.Global;
      confirmed.textContent =
        arrayGlobal.TotalConfirmed.toLocaleString('pt-BR');
      death.textContent = arrayGlobal.TotalDeaths.toLocaleString('pt-BR');
      recovered.textContent =
        arrayGlobal.TotalRecovered.toLocaleString('pt-BR');
      actives.textContent = 'Atualização';
      let data = arrayGlobal.Date;
      [data, horario] = data.split('T');
      today.value = data;
      active.textContent = `${data
        .split('-')
        .reverse()
        .join('-')} ${horario.substr(0, 5)}`;
    } else {
      confirmed.textContent = 'Sem dados';
      death.textContent = 'Sem dados';
      recovered.textContent = 'Sem dados';
      active.textContent = 'Sem dados';
      actives.textContent = 'Ativos';
      //let data =  dataCountry.Date;
      //[data, horario] = data.split('T');
      //today.value = data;
    }
  }
  dataChangeDate = undefined;
}

function selectCountry() {
  //dataCountry = undefined;
  //nameOption = undefined;
  const index = selectElement.options.selectedIndex - 1;
  //const nameOption = countries[index].ISO2;
  index > -1 ? (nameOption = countries[index].ISO2) : (nameOption = undefined);
  const arrayCountries = summary.Countries;
  dataCountry = arrayCountries.find(
    country => country.CountryCode == nameOption
  );
  //console.log(dataCountry);
  renderDashboardBySelectCountry();
}

function simplifiesData(data) {
  let active = data
    .map(d => d.Active)
    .reduce((summ, currentValue) => {
      return summ + currentValue;
    });
  let confirmed = data
    .map(d => d.Confirmed)
    .reduce((summ, currentValue) => {
      return summ + currentValue;
    });
  let deaths = data
    .map(d => d.Deaths)
    .reduce((summ, currentValue) => {
      return summ + currentValue;
    });
  let recovered = data
    .map(d => d.Recovered)
    .reduce((summ, currentValue) => {
      return summ + currentValue;
    });
}

function processData(dias) {
  //console.log(dias);
  //console.log(dataChangeDate);
  let dataArray = [];
  for (let dia of dias) {
    let data = dataChangeDate.filter(d => d.Date == `${dia}T00:00:00Z`);
    let active = data
      .map(d => d.Active)
      .reduce((summ, currentValue) => {
        return summ + currentValue;
      });
    let confirmed = data
      .map(d => d.Confirmed)
      .reduce((summ, currentValue) => {
        return summ + currentValue;
      });
    let deaths = data
      .map(d => d.Deaths)
      .reduce((summ, currentValue) => {
        return summ + currentValue;
      });
    let recovered = data
      .map(d => d.Recovered)
      .reduce((summ, currentValue) => {
        return summ + currentValue;
      });
    dataArray.push({
      Country: data[0].Country,
      CountryCode: data[0].CountryCode,
      Date: data[0].Date,
      NewActives: undefined,
      NewConfirmed: undefined,
      NewDeaths: undefined,
      NewRecovered: undefined,
      TotalActives: active,
      TotalConfirmed: confirmed,
      TotalDeaths: deaths,
      TotalRecovered: recovered,
    });
  }
  //console.log(dataArray);
  for (let i = 0; i < dataArray.length - 1; i++) {
    dataArray[2 - i].NewConfirmed =
      dataArray[2 - i].TotalConfirmed - dataArray[1 - i].TotalConfirmed;
    dataArray[2 - i].NewDeaths =
      dataArray[2 - i].TotalDeaths - dataArray[1 - i].TotalDeaths;
    dataArray[2 - i].NewRecovered =
      dataArray[2 - i].TotalRecovered - dataArray[1 - i].TotalRecovered;
    dataArray[2 - i].NewActives =
      dataArray[2 - i].TotalActives - dataArray[1 - i].TotalActives;
  }
  let dataResult = dataArray[2];
  dataResult.comparationNewActives =
    dataArray[2].NewActives > dataArray[1].NewActives ? 'up' : 'down';
  dataResult.comparationNewConfirmed =
    dataArray[2].NewConfirmed > dataArray[1].NewConfirmed ? 'up' : 'down';
  dataResult.comparationNewDeaths =
    dataArray[2].NewDeaths > dataArray[1].NewDeaths ? 'up' : 'down';
  dataResult.comparationNewRecovered =
    dataArray[2].NewRecovered > dataArray[1].NewRecovered ? 'up' : 'down';
  //console.log(dataResult);
  return dataResult;
}

async function selectDate() {
  let dia = new Date(today.value);
  let diaOntem = new Date(today.value);
  let diaAnteontem = new Date(today.value);
  diaOntem.setDate(diaOntem.getDate() - 1);
  diaAnteontem.setDate(diaAnteontem.getDate() - 2);
  dia = dia.toISOString();
  diaOntem = diaOntem.toISOString();
  diaAnteontem = diaAnteontem.toISOString();
  [dia, horario] = dia.split('T');
  [diaOntem, horario] = diaOntem.split('T');
  [diaAnteontem, horario] = diaAnteontem.split('T');
  dataChangeDate = await ByCountryAllStatus(
    dataCountry.Slug,
    dia,
    diaAnteontem
  );
  dataChangeDate = processData([diaAnteontem, diaOntem, dia]);
  //console.log(dataChangeDate);
  renderDashboardBySelectCountry();
}

async function init() {
  [summary, countries] = await Promise.all([listSummary(), listCountries()]);
  renderCountries();
  renderDashboardBySelectCountry();
  selectElement.addEventListener('change', selectCountry);
  today.addEventListener('change', selectDate);
}

init();
