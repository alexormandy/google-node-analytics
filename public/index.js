const messageOne = document.getElementById("messsageOne");
let today, yesterday, thirtyDays;

messageOne.textContent = "Fetching Data Please Wait...";

function goFetch() {
  fetch(`/fetch`).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        messageOne.textContent = data.error;
      } else {
        today = data.today;
        yesterday = data.yesterday;
        thirtyDays = data.last30Days;
        messageOne.textContent = `**** has currently received ${today} unique website visits today. Yesterday there was ${yesterday} visits. Totaling ${thirtyDays} over the last thirty days.`;
      }
    });
  });
}

goFetch();
