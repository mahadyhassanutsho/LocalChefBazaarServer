# LocalChefBazaar Server
>
> **Backend for a marketplace of local home-cooked meals**

## 📌 Overview

LocalChefBazaar is a modern online platform designed to connect home cooks with customers looking for fresh, healthy, and affordable homemade meals.

This repository contains the **backend server**, built with **Node.js**, **Express**, and **MongoDB**, providing the core APIs and functionality for the platform.

## 🍽️ What LocalChefBazaar Offers

- Browse daily menus from local home cooks  
- Check chef availability and meal schedules  
- Place meal orders with secure payment support  
- Real-time order tracking  
- Ratings and reviews  
- Role-based access (Admin, Chef, Customer)  
- Easy onboarding for home cooks to earn from their kitchens  

The server follows the **MERN architecture**, serving as the backbone for data management, authentication, and business logic.

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **Firebase Admin**
- **MongoDB + Mongoose**
- **dotenv** for environment configuration  
- **cors** for cross-origin access  
- **pino + pino pretty** for logging
- **nodemon** (dev) for auto-reload during development

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/utshomh/LocalChefBazaarServer.git
cd LocalChefBazaarServer
```

2️⃣ Install dependencies (using pnpm)

```bash
pnpm install
```

3️⃣ Create an .env file

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

4️⃣ Start development server

```bash
pnpm run dev
```

## ❤️ Made with Love by UtshoMH
