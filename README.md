Project Overview
This project is a Full Stack Multi-Vendor E-Commerce Platform that enables multiple vendors to sell products through a single website. The platform provides separate user interfaces (UIs) for three types of users: Admin, VendorAdmin, and User. It uses a common backend to handle all the UI requests and operations.

The project is built using JavaScript, React, Node.js, and MongoDB, providing a modern and scalable architecture for e-commerce applications.

Key Features

1. Admin Interface
   Vendor Management: Admin can manage vendors, view their listings, approve/disapprove vendors.
   Product Management: Admin can add, edit, or delete products across vendors.
   Order Management: Admin has access to all user orders and can manage order status.
   User Management: Admin can view user profiles, handle user queries, and suspend accounts.
   Reports and Analytics: Admin can view reports on sales, vendor performance, and site traffic.
2. VendorAdmin Interface
   Product Listings: VendorAdmin can add, edit, and remove products from their store.
   Order Management: Vendors can view orders related to their products and mark orders as shipped, processed, or delivered.
   Inventory Management: Vendors can manage their stock and set availability for products.
   Profile Management: Vendors can manage their store profile, including logos, descriptions, and settings.
   Sales and Earnings Reports: VendorAdmins can access performance reports for their store.
3. User Interface
   Product Browsing: Users can view products from different vendors, filter, and search based on categories, prices, and ratings.
   Shopping Cart: Users can add products to their cart and proceed to checkout.
   Order Tracking: Users can track the status of their orders in real time.
   User Profile: Users can manage their profile information, order history, and wish list.
   Payment Integration: Supports multiple payment methods such as credit cards, PayPal, etc.
4. Common Backend
   API Endpoints: A robust backend powered by Node.js and Express handles all requests from the frontend UIs.
   Authentication & Authorization: Implemented with JWT for secure user and admin access. Different roles are managed to ensure secure access to different sections (Admin, VendorAdmin, and User).
   Database Integration: MongoDB is used as the NoSQL database to store data related to users, vendors, products, orders, and transactions.
   Real-time Notifications: Admin, Vendor, and User interfaces can send real-time notifications for order updates, product availability, etc.

Technologies Used

Frontend:

1. React: A JavaScript library for building user interfaces. React components are used for rendering dynamic pages for Admin, VendorAdmin, and User sections.
2. Redux: For state management across the application.
3. React Router: For handling page routing within the platform.

Backend:

1. Node.js: JavaScript runtime for building scalable backend services.
2. Express.js: A web application framework for Node.js to handle routing and middleware.
3. MongoDB: NoSQL database used for storing user, vendor, product, order, and other platform data.
4. JWT (JSON Web Tokens): For authentication and authorization.

Other Technologies:

1. Bcrypt.js: For secure password hashing.
2. Mongoose: ODM (Object Document Mapping) for MongoDB to interact with the database.
3. Socket.io : For real-time features like notifications and chat support.

---------------------------usage options------------------------

------------for vendor admin portal-------------
cd .\VendorAdmin\
npm install
npm run dev

------------for User portal-------------
cd .\Frontend\
npm install
npm run dev

-------------for Admin portal-------------
cd .\Admin\
npm install
npm run dev
