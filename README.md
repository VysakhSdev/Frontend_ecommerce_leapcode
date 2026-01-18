# Leapcode Frontend

The client-side React application for the Product & Cart Management System, featuring Role-Based Access Control (RBAC). This project serves as the frontend interface for managing products, users, and shopping carts with distinct permissions for Superadmins, Admins, and Users.

## Features

- **Authentication**: Secure login screen using JWT-based authentication.
- **RBAC Dashboard**: Dynamic views tailored for Superadmins, Admins, and Users.
- **Product Management**: Full CRUD operations for products based on role permissions.
- **Cart System**: User-specific cart management (Add, Update, Remove items).
- **Admin View**: Specialized "Eye" icon in user lists allowing admins to view live user carts.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide-React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/) (with interceptors for JWT)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: v16 or higher recommended
- **npm**: v7 or higher

## Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

## 🔧 Configuration

Create a `.env` file in the root directory of the project to configure the API connection.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note**: Ensure the backend server is running and accessible at the specified URL.

##  Running the Application

**Start the development server:**

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

