# SkyReady - One Tap to Take Off ✈️
**SkyReady** is a user-friendly flight booking web application built using *Ruby on Rails*. It enables users to search, view, and book flights with seat availability and dynamic fare calculations based on occupancy and travel dates.


## 📚 Table of Contents

- [Features](#📋-features)
- [Technologies Used](#🛠️-technologies-used)
- [Requirements](#🗒️-requirements)
- [Installation](#📥-installation)
- [Usage](#🚀-usage)
- [Contribution](#🤝-contribution)
- [Contact](#📧-contact)

## 📋 Features

SkyReady provides a seamless experience for travelers to search and book flights between cities with features:
1. **🔎 Search Flights:**
    - Users can search flights by selecting the departure city, arrival city, and date.
2. **📄 Flight Details:**
    - Shows each flight's number, from/to cities, departure and arrival time, and how many seats are left.
3. **👥 Choose Passengers and Class:**
    - Users can enter how many people are traveling.
    - They can also choose the class of travel: Economy, Second Class, or First Class.
4. **✈️ See Only Available Flights:**
    - Flights that are full will not be shown.
    - If no flights are found, a message will display: "No Flights Available".
5. **💰 Calculate Ticket Price:**
    - Prices change based on how many seats are left and how close the travel date is.
    - Fewer seats or closer travel dates may cost more.
6. **🔁 Round Trip Support:**
    - Users can book a return flight too.
    - A 5% discount is given for round trips.


## 🛠️ Technologies Used

- ⚛️ **React**: JavaScript library for building modern, component-based user interfaces.
- ⚡ **Vite**: Fast build tool and development server optimized for modern front-end frameworks.
- 🧪 **Vitest**: Unit testing framework with fast performance, built to work seamlessly with Vite.
- 🧪 **React Testing Library**: For writing reliable tests that simulate real user interactions with React components.
- 🔧 **ESLint**: Tool for identifying and fixing problems in TypeScript code.
- 🎨 **CSS**: Styling and responsive layout for the user interface.
- 📝 **TypeScript**: Strongly typed language for safer and more maintainable code.
- 🛠️ **GitHub Actions**: Automates testing and CI/CD pipelines for continuous integration and deployment.


## 🗒️ Requirements

Make sure you have the following installed before starting:

1. Install Node.js on macOS. [NodeJS](https://nodejs.org/en/download/package-manager)
   ```bash
   brew install node
   ```

2. Install watchman on macOS using brew. [Watchman](https://formulae.brew.sh/formula/watchman)
   ```bash
   brew install watchman
   ```
3. Install [Git](https://git-scm.com/downloads) on your system.


## 📥 Installation

- Clone the repository:
  ```bash
  git clone git@github.com:anjanibarlapati/skyready-frontend.git
  ```
- Install Ruby dependencies:
  ```bash
  npm install
  ```


## 🚀 Usage


- Run test suites:
  ```bash
  npm run test
  ```
- Run linting:
  ```bash
  npm run lint
  ```
- Start the app:
  ```bash
  npm run dev
  ```
- Visit the app in your browser:
  ```bash
  http://localhost:5174/
  ```

## 🤝 Contribution:
#### If you'd like to contribute, follow these steps:
- Clone repository:
    ```bash
    git clone git@github.com:anjanibarlapati/skyready-frontend.git
    ```
- Create a new branch for your feature.
    ```bash
    git checkout -b branch-name
    ```
- Push your branch to GitHub:
    ```bash
    git push origin branch-name
    ```
- Open a Pull Request to *main* branch.

## 📧 Contact:
For any questions or queries, 

Please contact, [anjanibarlapati@gmail.com](anjanibarlapati@gmail.com)

### Thank You 😃
