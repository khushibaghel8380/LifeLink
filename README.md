# LifeLink

LifeLink is a simple second-year student mini project for blood donation and organ donation management.

This version uses only basic web technologies:

- HTML
- CSS
- JavaScript
- Browser localStorage

No PHP, Firebase, Cloud Functions, or advanced backend setup is required.

## Features

- Blood donor registration
- Blood request creation
- Donor, requester, and hospital role sections
- Registration and login for Donor, Requester, and Hospital / Doctor
- Hospital doctor dashboard
- Appointment declaration by hospital doctor
- Automatic matching by blood group and city
- Organ donation pledge form
- Organ request form
- Search donors by city or blood group
- Emergency SOS demo button
- Health tips popup
- Sample data button
- Data saved in browser localStorage
- Responsive design for mobile and desktop

## How to Run

Open `index.html` in any browser.

## Registration and Login

First register as a Donor, Requester, or Hospital / Doctor. After registration,
login with the same role, name, and password. Unregistered users cannot login.

- Donor dashboard: submit blood donation or organ donation form
- Requester dashboard: submit blood request or organ request
- Hospital / Doctor dashboard: view donors and requests, then declare appointments

## Project Files

- `index.html` - main page structure
- `style.css` - page design
- `script.js` - form handling, matching logic, and localStorage
- `README.md` - project information

## Why This Is Student Friendly

The original idea was very large and used Flutter, Firebase, AI APIs, Google Maps, and Cloud Functions.
This simplified version keeps the main concept but makes it easier to understand, explain, and submit as a second-year project.

## Future Scope

- Add real login system
- Add backend database
- Add hospital dashboard
- Add SMS or email alerts
- Add map location support
- Convert to Flutter mobile app
