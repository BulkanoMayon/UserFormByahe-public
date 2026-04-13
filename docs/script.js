const urlParams = new URLSearchParams(window.location.search);
const tracker_id = urlParams.get("tracker_id");
const car_name = urlParams.get("car_name");

const questionEl = document.getElementById("question");
const inputEl = document.getElementById("inputField");
const messageEl = document.getElementById("message");

let step = 0;

let data = {
  tracker_id: tracker_id || "",
  car_name: car_name || ""
};

const steps = [
  {
    question: `You are booking: ${car_name || "Unknown Vehicle"}`,
    field: null,
    type: null
  },
  {
    question: "Enter your name",
    field: "name",
    type: "text"
  },
  {
    question: "Enter your phone number",
    field: "phone",
    type: "text"
  },
  {
    question: "Select start date",
    field: "start_date",
    type: "date"
  },
  {
    question: "Select end date",
    field: "end_date",
    type: "date"
  }
];

function showMessage(text, isError = true) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "red" : "green";
}

function clearMessage() {
  messageEl.textContent = "";
}

function showStep() {
  const current = steps[step];
  questionEl.innerText = current.question;
  clearMessage();

  if (!current.field) {
    inputEl.style.display = "none";
    return;
  }

  inputEl.style.display = "block";
  inputEl.type = current.type;
  inputEl.value = "";

  if (current.type === "text") {
    inputEl.placeholder = "Enter value";
  } else {
    inputEl.placeholder = "";
  }

  inputEl.focus();
}

function nextStep() {
  const current = steps[step];

  if (current.field) {
    const value = inputEl.value;

    if (!value) {
      showMessage("Please fill in this field first.");
      return;
    }

    if (current.field === "start_date") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate = new Date(value);
      startDate.setHours(0, 0, 0, 0);

      if (startDate < today) {
        showMessage("Start date cannot be in the past.");
        return;
      }
    }

    if (current.field === "end_date") {
      const startDate = new Date(data.start_date);
      const endDate = new Date(value);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (endDate < startDate) {
        showMessage("End date cannot be earlier than start date.");
        return;
      }
    }

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
  questionEl.innerText = "Sending booking...";
  inputEl.style.display = "none";
  clearMessage();

  fetch("https://userformbyahe-public.onrender.com/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(async (res) => {
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to send booking.");
      }

      questionEl.innerText = "Booking Successful!";
      showMessage("Your booking was submitted successfully.", false);
    })
    .catch((err) => {
      questionEl.innerText = "Failed to send booking.";
      showMessage(err.message || "Something went wrong.");
    });
}

inputEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    nextStep();
  }
});

showStep();