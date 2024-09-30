const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

document.getElementById('prevMonth').addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    renderCalendar();
});

// Store events in an object for tracking
const events = {
    reminder: [],
    medication: [],
    appointment: []
};

// Handle the reminder form submission
document.getElementById('reminder-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const reminderType = document.getElementById('reminder-type').value;
    const reminderTime = document.getElementById('reminder-time').value;
    const reminderDescription = document.getElementById('reminder-description').value;

    // Create a new reminder card
    const reminderList = document.querySelector('.reminder-list');
    const newReminderCard = document.createElement('div');
    newReminderCard.classList.add('reminder-card');

    const reminderId = Date.now(); // Unique ID for the reminder
    const reminderDate = `${currentYear}-${currentMonth + 1}-${new Date().getDate()}`;

    newReminderCard.innerHTML = `
        <span class="status-indicator" onclick="toggleStatus(this)">❌</span>
        <input type="checkbox" class="reminder-checkbox" data-id="${reminderId}" />
        <span>${reminderType} at ${reminderTime}: ${reminderDescription}</span>
        <button onclick="deleteReminder(this)">Delete</button>
    `;

    reminderList.appendChild(newReminderCard);
    events.reminder.push({ id: reminderId, date: reminderDate }); // Add to events
    updateCalendar("reminder", reminderDate);
    this.reset(); // Reset the form
});

// Handle the medication form submission

// Handle the medication form submission
document.getElementById('medication-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const medicationName = document.getElementById('medication-name').value;
    const medicationDate = document.getElementById('medication-date').value;
    const medicationTime = document.getElementById('medication-time').value;

    // Create a new medication card
    const medicationList = document.querySelector('.medication-list');
    const newMedicationCard = document.createElement('div');
    newMedicationCard.classList.add('medication-card');

    const medicationId = Date.now(); // Unique ID for the medication

    newMedicationCard.innerHTML = `
        <span class="status-indicator" onclick="toggleMedicationStatus(this)">❌</span>
        <input type="checkbox" class="medication-checkbox" data-id="${medicationId}" />
        <span>${medicationName} on ${medicationDate} at ${medicationTime}</span>
        <button onclick="deleteMedication(this)">Delete</button>
    `;

    medicationList.appendChild(newMedicationCard);
    updateCalendar("medication", medicationDate); // Make sure this is updating correctly
    this.reset(); // Reset the form
});

// Handle the appointment form submission
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const appointmentDescription = document.getElementById('appointment-description').value;
    const appointmentDate = document.getElementById('appointment-date').value;

    // Create a new appointment card
    const appointmentList = document.querySelector('.appointment-list');
    const newAppointmentCard = document.createElement('div');
    newAppointmentCard.classList.add('appointment-card');

    const appointmentId = Date.now(); // Unique ID for the appointment

    newAppointmentCard.innerHTML = `
        <span class="status-indicator" onclick="toggleAppointmentStatus(this)">❌</span>
        <input type="checkbox" class="appointment-checkbox" data-id="${appointmentId}" />
        <span>${appointmentDescription} on ${appointmentDate}</span>
        <button onclick="deleteAppointment(this)">Delete</button>
    `;

    appointmentList.appendChild(newAppointmentCard);
    updateCalendar("appointment", appointmentDate); // Make sure this is updating correctly
    this.reset(); // Reset the form
});


// Function to render the calendar
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calendar-month-year').textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create empty divs for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendar.appendChild(emptyDiv);
    }

    // Create divs for each day of the month
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('calendar-day'); // Add a class for styling

        // Check for reminders, medications, or appointments for this day
        const dateStr = `${currentYear}-${currentMonth + 1}-${day}`;
        if (hasEventOnDate("reminder", dateStr)) {
            dayDiv.classList.add('highlight-reminder');
        }
        if (hasEventOnDate("medication", dateStr)) {
            dayDiv.classList.add('highlight-medication');
        }
        if (hasEventOnDate("appointment", dateStr)) {
            dayDiv.classList.add('highlight-appointment');
        }

        calendar.appendChild(dayDiv);
    }
}

