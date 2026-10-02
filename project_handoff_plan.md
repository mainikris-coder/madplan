# Weekly Dinner Planner - Project Handoff

## 📌 Project Overview
This project is a mobile-first web application designed to help a family manage their weekly dinner plans. It tracks meals for each day of the week, calculates the total amount spent on groceries/ingredients per week, and provides a historical overview of spending using visual graphs. 

The final application must be a static frontend application capable of being hosted on **GitHub Pages**.

## ✨ Core Features
1. **Weekly Dinner Plan View:**
   * Display a list of dinner courses/meals for the week (Monday through Sunday).
   * Ability to view the meal name, ingredients, and cost for each day.
2. **Weekly Cost Tracking:**
   * Calculate and display the total amount spent on the dinner plan for the current week.
3. **History & Analytics Overview:**
   * A dedicated view showing past weeks' spending.
   * Visual graphs illustrating spending trends over time.
4. **Mobile-First Design:**
   * The UI must be optimized for mobile screens first, using responsive design principles to scale up gracefully to tablet and desktop.

## 🛠️ Technical Constraints & Stack
Since the application will be hosted on **GitHub Pages**, it must be a fully client-side (static) application. 
* **Frontend Framework:** React (via Vite) or Vanilla HTML/JS/CSS (Agent's choice, React recommended for state management).
* **Styling:** Tailwind CSS (recommended for rapid, mobile-first UI development).
* **Data Storage:** `localStorage` API. Because there is no backend, all user data (meals, weekly costs, history) must be stored in the browser's local storage to persist between sessions.
* **Charting Library:** Chart.js or Recharts (for the spending history graphs).
* **Hosting:** GitHub Pages (requires setting up a GitHub Action or `gh-pages` npm package for deployment).

## 🗄️ Suggested Data Model (JSON / LocalStorage)
```json
{
  "weeks": [
    {
      "id": "week-40-2026",
      "weekNumber": 40,
      "year": 2026,
      "totalSpent": 125.50,
      "meals": [
        { "day": "Monday", "course": "Spaghetti Bolognese", "cost": 15.00 },
        { "day": "Tuesday", "course": "Tacos", "cost": 22.50 },
        { "day": "Wednesday", "course": "Chicken Salad", "cost": 12.00 },
        { "day": "Thursday", "course": "Stir Fry", "cost": 18.00 },
        { "day": "Friday", "course": "Homemade Pizza", "cost": 20.00 },
        { "day": "Saturday", "course": "Steak and Potatoes", "cost": 30.00 },
        { "day": "Sunday", "course": "Leftovers", "cost": 8.00 }
      ]
    }
  ]
}
```

## 🚀 Implementation Phases for the Agent

### Phase 1: Setup & Scaffolding
* Initialize the project repository.
* Set up the build tool (e.g., Vite for React).
* Install dependencies (Tailwind CSS, Charting library).
* Establish the basic mobile-first layout shell (Navigation bar, Main content area).

### Phase 2: Core Data & Weekly View
* Implement a local storage utility to read/write the JSON data model.
* Create the "Current Week" view displaying Monday-Sunday slots.
* Add form inputs to allow users to add/edit a meal and its cost for a specific day.
* Create a component that aggregates the daily costs and displays the "Total Amount Spent" for the week.

### Phase 3: History & Graphs
* Create a "History" tab/page.
* Retrieve all historical week data from local storage.
* Implement a line or bar chart showing the `totalSpent` across different weeks.
* Add a simple list breakdown of past weeks below the graph.

### Phase 4: Polish & Deployment Prep
* Ensure all UI elements are touch-friendly (large buttons, readable text).
* Verify responsive behavior on standard mobile dimensions (e.g., iPhone size).
* Provide the build commands and GitHub Action script needed to deploy to GitHub Pages.

## 🤖 Instructions for the Implementing Agent
1. Read this README completely.
2. Generate the application following the single-file constraint if requested by the user, or standard multi-file structure if building a standard React app locally. (Note: Ensure you follow the user's specific output rules regarding file generation).
3. Prioritize a clean, accessible UI that looks like a native mobile app.
4. Mock some initial data in `localStorage` on the first load so the graphs have data to display immediately.