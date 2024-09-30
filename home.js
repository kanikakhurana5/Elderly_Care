// Handle the reminder form submission
document.getElementById('reminder-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const reminderType = document.getElementById('reminder-type').value;
    const reminderTime = document.getElementById('reminder-time').value;
    const reminderDescription = document.getElementById('reminder-description').value;
    const voiceAlertEnabled = document.getElementById('voice-alert').checked;

    // Create a new reminder card
    const reminderList = document.querySelector('.reminder-list');
    const newReminderCard = document.createElement('div');
    newReminderCard.classList.add('reminder-card');
    
    const reminderId = Date.now(); // Unique ID for the reminder
    
    newReminderCard.innerHTML = `
        <input type="checkbox" class="reminder-checkbox" data-id="${reminderId}" />
        <h3>${reminderType.charAt(0).toUpperCase() + reminderType.slice(1)} Reminder</h3>
        <p>${reminderDescription} at ${reminderTime}</p>
        <span class="status-indicator" onclick="toggleStatus(this)">❌</span>
        <button class="edit-button" onclick="editReminder(${reminderId})">Edit</button>
        <button class="delete-button" onclick="deleteReminder(this)">Delete</button>
    `;
    
    reminderList.appendChild(newReminderCard);

    // Play a voice alert if enabled
    if (voiceAlertEnabled) {
        // Implementation for voice alert can go here (e.g., play a sound)
    }

    // Clear the form fields
    this.reset();
});

// Function to toggle the reminder completion status
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
    celebrationDiv.innerText = '🎉 Well done! Reminder completed! 🎉';
    document.body.appendChild(celebrationDiv);

    setTimeout(() => {
        celebrationDiv.remove();
    }, 3000); // Show for 3 seconds
}

// Function to edit a reminder
function editReminder(reminderId) {
    const reminderCard = Array.from(document.querySelectorAll('.reminder-card')).find(card => {
        return card.querySelector('.reminder-checkbox').dataset.id == reminderId;
    });
    
    const reminderType = prompt("Edit Reminder Type:", reminderCard.querySelector('h3').innerText);
    const reminderDescription = prompt("Edit Reminder Description:", reminderCard.querySelector('p').innerText);
    const reminderTime = prompt("Edit Reminder Time:", reminderCard.querySelector('p').innerText.split(' at ')[1]);
    
    if (reminderType && reminderDescription && reminderTime) {
        reminderCard.querySelector('h3').innerText = reminderType.charAt(0).toUpperCase() + reminderType.slice(1) + " Reminder";
        reminderCard.querySelector('p').innerText = reminderDescription + " at " + reminderTime;
    }
}

// Function to delete selected reminders
function deleteReminder(button) {
    const reminderCard = button.closest('.reminder-card');
    reminderCard.remove();
}

// Function to mark incomplete reminders
function markIncomplete(reminderCard) {
    reminderCard.style.backgroundColor = '#ffcccc'; // Light red color for incomplete reminders
}

// Optional: Function to handle bulk delete/edit for checkboxes
function bulkDelete() {
    const checkboxes = document.querySelectorAll('.reminder-checkbox:checked');
    checkboxes.forEach(checkbox => {
        const reminderCard = checkbox.closest('.reminder-card');
        reminderCard.remove();
    });
}

// Add a button for bulk delete in your HTML wherever necessary
