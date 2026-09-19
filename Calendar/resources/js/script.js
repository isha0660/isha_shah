function updateLocationOptions() {
    const modality = document.getElementById("event_modality").value;

    const locationContainer = document.getElementById("location_container");
    const remoteUrlContainer = document.getElementById("remote_url_container");

    const locationInput = document.getElementById("event_location");
    const remoteUrlInput = document.getElementById("event_remote_url");

    if (modality === "in-person") {
        locationContainer.style.display = "block";
        remoteUrlContainer.style.display = "none";

        locationInput.required = true;
        remoteUrlInput.required = false;
    } else {
        locationContainer.style.display = "none";
        remoteUrlContainer.style.display = "block";

        locationInput.required = false;
        remoteUrlInput.required = true;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateLocationOptions();
});

const events = [];

let editingEvent = null;

function saveEvent() {
    const form = document.getElementById("event_form");

    if (!form.checkValidity()) {
        const fields = form.querySelectorAll("input, select");

        fields.forEach(function (field) {
            if (!field.checkValidity()) {
                field.classList.add("is-invalid");
            } else {
                field.classList.remove("is-invalid");
            }
        });

        return;
    }

    const modality = document.getElementById("event_modality").value;

    let location = null;
    let remote_url = null;

    if (modality === "in-person") {
        location = document.getElementById("event_location").value;
    } else {
        remote_url = document.getElementById("event_remote_url").value;
    }

    if (editingEvent !== null) {
        editingEvent.name = document.getElementById("event_name").value;
        editingEvent.weekday = document.getElementById("event_weekday").value;
        editingEvent.time = document.getElementById("event_time").value;
        editingEvent.modality = modality;
        editingEvent.location = location;
        editingEvent.remote_url = remote_url;
        editingEvent.category = document.getElementById("event_category").value;
        editingEvent.attendees = document.getElementById("event_attendees").value;

        editingEvent.element.remove();
        
        addEventToCalendarUI(editingEvent);
        
        editingEvent = null;

    } else {
        const eventDetails = {
            name: document.getElementById("event_name").value,
            weekday: document.getElementById("event_weekday").value,
            time: document.getElementById("event_time").value,
            modality: modality,
            location: location,
            remote_url: remote_url,
            category: document.getElementById("event_category").value,
            attendees: document.getElementById("event_attendees").value,
            element: null
        };

        events.push(eventDetails);

        addEventToCalendarUI(eventDetails);
    }

    console.log(events);

    form.reset();
    updateLocationOptions();

    document.getElementById("eventModalLabel").textContent = "Create Event";

    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.hide();
}

function editEvent(eventDetails) {
    editingEvent = eventDetails;

    document.getElementById("eventModalLabel").textContent = "Edit Event";

    document.getElementById("event_name").value = eventDetails.name;
    document.getElementById("event_weekday").value = eventDetails.weekday;
    document.getElementById("event_time").value = eventDetails.time;
    document.getElementById("event_modality").value = eventDetails.modality;
    document.getElementById("event_location").value = eventDetails.location || "";
    document.getElementById("event_remote_url").value = eventDetails.remote_url || "";
    document.getElementById("event_category").value = eventDetails.category;
    document.getElementById("event_attendees").value = eventDetails.attendees;

    updateLocationOptions();

    const fields = document.querySelectorAll("#event_form input, #event_form select");

    fields.forEach(function (field) {
        field.classList.remove("is-invalid");
    });

    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

function createEventCard(eventDetails) {
    const eventElement = document.createElement("div");
    eventElement.className = "event row border rounded m-1 py-1";

    if (eventDetails.category === "Social") {
        eventElement.classList.add("category-social");

    } else if (eventDetails.category === "Work") {
        eventElement.classList.add("category-work");

    } else if (eventDetails.category === "Personal") {
        eventElement.classList.add("category-personal");

    } else if (eventDetails.category === "Academic") {
        eventElement.classList.add("category-academic");
    }

    const eventContent = document.createElement("div");

    eventContent.innerHTML = `
        <strong>${eventDetails.name}</strong>
        <div>Time: ${eventDetails.time}</div>
        <div>Modality: ${eventDetails.modality}</div>
    `;

    if (eventDetails.modality === "in-person") {
        eventContent.innerHTML += `
            <div>Location: ${eventDetails.location}</div>
        `;
        
    } else {
        eventContent.innerHTML += `
            <div>
                Remote URL:
                <a href="${eventDetails.remote_url}" target="_blank">
                    ${eventDetails.remote_url}
                </a>
            </div>
        `;
    }

    eventContent.innerHTML += `
        <div>Category: ${eventDetails.category}</div>
        <div>Attendees: ${eventDetails.attendees}</div>
    `;

    eventElement.appendChild(eventContent);

    eventElement.addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
            return;
        }

        editEvent(eventDetails);
    });

    return eventElement;
}

function addEventToCalendarUI(eventInfo) {
    const eventElement = createEventCard(eventInfo);

    eventInfo.element = eventElement;

    let weekdayId;

    if (eventInfo.weekday === "Sunday") {
        weekdayId = "sunday";

    } else if (eventInfo.weekday === "Monday") {
        weekdayId = "monday";

    } else if (eventInfo.weekday === "Tuesday") {
        weekdayId = "tuesday";

    } else if (eventInfo.weekday === "Wednesday") {
        weekdayId = "wednesday";

    } else if (eventInfo.weekday === "Thursday") {
        weekdayId = "thursday";

    } else if (eventInfo.weekday === "Friday") {
        weekdayId = "friday";

    } else if (eventInfo.weekday === "Saturday") {
        weekdayId = "saturday";
    }

    const calendarColumn = document.getElementById(weekdayId);

    calendarColumn.appendChild(eventElement);
}