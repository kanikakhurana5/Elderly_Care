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

// Store reminders in an array
let reminders = [];

// Handle the reminder form submission
// Handle the reminder form submission
document.getElementById('reminder-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const reminderType = document.getElementById('reminder-type').value;
    const reminderDate = document.getElementById('reminder-date').value; 
    const reminderTime = document.getElementById('reminder-time').value;
    const reminderDescription = document.getElementById('reminder-description').value;
    const smsToNumber = document.getElementById('sms-to').value; // Get phone number from input

    // Input validation
    if (!smsToNumber || !reminderType || !reminderDate || !reminderTime || !reminderDescription) {
        alert('Please fill out all fields.');
        return; // Exit if validation fails
    }

    // Create a new reminder card
    const reminderList = document.querySelector('.reminder-list');
    const reminderId = Date.now(); // Unique ID for the reminder

    const newReminderCard = document.createElement('div');
    newReminderCard.classList.add('reminder-card');
    newReminderCard.innerHTML = `
        <span class="status-indicator" onclick="toggleStatus(this)">❌</span>
        <input type="checkbox" class="reminder-checkbox" data-id="${reminderId}" />
        <span>${reminderType} on ${reminderDate} at ${reminderTime}: ${reminderDescription}</span>
        <button onclick="deleteReminder(this)">Delete</button>
    `;

    reminderList.appendChild(newReminderCard);
    reminders.push({ id: reminderId, date: reminderDate }); // Store reminder

    // Send SMS notification
    try {
        const response = await fetch('/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: smsToNumber,
                message: `Reminder: ${reminderType} on ${reminderDate} at ${reminderTime}: ${reminderDescription}`,
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to send SMS');
        
        alert('SMS sent successfully!'); // Success feedback
    } catch (error) {
        console.error('Error sending SMS:', error);
        alert('Failed to send SMS. Please check the phone number.');
    }

    updateCalendar(reminderDate);
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

        // Format the date for checking reminders
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        if (hasEventOnDate(dateStr)) {
            dayDiv.classList.add('highlight-reminder');
        }

        calendar.appendChild(dayDiv);
    }
}

// Function to check if there are reminders on a specific date
function hasEventOnDate(dateStr) {
    return reminders.some(event => event.date === dateStr);
}

// Function to update the calendar
function updateCalendar(dateStr) {
    renderCalendar(); // Re-render the calendar to show updated reminders
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
    reminders = reminders.filter(event => event.id !== Number(reminderId));

    reminderCard.remove();
    renderCalendar(); // Re-render the calendar after deletion
}

// Function to delete selected reminders
function bulkDelete() {
    const selectedCheckboxes = document.querySelectorAll('.reminder-checkbox:checked');
    selectedCheckboxes.forEach(checkbox => {
        const reminderCard = checkbox.closest('.reminder-card');
        const reminderId = checkbox.dataset.id;

        // Remove the reminder from the reminders array
        reminders = reminders.filter(event => event.id !== Number(reminderId));

        // Remove the reminder card from the DOM
        reminderCard.remove();
    });

    renderCalendar(); // Re-render the calendar after deletion
}

// Initial render of the calendar
renderCalendar();
