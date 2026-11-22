const form = document.querySelector("#runtime-calculator");
const output = document.querySelector("#runtime-output");

function updateRuntime() {
  const ampHours = Number(document.querySelector("#battery-ah").value);
  const amps = Number(document.querySelector("#pump-amps").value);
  const usable = Number(document.querySelector("#battery-type").value);
  const hours = ampHours > 0 && amps > 0 ? ampHours * usable / amps : 0;
  output.textContent = hours ? `About ${hours.toFixed(1)} hours of continuous pumping` : "Enter a battery and pump size";
}

form.addEventListener("input", updateRuntime);
updateRuntime();
