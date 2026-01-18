Leapcode Frontend
The client-side React application for the Product & Cart Management System, featuring Role-Based Access Control (RBAC).

**Features**
Authentication: Secure login screen using JWT-based authentication.

RBAC Dashboard: Dynamic views for Superadmins, Admins, and Users.

Product Management: CRUD operations for products based on role permissions.

Cart System: User-specific cart management (Add, Update, Remove).

Admin View: Specialized "Eye" icon in user lists to view live user carts.

**Tech Stack**
Framework: React (Vite).

Styling: Tailwind CSS.

Icons: Lucide-React.

API Client: Axios with interceptors for JWT.

Notifications: React Hot Toast.

**Installation**

**Install dependencies**

Bash

npm install

**Environment Variables Create a .env file in the root directory:**

Code snippet

VITE_API_BASE_URL=http://localhost:5000/api

**Run the application**

Bash

npm run dev