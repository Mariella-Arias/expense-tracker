# Expense Tracker

A lightweight vanilla Javascript application for tracking personal expenses.

## Project Description

The Expense Tracker App is a client-side Javascript application implementing Object-Oriented Programming (OOP) principles and following an MVC architecture to promote modularity and scalability.

The application allows users to manage their expenses through CRUD operations, with all data persisted in the browser's Local Storage. Key features include managing expense records, categorizing them, and providing a date-based filtering system. Expenses are stored locally, and the app dynamically updates the UI based on user interactions.

## Features

- Track expenses with date, category, and amount
- Filter by date and/or category 
- Data persistence using Local Storage
- Responsive design for all devices

## Getting Started

### Dependencies

Before installing and running the Expense Tracker App, ensure that you have the following installed:

- Node.js (v21.6.1 or higher). You can download and install Node.js from the official website: [Node.js](https://nodejs.org)
- npm (automatically installed with Node.js)

### Installing and Executing Program

Follow these steps to get the Expense Tracker app up and running locally:

#### 1. Clone the repository:
First, clone the project repository to your local machine. You can do this using the following command in your terminal:

```
git clone <repository_url>
```

#### 2. Install dependencies:
Navigate into the project directory and install the required dependencies by running:

```
npm install
```

#### 3. Run the app:
To start the app, run the following command:

```
npm start
```

This will launch a local development server and open the app in your default web browser.

#### Running Tests:
To run the tests for the app, use the following command:

```
npm test
```

## Technical Implementation

The project is designed around three core components:

### Model (ExpensesModel.js): Handles data management and storage operations

- Implements CRUD operations for expense records
- Manages Local Storage interactions
- Handles date-based filtering and data manipulation
- Test coverage for data operations and storage interactions

### View (ExpensesView.js): Manages the UI layer

- Handles DOM manipulation and event binding
- Implements form validation using native browser capabilities
- Provides dynamic UI updates based on state changes
- Test coverage for DOM updates and event handling

### Controller (ExpensesController.js): Coordinates application logic

- Routes user actions to appropriate handlers
- Manages data flow between Model and View
- Implements business logic and state management
- Test coverage for business logic and component integration

## Technical Decisions

- Vanilla JavaScript: Chosen over frameworks to minimize bundle size and initial load time
- Local Storage: Provides client-side data persistence without backend dependencies
- MVC Pattern: Enables clear separation of concerns and maintainable code structure
- OOP Principles: Ensures strong encapsulation and scalable code organization
- Mocha & Chai: Provides robust testing capabilities with expressive assertion syntax

## Testing Architecture

- Framework: Mocha testing framework for structured test organization
- Assertions: Chai library for readable, expressive assertions
- Coverage: Unit tests for each MVC component ensuring:
  - Data manipulation accuracy
  - UI rendering consistency
  - Controller logic reliability
  - Component integration

## Data Architecture

The application uses a simple yet effective data schema stored in Local Storage. The expenses data is stored as an array of objects, with each object containing date, category, and amount.

```
{
  "expenses": [{
    "date": "2024-12-17",
    "category": "payments",
    "amount": 1
    }
    ]
}
```