// Function to check if there are events on a specific date
function hasEventOnDate(type, dateStr) {
    return events[type].some(event => event.date === dateStr);
}

// Function to update the calendar based on reminders, medications, and appointments
function updateCalendar(type, timeOrDate) {
    const date = new Date(timeOrDate);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    // Check if it's a valid date
    if (isNaN(date)) return;

    // Re-render the calendar to show updated events
    renderCalendar(); 
}


// Function to toggle the completion status of a reminder
function toggleStatus(indicator) {
    const reminderCard = indicator.closest('.reminder-card');

    if (indicator.classList.contains('completed')) {
        indicator.classList.remove('completed');
        indicator.innerHTML = '❌'; // Mark as not completed
        reminderCard.style.backgroundColor = ''; // Reset background color
    } else {
        indicator.classList.add('completed');
        indicator.innerHTML = '✅'; // Mark as completed
        reminderCard.style.backgroundColor = ''; // Reset background color
        showCelebration(); // Show celebration for completion
    }
}

// Function to toggle the completion status of a medication
function toggleMedicationStatus(indicator) {
    const medicationCard = indicator.closest('.medication-card');

    if (indicator.classList.contains('completed')) {
        indicator.classList.remove('completed');
        indicator.innerHTML = '❌'; // Mark as not completed
        medicationCard.style.backgroundColor = ''; // Reset background color
    } else {
        indicator.classList.add('completed');
        indicator.innerHTML = '✅'; // Mark as completed
        medicationCard.style.backgroundColor = ''; // Reset background color
        showCelebration(); // Show celebration for completion
    }
}

// Function to toggle the completion status of an appointment
function toggleAppointmentStatus(indicator) {
    const appointmentCard = indicator.closest('.appointment-card');

    if (indicator.classList.contains('completed')) {
        indicator.classList.remove('completed');
        indicator.innerHTML = '❌'; // Mark as not completed
        appointmentCard.style.backgroundColor = ''; // Reset background color
    } else {
        indicator.classList.add('completed');
        indicator.innerHTML = '✅'; // Mark as completed
        appointmentCard.style.backgroundColor = ''; // Reset background color
        showCelebration(); // Show celebration for completion
    }
}

// Function to show celebration pop-up
function showCelebration() {
    const celebrationDiv = document.createElement('div');
    celebrationDiv.className = 'celebration-popup';
    celebrationDiv.innerText = '🎉 Well done! Task completed! 🎉';
    document.body.appendChild(celebrationDiv);

    setTimeout(() => {
        celebrationDiv.remove();
    }, 3000); // Show for 3 seconds
}

// Function to delete a reminder
function deleteReminder(button) {
    const reminderCard = button.closest('.reminder-card');
    const reminderId = reminderCard.querySelector('input').dataset.id;

    // Remove the reminder from events
    events.reminder = events.reminder.filter(event => event.id !== Number(reminderId));
    
    reminderCard.remove();
    renderCalendar(); // Re-render the calendar after deletion
}

// Function to delete a medication
function deleteMedication(button) {
    const medicationCard = button.closest('.medication-card');
    const medicationId = medicationCard.querySelector('input').dataset.id;

    // Remove the medication from events
    events.medication = events.medication.filter(event => event.id !== Number(medicationId));
    
    medicationCard.remove();
    renderCalendar(); // Re-render the calendar after deletion
}

// Function to delete an appointment
function deleteAppointment(button) {
    const appointmentCard = button.closest('.appointment-card');
    const appointmentId = appointmentCard.querySelector('input').dataset.id;

    // Remove the appointment from events
    events.appointment = events.appointment.filter(event => event.id !== Number(appointmentId));
    
    appointmentCard.remove();
    renderCalendar(); // Re-render the calendar after deletion
}

// Initial render of the calendar
renderCalendar();
