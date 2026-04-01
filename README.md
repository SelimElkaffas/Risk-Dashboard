# AHA PREVENT Cardiovascular Risk Dashboard

A standalone, offline-first dashboard designed for clinical environments to aggregate patient profiles and calculate cardiovascular risk scores based on the 2025 AHA PREVENT clinical guidelines.

## Overview

This application provides medical professionals with a dashboard to calculate 10-year CVD (Cardiovascular Disease) risk. Built with a focus on data privacy and regulatory compliance, the app features a custom dual-storage architecture that allows clinics to keep all patient data strictly on local hardware, bypassing the liabilities of cloud data storage.

## Key Features

* Real-Time Algorithmic Engine: Translates inputs (vitals, labs, demographics, risk factors) into instantaneous risk calculations based on the 2025 AHA PREVENT formulas.
* Dual-Storage Architecture: Allows clinical staff to toggle between two secure storage methods:
  * Local Device Storage (Offline-First): Uses IndexedDB/Dexie.js to save patient records directly to the specific computer's browser memory.
  * Centralized Network Storage: Integrates with a self-hosted PocketBase database, allowing multiple exam rooms on the same local network to sync and access patient profiles securely.
* Clinical UI/UX: Features a multi-panel interface with a dynamic, color-coded risk assessment progress bar for immediate visual feedback.
* Frictionless Deployment: Packaged via Electron into a zero-dependency executable, requiring no IT setup or technical knowledge from clinic staff to install.

## Tech Stack

* Frontend: React, Vite, CSS
* Desktop Framework: Electron
* Local Database: Dexie.js (IndexedDB)
* Network Database: PocketBase (SQLite)

## Getting Started (For Developers)

To run this project locally on your machine for development or testing:

### Prerequisites
* Node.js installed on your machine.
* A local instance of PocketBase running if you wish to test the network storage feature (optional).

### Installation

1. Clone the repository:
```bash
   $ git clone https://github.com/SelimElkaffas/Risk-Dashboard.git
```

2. Navigate to the project directory:
```bash
   $ cd aha-prevent-calculator
```

3. Install dependencies:
```bash
   $ npm install
```

4. Start the development server:
```bash
   $ npm run dev
```

### Building for Production 
To compile the application into an installer:
```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

The compiled executable will be generated inside the `dist` or `out` folder.

## Architecture & Privacy Note

This application was intentionally architected to avoid cloud-based databases. By utilizing local IndexedDB and local-network PocketBase instances, patient Protected Health Information (PHI) never leaves the clinic's physical hardware. This significantly reduces compliance overhead and protects patient privacy against external network breaches.

## Medical Disclaimer

This software is designed as an informational tool for healthcare professionals. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. All calculations should be independently verified by a qualified physician before making clinical decisions.
