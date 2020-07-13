let requestStatus;
const sendRequest = (event) => {
  const block = document.getElementById("details");
  const searchBtn = document.getElementById("search-btn");
  searchBtn.setAttribute("disabled", true);
  block.innerHTML = "Finding country ....";
  const from = document.getElementsByName("from")[0].value;
  event.preventDefault();
  const req = new XMLHttpRequest();
  req.onload = function () {
    requestStatus = setInterval(() => {
      getStatus(this.responseText, requestStatus);
    }, 1000);
  };
  req.open("GET", `/details/${from}`);
  req.setRequestHeader("content-type", "application/json");
  req.send();
};

const endInputAndSendRequest = function (event) {
  if (event.keyCode == 13) {
    sendRequest(event);
  }
};

const createPath = function (paths) {
  const [country] = JSON.parse(paths);
  const block = document.getElementById("details");
  block.innerHTML = "";
  block.style.display = "flex";
  if (!country) {
    block.innerHTML = "No Details Found.";
    return;
  }
  const heading = document.createElement("h3");
  heading.style.textAlign = "center";
  heading.innerHTML = country.CountryOrRegion;
  block.appendChild(heading);
  for (let key in country) {
    if (key !== "CountryOrRegion") {
      const node = document.createElement("div");
      const head = document.createElement("h5");
      const value = document.createElement("div");
      node.id = "circle";
      head.style.fontWeight = 700;
      value.innerHTML = country[key];
      head.innerHTML = `${key}  :  `;
      node.appendChild(head);
      node.appendChild(value);
      block.appendChild(node);
    }
  }
};

const getStatus = function (id) {
  const statusReq = new XMLHttpRequest();
  statusReq.onload = function () {
    const res = JSON.parse(this.responseText);
    if ((res.status = "completed")) {
      clearInterval(requestStatus);
      createPath(res.countryFound);
      const searchBtn = document.getElementById("search-btn");
      searchBtn.removeAttribute("disabled");
    }
  };
  statusReq.open("GET", `/status/${id}`);
  statusReq.setRequestHeader("content-type", "application/json");
  statusReq.send();
};
