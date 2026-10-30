# OrderCraft – Manufacturing Order Management System

OrderCraft is a web-based Manufacturing Order Management System (OMS) designed to simplify and manage manufacturing business operations. It helps manage customers, products, suppliers, Bills of Materials (BOM), purchase orders, invoices, and payments through a centralized platform.

## 🚀 Features

- **Dashboard:** Provides an overview of the system.
- **Customer Management:** Add, view, update, delete, and search customer records.
- **Product Management:** Manage manufacturing products.
- **Supplier Management:** Maintain supplier information.
- **Bill of Materials (BOM):** Manage raw materials and their required quantities.
- **Purchase Order Management:** Handle purchase orders.
- **Invoice Management:** Create and manage customer invoices.
- **Payment Tracking:** Track payment records and payment status.

## 🛠️ Tech Stack

### Frontend
- Angular
- TypeScript
- HTML
- CSS

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Maven

### Database
- MySQL

### Development Tools
- Visual Studio Code
- MySQL Workbench
- Git and GitHub

## 🏗️ Project Architecture

The application follows a three-tier architecture:

1. **Presentation Layer:** Angular frontend for user interaction.
2. **Application Layer:** Spring Boot REST APIs for business logic.
3. **Database Layer:** MySQL for storing application data.

## 📁 Project Structure

```text
OrderCraft/
│
├── backend/
│   └── ordercraft/
│       ├── src/
│       ├── pom.xml
│       └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   ├── angular.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Saurabh-abes1/OrderCraft.git
cd OrderCraft
```

### 2