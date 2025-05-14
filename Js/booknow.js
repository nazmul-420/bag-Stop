document.addEventListener("DOMContentLoaded", function () {
    // Initialize with default dates from the image
    // const defaultDropoff = new Date().getDate().Date;
    // const defaultPickup = new Date().getDate().Date + 1;
    const newdate = new Date();
    const defaultDropoff = formatDate(new Date(newdate)); // today
    const defaultPickup = new Date(newdate);

    // Step 2: Modify defaultPickup as a Date object
    defaultPickup.setDate(defaultPickup.getDate() + 1);
    const defaultPickupDate = formatDate(defaultPickup);
    // const defaultDropoffTime = "07:00";
    // const defaultPickupTime = "07:30";
    let bagsCount = 1;

    // Set default dates
    document.getElementById("dropoff-date").value = defaultDropoff;
    document.getElementById("pickup-date").value = defaultPickupDate;

    // Set min date to today
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    document.getElementById("dropoff-date").min = todayStr;
    document.getElementById("pickup-date").min = todayStr;

    // Generate time options (8am to 8pm in 30 minute increments)
    const timeSelects = [
        document.getElementById("dropoff-time"),
        document.getElementById("pickup-time"),
    ];

    timeSelects.forEach((select) => {
        for (let hour = 7; hour <= 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeStr = `${hour.toString().padStart(2, "0")}:${minute
                    .toString()
                    .padStart(2, "0")}`;
                const option = document.createElement("option");
                option.value = timeStr;
                option.textContent = timeStr;
                select.appendChild(option);
            }
        }
    });

    // Set default times
    // document.getElementById("dropoff-time").value = defaultDropoffTime;
    // document.getElementById("pickup-time").value = defaultPickupTime;

    // Update summary display
    updateSummaryDisplay();

    // Bag counter functionality - FIXED TO UPDATE TOTAL PROPERLY
    document
        .getElementById("increment-bag")
        .addEventListener("click", function () {
            bagsCount++;
            document.getElementById("bag-count").textContent = bagsCount;
            updateTotal(); // Now properly updates the total
            updateCounterButtons();
        });

    document
        .getElementById("decrement-bag")
        .addEventListener("click", function () {
            if (bagsCount > 1) {
                bagsCount--;
                document.getElementById("bag-count").textContent = bagsCount;
                updateTotal(); // Now properly updates the total
                updateCounterButtons();
            }
        });

    function updateCounterButtons() {
        document.getElementById("decrement-bag").disabled = bagsCount <= 1;
    }

    // Edit button handlers
    // document
    //   .getElementById("edit-dropoff")
    //   .addEventListener("click", function () {
    //     document.getElementById("booking-summary").style.display = "none";
    //     document.getElementById("dropoff-selector").style.display = "block";
    //   });

    // document
    //   .getElementById("edit-pickup")
    //   .addEventListener("click", function () {
    //     document.getElementById("booking-summary").style.display = "none";
    //     document.getElementById("pickup-selector").style.display = "block";
    //   });

    // Save button handlers
    // document
    //   .getElementById("save-dropoff")
    //   .addEventListener("click", function () {
    //     if (validateDateTime("dropoff")) {
    //       document.getElementById("booking-summary").style.display =
    //         "block";
    //       document.getElementById("dropoff-selector").style.display =
    //         "none";
    //       updateSummaryDisplay();
    //     }
    //   });

    // document
    //   .getElementById("save-pickup")
    //   .addEventListener("click", function () {
    //     if (validateDateTime("pickup")) {
    //       document.getElementById("booking-summary").style.display =
    //         "block";
    //       document.getElementById("pickup-selector").style.display = "none";
    //       updateSummaryDisplay();
    //     }
    //   });

    // Set up event listeners for changes
    document
        .getElementById("dropoff-date")
        .addEventListener("change", updateSummaryDisplay);
    document
        .getElementById("dropoff-time")
        .addEventListener("change", updateSummaryDisplay);
    document
        .getElementById("pickup-date")
        .addEventListener("change", updateSummaryDisplay);
    document
        .getElementById("pickup-time")
        .addEventListener("change", updateSummaryDisplay);
    document
        .getElementById("insurance")
        .addEventListener("change", updateTotal);
    document
        .getElementById("flexible")
        .addEventListener("change", updateTotal);

    // Book button click handler
    document
        .getElementById("book-btn")
        .addEventListener("click", function () {
            if (validateBooking()) {
                alert(
                    `Booking confirmed for ${bagsCount} bag(s)! Total: ${document.getElementById("total-amount").textContent
                    }. Thank you for choosing Kings Cross Luggage.`
                );
            }
        });

    // Initialize counter buttons
    updateCounterButtons();
});

