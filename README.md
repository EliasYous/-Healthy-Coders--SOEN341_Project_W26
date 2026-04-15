# -Healthy-Coders--SOEN341_Project_W26
MealMajor is a web application designed to help students plan meals efficiently. By managing their dietary preferences and allergies, MealMajor allows busy students to track their groceries and receive simple recipe suggestions. The application aims to promote healthier eating habits while simplifying meal planning.

Team Members:
- Brian Duong - ohmy90 (ID: 40281149): Frontend development 
- Juan Holguin Corpas - juanseb02 (ID: 40319201): Backend development
- Abdullah Orakzai - jenok28 (ID: 40136424): Backend development
- Dipita Sinha - dipiareum04 (ID: 40273009): Frontend development
- Elias Youssef - EliasYous (ID: 40197603): Project coordination and Backend development

## Technology Used

The full list of technologies used in the project:

- **Backend:** Node.js runtime + Express framework
- **Frontend:** React.js library
- **Database:** PostgreSQL (with `pg` library)
- **Authentication:** localStorage & Bcryptjs
- **Styling:** CSS3

## Meeting Minutes

A detailed record of the meetings conducted by the team can be viewed through the project's repo.

## Development

This project is developed with a focus on code quality and consistent progress.

### Environment Variables

Secrets and other configuration values are managed through environment variables. When developing locally, they can be configured by creating a `.env` file in the `backend` directory.

| VAR         | DESC                  | DEFAULT         |
| ----------- | --------------------- | --------------- |
| DB_HOST     | The database host     | localhost       |
| DB_USER     | The database username | postgres        |
| DB_PASSWORD | The database password | [your_password] |
| DB_NAME     | The database name     | meal_major      |
| DB_PORT     | The database port     | 5432            |
| PORT        | Backend server port   | 5000            |

### Starting the Dev Environment

1.  **Node Version:** Use `nvm` to install the proper version of node (v20+ recommended):

    ```powershell
    nvm install 20
    nvm use 20
    ```

2.  **Database Setup:**
    Ensure PostgreSQL is running and create the database:

    ```sql
    CREATE DATABASE meal_major;
    ```

3.  **Backend Setup:**

    ```powershell
    cd backend
    npm install
    npm run dev
    ```

4.  **Frontend Setup:**
    In a new terminal:
    ```powershell
    cd frontend
    npm install
    npm start
    ```

### Database

**Table Initialization:**
The backend is configured to automatically initialize the database schema on startup using `backend/config/dbInit.js`. This creates the `users`, `user_profiles` and `recipes` tables if they do not exist.
