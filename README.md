# Citizen Complaints and Engagement System

## Summary
This project implements a full workflow for handling citizen complaints to government agencies:

- **Registration:** Citizens and agencies register separately. Agencies specify their service categories during registration.
- **Login:** Both user types log in with their credentials. The backend determines the user type and returns the appropriate dashboard.
- **Complaint Submission:** Citizens can submit complaints by selecting an agency and a category (categories are dynamically loaded based on the selected agency). Each complaint is linked to the submitting citizen, the chosen agency, and the selected category.
- **Complaint Tracking:** Citizens can view all their submitted complaints, see their current status (pending, reviewed, resolved), and read any responses from agencies.
- **Agency Review:** Agencies see only the complaints assigned to them. They can filter complaints by category or status, review details, write a response, and update the complaint status.
- **Notifications:** When a citizen submits a complaint, the relevant agency is notified (email logic can be extended). When an agency responds, the citizen receives a notification (email logic can be extended).

All data flows through a REST API (Spring Boot backend), and the frontend (React) dynamically fetches and displays data based on the logged-in user type and their actions. The system is designed for easy testing and demonstration of the full complaint lifecycle.

## Overview
This system allows citizens to submit complaints to government agencies and track their status. It includes features for user registration, complaint submission, and complaint tracking.

## Tech Stack
- **Frontend**: React with TypeScript, Material-UI, and Axios for API calls.
- **Backend**: Spring Boot (Java) with JPA/Hibernate for database interactions.
- **Database**: PostgreSQL (or your configured database).

## Setup Instructions

### Prerequisites
- Node.js and npm (for frontend)
- Java 17 or higher (for backend)
- Maven (for backend)
- PostgreSQL (or your configured database)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build the project:
   ```bash
   ./mvnw clean install
   ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8085`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`.

## Testing the System

### User Registration
1. Open `http://localhost:3000/register` in your browser.
2. Fill in the registration form with a valid email, password, and user type (e.g., "CITIZEN").
3. Submit the form. You should be redirected to the login page if successful.

### User Login
1. Open `http://localhost:3000/login` in your browser.
2. Enter your registered email and password.
3. Submit the form. You should be redirected to the dashboard if successful.

### Submitting a Complaint
1. Log in as a citizen.
2. Navigate to the "New Complaint" page.
3. Fill in the complaint details:
   - Title
   - Description
   - Select an agency (e.g., "Transport Agency")
   - Select a category (if available)
4. Submit the complaint. You should see a success message.

### Tracking a Complaint
1. Log in as a citizen.
2. Navigate to the "My Complaints" page.
3. You should see a list of your submitted complaints with their statuses.

### Agency Registration (Optional)
1. Open `http://localhost:3000/register` in your browser.
2. Fill in the registration form with a valid email, password, and user type "AGENCY".
3. Submit the form. You should be redirected to the login page if successful.

## Key Features
- **User Registration and Login**: Secure authentication for citizens and agencies.
- **Complaint Submission**: Citizens can submit complaints to specific agencies.
- **Complaint Tracking**: Citizens can track the status of their complaints.
- **Agency Management**: Agencies can view and manage complaints assigned to them.

## Troubleshooting
- If the backend fails to start, check the console for errors and ensure the database is running.
- If the frontend fails to start, ensure all dependencies are installed and there are no port conflicts.
- If complaints are not being fetched, check the backend logs for any errors.

## Contact
For any issues or questions, please contact the development team. 