// function formatDate(dateStr) {
//   const [year, month, day] = dateStr.split("-");
//   return `${day}-${month}-${year}`;
// }

const formatDate = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date); // Try to convert if it's a string
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

function calculateDays() {
    const dropoffDate = document.getElementById("dropoff-date").value;
    const dropoffTime = document.getElementById("dropoff-time").value;
    const pickupDate = document.getElementById("pickup-date").value;
    const pickupTime = document.getElementById("pickup-time").value;

    if (!dropoffDate || !dropoffTime || !pickupDate || !pickupTime)
        return 0;

    const dropoff = new Date(`${dropoffDate}T${dropoffTime}`);
    const pickup = new Date(`${pickupDate}T${pickupTime}`);

    // Ensure pickup is after dropoff
    if (pickup <= dropoff) return 0;

    const diffMs = pickup - dropoff;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);

    return diffDays;
}

function updateSummaryDisplay() {
    const dropoffDate = document.getElementById("dropoff-date").value;
    const dropoffTime = document.getElementById("dropoff-time").value;
    const pickupDate = document.getElementById("pickup-date").value;
    const pickupTime = document.getElementById("pickup-time").value;

    // Update summary display
    document.getElementById("dropoff-date").textContent = `${formatDate(
        dropoffDate
    )} ${dropoffTime}`;
    document.getElementById("dropoff-date").textContent = `${formatDate(
        pickupDate
    )} ${pickupTime}`;

    const days = calculateDays();
    document.getElementById("summary-days").textContent = days;

    updateTotal();
}

function updateTotal() {
    let perAmount = 4;
    let basePrice = 0;
    const days = calculateDays();
    const insuranceChecked = true; //document.getElementById('insurance').checked ;

    const flexibleChecked = document.getElementById("flexible").checked;
    const bagsCount = parseInt(
        document.getElementById("bag-count").textContent
    );

    // Base rate is £4 per day
    //  if(days>1){
    //     perAmount = 4;
    // }
    // // Base rate is £5 per day
    // if(days>1){
    //      basePrice = (days * perAmount) + 1;
    // }
    // else{
    //     basePrice = (days * perAmount)
    // }
    basePrice = days * perAmount;

    // Insurance is £1 per item (max £5)
    let insurancePrice = 0;
    if (insuranceChecked) {
        insurancePrice = Math.min(bagsCount * 1, 5); // £1 per bag, max £5
    }

    // Flexible pickup is £1
    const flexiblePrice = flexibleChecked ? 1 : 0;

    // Update insurance price display
    document.getElementById("insurance-price").textContent = insurancePrice
        ? `+£${insurancePrice}`
        : "+£0";

    // Calculate total - NOW PROPERLY INCLUDES BAG COUNT IN CALCULATION
    let total = 0;
    if (days > 0) {
        total = basePrice * bagsCount + insurancePrice + flexiblePrice;
    }

    // Update total display
    document.getElementById("total-amount").textContent = `£${total}`;
}

function validateDateTime(type) {
    const date = document.getElementById(`${type}-date`).value;
    const time = document.getElementById(`${type}-time`).value;

    if (!date || !time) {
        alert(`Please select both ${type} date and time.`);
        return false;
    }

    return true;
}

function validateBooking() {
    const days = calculateDays();
    if (days <= 0) {
        alert("Pickup time must be after dropoff time.");
        return false;
    }

    return true;
}
