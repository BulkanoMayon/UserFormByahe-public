const urlParams = new URLSearchParams(window.location.search);
const tracker_id = urlParams.get("tracker_id");
const car_name = urlParams.get("car_name");

const questionEl = document.getElementById("question");
const inputEl = document.getElementById("inputField");
const messageEl = document.getElementById("message");

let step = 0;

let data = {
  tracker_id: tracker_id,
  car_name: car_name
};

const steps = [
  { question: `🚗 You are booking: ${car_name}`, field: null, type: null },
  { question: "👤 Enter your name", field: "name", type: "text",},
  { question: "📱 Enter your phone number", field: "phone", type: "text" },
  { question: "📅 Select start date", field: "start_date", type: "date" },
  { question: "📅 Select end date", field: "end_date", type: "date" }
];

function showStep() {
  const current = steps[step];

  questionEl.innerText = current.question;

  if (!current.field) {
    inputEl.style.display = "none";
  } else {
    inputEl.style.display = "block";
    inputEl.value = "";
    inputEl.type = current.type;
    inputEl.placeholder = "Select / Enter value";
    inputEl.focus();
  }
}

function nextStep() {
  const current = steps[step];

  if (current.field) {
    const value = inputEl.value.trim();
    if (!value) return;

    data[current.field] = value;
  }

  step++;

  if (step < steps.length) {
    showStep();
  } else {
    submitData();
  }
}

function submitData() {
  questionEl.innerText = "⏳ Sending booking...";
  inputEl.style.display = "none";

  fetch("http://192.168.100.55:5000/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    questionEl.innerText = "🎉 Booking Successful!";
  })
  .catch(() => {
    questionEl.innerText = "❌ Failed to send booking.";
  });
}

// start
showStep();