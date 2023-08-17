const search = document.getElementById("search");
const dataDisplay = document.getElementById("data-display");

search.onsubmit = async (event) => {
  event.preventDefault();

  const tickerSymbol = event.target.tickerSymbol.value;
  const period = event.target.period.value;
  const sort = event.target.sortby.value;

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

    if (sort == "earliestFirst") {
      result = reverse(result);
    }

    createTable(result);
  } catch (error) {
    console.error(error);
  }
};

function reverse(entries) {
  const dates = entries["Date"];
  const open = entries["Open"];
  const high = entries["High"];
  const low = entries["Low"];
  const close = entries["Close"];
  const volume = entries["Volume"];

  return {
    Date: dates.reverse(),
    Open: open.reverse(),
    High: high.reverse(),
    Low: low.reverse(),
    Close: close.reverse(),
    Volume: volume.reverse(),
  };
}

function createTable(entries) {
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

  for (let i = 0; i < n; i++) {
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
