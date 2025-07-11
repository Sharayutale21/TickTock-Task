const timeSelect = document.getElementById("time-select");
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const tableBody = document.getElementById("table-body");
const clearAllBtn = document.getElementById("clear-all");
const darkToggle = document.getElementById("dark-toggle");
const downloadBtn = document.getElementById("download");

let schedule = JSON.parse(localStorage.getItem("schedule")) || {};

function renderTable() {
  tableBody.innerHTML = "";

  const sortedTimes = Object.keys(schedule).sort((a, b) => {
    const to24hr = (time) => {
      let [h, ap] = time.split(" ");
      h = parseInt(h);
      if (ap === "PM" && h !== 12) h += 12;
      if (ap === "AM" && h === 12) h = 0;
      return h;
    };
    return to24hr(a) - to24hr(b);
  });

  sortedTimes.forEach(time => {
    const { task, done } = schedule[time];

    const row = document.createElement("tr");
    const timeCell = document.createElement("td");
    const taskCell = document.createElement("td");
    const checkCell = document.createElement("td");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = done;
    checkbox.addEventListener("change", () => {
      schedule[time].done = checkbox.checked;
      localStorage.setItem("schedule", JSON.stringify(schedule));
      renderTable();
    });

    timeCell.textContent = time;
    taskCell.textContent = task;
    if (done) taskCell.classList.add("completed");

    checkCell.appendChild(checkbox);
    row.append(timeCell, taskCell, checkCell);
    tableBody.appendChild(row);
  });
}

addBtn.addEventListener("click", () => {
  const time = timeSelect.value;
  const task = taskInput.value.trim();

  if (!time || !task) {
    alert("Please select a time and enter a task.");
    return;
  }

  schedule[time] = { task, done: false };
  localStorage.setItem("schedule", JSON.stringify(schedule));

  taskInput.value = "";
  timeSelect.value = "";
  renderTable();
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Clear all tasks?")) {
    localStorage.removeItem("schedule");
    schedule = {};
    renderTable();
  }
});

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

downloadBtn.addEventListener("click", () => {
  const element = document.querySelector("#timetable");
  html2pdf().from(element).save("My_Daily_Timetable.pdf");
});

renderTable();
