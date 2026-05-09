document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("modal");
  const movieTitle = document.getElementById("movieTitle");
  const ticketCounter = document.getElementById("tickets");
  const confirmBtn = document.getElementById("confirmBtn");

  let totalTickets = 245;
  let selectedMovie = "";

  // OPEN MODAL
  const sellButtons = document.querySelectorAll(".sell-btn");

  sellButtons.forEach((button) => {

    button.addEventListener("click", () => {

      selectedMovie = button.getAttribute("data-movie");

      movieTitle.innerText = `Sell Ticket - ${selectedMovie}`;

      modal.style.display = "flex";

    });

  });

  // CLOSE MODAL
  window.addEventListener("click", (e) => {

    if (e.target === modal) {

      modal.style.display = "none";

    }

  });

  // CONFIRM TICKET
  confirmBtn.addEventListener("click", () => {

    const customerName = document.getElementById("customerName").value;

    const seatNumber = document.getElementById("seatNumber").value;

    if (customerName.trim() === "" || seatNumber.trim() === "") {

      alert("Please fill all fields");

      return;

    }

    totalTickets++;

    ticketCounter.innerText = totalTickets;

    alert(
      `Ticket Sold!\n\nMovie: ${selectedMovie}\nCustomer: ${customerName}\nSeat: ${seatNumber}`
    );

    // RESET FIELDS
    document.getElementById("customerName").value = "";
    document.getElementById("seatNumber").value = "";

    modal.style.display = "none";

  });

});

