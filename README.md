# INF133 Project

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Installation and Running](#installation-and-running)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

It's a collection of calendars, notes and AI web apps. The project is based on Vuetify + Javascript. 


## Installation and Running

### Prerequisites

Ensure Node.js and npm are installed on your system. You can download them from the [Node.js official website](https://nodejs.org/).

### Clone the Repository

```bash
git clone https://github.com/zwldarren/INF133_project.git
cd INF133_project
```

### Install Dependencies

Run the following command to install both frontend and backend dependencies:

```bash
npm install
```

### Environment Variables

#### Backend

The backend requires certain environment variables to run. You should create a `.env` file in the `backend` directory based on the provided `.env.template`.

```bash
cp backend/.env.template backend/.env
```

Edit the newly created `.env` file with your specific configuration details.

### Start the Project

Run the following command to start both the frontend and backend servers concurrently:

```bash
npm run start
```

## Scripts

- `npm run dev` - Start the frontend development server.
- `npm run build` - Build the frontend project for production.
- `npm run preview` - Preview the production build.
- `npm run lint` - Run ESLint to fix code issues.
- `npm run start` - Start both frontend and backend concurrently.
