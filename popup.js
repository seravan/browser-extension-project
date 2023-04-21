const whoisButton = document.querySelector("#dataForm");
const reputationButton = document.querySelector("#reputation");
const vulnerableButton = document.querySelector("#vulnerable");
//Whois Function -- Fill here --remove the line
reputationButton.addEventListener("submit", async (e) => {
  e.preventDefault();
  // get domain from the input field
  const domain = reputationButton.querySelector(
    'input[name="reputation-url"]'
  ).value;
  // Define the API endpoint
  const apiUrl = "https://domain-reputation.whoisxmlapi.com/api/v2";
  // Define the API key and output format
  const apiKey = "at_nnxXYPUjPgbLt68Jr7iL66rbLHeNA";
  const outputFormat = "json";
  let reputationData = {};

  // Define the domain name you want to lookup
  const domainName = domain;

  // Define the API query parameters
  const queryParams = new URLSearchParams({
    apiKey,
    domainName,
    outputFormat,
  });

  // Define the API request URL
  const url = `${apiUrl}?${queryParams}`;
  // Make an API request to retrieve reputation data
  try {
    const response = await fetch(url);
    reputationData = await response.json();
  } catch (error) {
    alert("failed to fetch the data !!!");
  }

  const template = document.getElementById("reputation_template");
  const elements = new Set();
  const element = template.content.firstElementChild.cloneNode(true);

  element.querySelector(".domainName").textContent =
    element.querySelector(".domainName").textContent + " " + domainName;
  element.querySelector(".mode").textContent =
    element.querySelector(".mode").textContent + " " + reputationData.mode;
  element.querySelector(".reputationScore").textContent =
    element.querySelector(".reputationScore").textContent +
    " " +
    reputationData.reputationScore;

  elements.add(element);
  document.querySelector("#reputation-info").append(...elements);
});
//Vulnerable-JS-Components
reputationButton.addEventListener("submit", async (e) => {
  e.preventDefault();
  // get domain from the input field
  const domain = reputationButton.querySelector(
    'input[name="reputation-url"]'
  ).value;
  // Define the API endpoint
  const apiUrl = "https://domain-reputation.whoisxmlapi.com/api/v2";
  // Define the API key and output format
  const apiKey = "at_nnxXYPUjPgbLt68Jr7iL66rbLHeNA";
  const outputFormat = "json";
  let reputationData = {};

  // Define the domain name you want to lookup
  const domainName = domain;

  // Define the API query parameters
  const queryParams = new URLSearchParams({
    apiKey,
    domainName,
    outputFormat,
  });

  // Define the API request URL
  const url = `${apiUrl}?${queryParams}`;
  // Make request to backend
  try {
    const response = await fetch(url);
    reputationData = await response.json();
  } catch (error) {
    alert("failed to fetch the data !!!");
  }

  const template = document.getElementById("reputation_template");
  const elements = new Set();
  const element = template.content.firstElementChild.cloneNode(true);

  element.querySelector(".domainName").textContent =
    element.querySelector(".domainName").textContent + " " + domainName;
  element.querySelector(".mode").textContent =
    element.querySelector(".mode").textContent + " " + reputationData.mode;
  element.querySelector(".reputationScore").textContent =
    element.querySelector(".reputationScore").textContent +
    " " +
    reputationData.reputationScore;

  elements.add(element);
  document.querySelector("#reputation-info").append(...elements);
});

vulnerableButton.addEventListener("submit", async (e) => {
  e.preventDefault();
  // get domain from the input field
  const url = vulnerableButton.querySelector(
    'input[name="vulnerable-url"]'
  ).value;
  const queryParams = new URLSearchParams({
    url,
  });
  // Define the API endpoint
  const apiUrl = `http://localhost:5000/vulnerable-components?${queryParams}`;
  // Define the API key and output format
  let vulnerableData = {};
  let data;
  
  try {
    vulnerableData = await fetch(apiUrl);
    data = await vulnerableData.json();

    // vulnerableData = await response.json();
  } catch (error) {
    alert("failed to fetch the data !!!");
  }

  const x = document.getElementById("vulnerable-info");
  const waitData = async () => {
    return await data;
  };
  waitData().then((data) =>
    Object.values(data.body).map((el) => {
      const e = document.createElement("p");
      e.textContent = el;
      x.append(e);
    })
  );
});