const search = document.getElementById("search");
const dataDisplay = document.getElementById("data-display");

search.addEventListener("submit", handleSubmit, false);

function handleSubmit(event) {
  event.preventDefault();

  const { tickerSymbol, period, sortby } = event.target;

  let response = getData(tickerSymbol.value, period.value);

  if (response.ok) {
    createTable(response.result, sortby.value == "earliestFirst");
  } else {
    displayError(response.error);
  }
}

function displayError(error) {
  // Function to display error to the user
  console.log(error);
}

async function getData(tickerSymbol, period) {
  const url = `https://macrotrends-finance.p.rapidapi.com/quotes/history-price?symbol=${tickerSymbol}&range=${period}`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e1f2269c84msh9173271d544e884p12f054jsn05aaabee7e86",
      "X-RapidAPI-Host": "macrotrends-finance.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    let result = await response.json();

    return { ok: true, result };
  } catch (error) {
    console.log(error);
    return { ok: false, error };
  }
}

function createTable(entries, reversed = false) {
  const dates = entries["Date"];
  const open = entries["Open"];
  const high = entries["High"];
  const low = entries["Low"];
  const close = entries["Close"];
  const volume = entries["Volume"];

  const n = dates.length;

  let table = `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Open</th>
                    <th scope="col">High</th>
                    <th scope="col">Low</th>
                    <th scope="col">Close</th>
                    <th scope="col">Volume</th>
                </tr>
            </thead>
    `;

  // Dynamic Indices
  const indices = Array.from(Array(n), (_, i) => (reversed ? n - i - 1 : i));

  for (const i of indices) {
    const rowEntry = `
            <tr>
                <td>${dates[i]}</td>
                <td>${open[i]}</td>
                <td>${high[i]}</td>
                <td>${low[i]}</td>
                <td>${close[i]}</td>
                <td>${volume[i]}</td>
            </tr>
        `;
    table += rowEntry;
  }

  table += `</table>`;

  dataDisplay.innerHTML = "";
  dataDisplay.innerHTML = table;
}
