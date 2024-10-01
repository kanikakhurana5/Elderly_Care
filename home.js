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

    // Create a unique ID for the reminder
    const reminderId = Date.now();

    // Store the reminder in the reminders array
    reminders.push({ id: reminderId, date: reminderDate, type: reminderType, time: reminderTime, description: reminderDescription, completed: false });

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

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to send SMS');
        }
        
        alert('SMS sent successfully!'); // Success feedback
    } catch (error) {
        console.error('Error sending SMS:', error);
        alert('Failed to send SMS. Please check the phone number.');
    }

    // Update the calendar to highlight the added reminder date
    updateCalendar(reminderDate);
    renderReminderList(); // Display the new reminder below
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
        dayDiv.classList.add('calendar-day');

        // Format the date for checking reminders
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        if (hasEventOnDate(dateStr)) {
            dayDiv.classList.add('highlight-reminder');

            // Add click event to show details
            dayDiv.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent event bubbling
                showReminderDetails(dateStr);
            });
        }

        calendar.appendChild(dayDiv);
    }
}

// Function to render the list of reminders below the input


// Function to show reminder details for a specific date
function showReminderDetails(dateStr) {
    // Find reminders for the selected date
    const remindersForDate = reminders.filter(reminder => reminder.date === dateStr);

    // Create or update the details card
    let detailsCard = document.getElementById('details-card');
    
    if (!detailsCard) {
        detailsCard = document.createElement('div');
        detailsCard.id = 'details-card';
        detailsCard.classList.add('details-card');
        document.body.appendChild(detailsCard);

        // Close card when clicking outside
        document.addEventListener('click', (event) => {
            if (event.target !== detailsCard && !detailsCard.contains(event.target)) {
                detailsCard.style.display = 'none'; // Hide card
            }
        });
    }

    // Clear previous details
    detailsCard.innerHTML = '';

    if (remindersForDate.length > 0) {
        remindersForDate.forEach(reminder => {
            detailsCard.innerHTML += `
                <div class="reminder-details">
                    <strong>${reminder.type}</strong> <br />
                    Date: ${reminder.date} <br />
                    Time: ${reminder.time} <br />
                    Description: ${reminder.description} <br />
                </div>
                <hr />
            `;
        });
    } else {
        detailsCard.innerHTML = `<p>No reminders for this date.</p>`;
    }

    detailsCard.style.display = 'block'; // Show the card
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
// Function to toggle the completion status of a reminder
function toggleStatus(indicator, reminderId) {
    const reminder = reminders.find(r => r.id === reminderId);
    
    if (reminder) {
        // Toggle the completed status
        reminder.completed = !reminder.completed;

        // Update the UI based on completion status
        if (reminder.completed) {
            indicator.innerHTML = '✅'; // Mark as completed
            indicator.closest('.reminder-card').style.backgroundColor = '#d4edda'; // Change background color for completed tasks
            showCelebration(); // Show celebration for completion
        } else {
            indicator.innerHTML = '❌'; // Mark as not completed
            indicator.closest('.reminder-card').style.backgroundColor = ''; // Reset background color
        }
    }

    renderReminderList(); // Update the reminder list to reflect changes
}


// Function to show celebration pop-up
function showCelebration() {
    const celebrationDiv = document.createElement('div');
    celebrationDiv.className = 'celebration-popup';
    celebrationDiv.innerText = '🎉 Well done! Task completed! 🎉';
    document.body.appendChild(celebrationDiv);

    // Optional: Add some animation to the celebration message
    celebrationDiv.style.animation = 'fadeIn 1s, fadeOut 1s 2s'; // Example animation timing

    setTimeout(() => {
        celebrationDiv.remove(); // Remove celebration message after some time
    }, 4000); // Show for 4 seconds total
}
// Function to render the list of reminders below the input
function renderReminderList() {
    const reminderList = document.getElementById('reminder-list');
    reminderList.innerHTML = ''; // Clear the list before rendering

    reminders.forEach(reminder => {
        const reminderCard = document.createElement('div');
        reminderCard.classList.add('reminder-card');
        reminderCard.setAttribute('data-id', reminder.id); // Set the reminder ID as a data attribute

        reminderCard.innerHTML = `
            <span class="status-indicator" onclick="toggleStatus(this, ${reminder.id})">❌</span>
            <span>${reminder.type} on ${reminder.date} at ${reminder.time}: ${reminder.description}</span>
            <button onclick="deleteReminder(${reminder.id})">Delete</button>
        `;

        reminderList.appendChild(reminderCard);
    });
}

// Function to delete a reminder
function deleteReminder(reminderId) {
    reminders = reminders.filter(reminder => reminder.id !== reminderId);
    renderReminderList(); // Re-render the reminder list after deletion
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

    renderReminderList(); // Re-render the reminder list after deletion
}
