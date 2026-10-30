Student Management App

A full-stack student management system: a React + TypeScript admin panel that talks to a C# / ASP.NET Core Web API, with PostgreSQL as the database.

This repository contains the frontend. Backend repository: coming soon (link will be added here).

The frontend includes:

Login form
Student list
Create and edit form
Delete confirmation
Basic API error messages
Responsive, paper-and-raised-button styling

Backend note: The ASP.NET Core project is in a separate repository, not in this frontend folder. The UI can compile without the API, but login and student operations need a running backend with the endpoints described below.

Contents
Tech stack
Architecture
Requirements
Run the frontend
Project structure
How the app works
Backend (C# / ASP.NET Core)
HTTP API expected by the frontend
Test the app
Common problems
What I learned
Roadmap
Author
Tech stack
Layer	Technology
Frontend	React, TypeScript, Vite
Backend	C#, ASP.NET Core Web API (.NET)
ORM	Entity Framework Core
Database	PostgreSQL
API testing	Swagger
Tools	Git, GitHub, VS Code, pgAdmin
Architecture
text
React (Vite)  ->  studentService.ts  ->  ASP.NET Core API  ->  EF Core  ->  PostgreSQL
   browser          HTTP / JSON            controllers          queries       tables

The frontend never connects to PostgreSQL directly. Every action goes through the API.

Requirements
Node.js and npm
The ASP.NET Core API, when testing real login and student data
PostgreSQL configured for the backend
Run the frontend

Clone the repository and install dependencies:

bash
git clone https://github.com/Arsh-Khan11/studentData-app-frontend.git
cd studentData-app-frontend
npm install

Start Vite:

bash
npm run dev

Open the local URL printed by Vite, usually http://localhost:5173.

Useful project checks:

bash
npm run build
npm run lint
build runs the TypeScript project checks and creates the production site in dist/.
lint checks the source code with ESLint.

Start the backend separately and make sure its URL and port match the frontend configuration in src/services/studentService.ts.

Project structure
text
src/
  components/
    LoginForm.tsx       Login inputs and login error message
    StudentForm.tsx     Add/edit student form
    StudentTable.tsx    Student rows and Edit/Delete buttons
  pages/
    AdminPage.tsx       Student state and coordination between components
  services/
    studentService.ts   HTTP requests to the ASP.NET Core API
  types/
    student.ts          TypeScript data shapes
  App.tsx               Chooses the login page or admin page
  index.css             App layout, colors, buttons, and responsive styles
  main.tsx              React entry point
Main files and their responsibilities
App.tsx stores isLoggedIn. It displays LoginForm until login succeeds, then displays AdminPage.
AdminPage.tsx owns the students array, the selected student being edited, and the page-level API error. It passes data and callback functions down to the form and table.
StudentForm.tsx owns the current input values. It creates a student when no student is selected, or updates the selected student in edit mode.
StudentTable.tsx displays the students prop. It does not keep its own copy of the list.
studentService.ts translates frontend actions into HTTP requests.
student.ts defines the shape of the data passed between these files.
How the app works
1. Login

App initially sets isLoggedIn to false, so it renders LoginForm. The form calls loginStudent() when submitted. If the API responds successfully, onLoginSuccess() changes isLoggedIn to true, and App displays AdminPage.

This is only an in-memory frontend screen switch. The current frontend does not save an authentication token or remember login across a page refresh. The backend must still enforce authorization for protected API requests.

2. Load and display students (Read)

When AdminPage mounts, it calls getStudents(). That function sends a GET request. When the request succeeds, setStudents(data) updates React state. React then passes the new array to StudentTable, which renders one row per student.

The students state is owned by AdminPage so the form and table can stay in sync.

3. Add a student (Create)

StudentForm keeps the input values in its student state. Each input's onChange handler updates the matching value. On submit:

The form calls createStudent(student).
The service sends a POST request.
If the request succeeds, the form resets its fields. The default status is "Active".
The form calls its onSaved prop.
AdminPage leaves edit mode (if applicable) and reloads the list.

The refreshed list makes the new student appear in the table without a manual browser refresh.

4. Edit a student (Update)

Clicking Edit calls onEdit(student) from the table. AdminPage stores that student in editingStudent and passes it to StudentForm.

The form starts with that student's values and changes its submit button to Update Student. Submitting calls updateStudent(id, student), which sends a PUT request. On success, the parent exits edit mode and reloads the list.

Click Cancel to exit edit mode without sending an update. The key on StudentForm changes when the selected student changes; React then creates a fresh form instance with the right initial values.

5. Delete a student (Delete)

Clicking Delete opens the browser's confirm() prompt. Cancel leaves the student in place. Confirm calls deleteStudent(id), which sends a DELETE request. After success, AdminPage reloads the list and the deleted row disappears.

6. Show API errors

If login, loading, saving, or deleting fails, the relevant component catches the request error and displays a message in the page. Errors from loading, saving, and deleting are shown by AdminPage; login errors are shown by LoginForm.

The service methods use simple error messages. They do not currently display detailed error bodies returned by the backend.

Backend (C# / ASP.NET Core)

The API is a separate C# / ASP.NET Core Web API project (repository link coming soon). It provides:

Controllers: a Student controller for login and a StudentDetails controller for the CRUD endpoints
Entity Framework Core: maps the student model to a PostgreSQL table
PostgreSQL: stores the student data (viewed with pgAdmin during development)
Swagger: every endpoint can be tried in the browser while the API is running
CORS: enabled for the Vite dev origin http://localhost:5173

To run the backend you need the .NET SDK and a running PostgreSQL instance. Set your own PostgreSQL connection string in the backend configuration, and never commit a real password to Git.

HTTP API expected by the frontend

The API base URL is currently hard-coded near the top of src/services/studentService.ts:

ts
const API_URL = "http://localhost:5071/api";

Change this value if your ASP.NET Core API uses a different host or port. The backend must also allow requests from the Vite origin (usually http://localhost:5173) through CORS.

Action	Method	URL	Request body
Login	POST	/Student/login	{ "email": "...", "password": "..." }
List students	GET	/StudentDetails	None
Create student	POST	/StudentDetails	Student fields
Update student	PUT	/StudentDetails/{id}	Student fields
Delete student	DELETE	/StudentDetails/{id}	None

The frontend expects the student list and create response to use this general shape:

json
{
  "id": 1,
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "course": "Computer Science",
  "year": "2",
  "status": "Active"
}

The list endpoint should return an array of these objects. The TypeScript types are in src/types/student.ts. In this project, year is a string; the backend may use a different type, but the JSON and frontend type must agree.

The frontend accepts any successful 2xx response for PUT and DELETE, including 204 No Content. Create and login parse a JSON response, so those endpoints should return valid JSON. The login form only checks whether the login request succeeded; it does not currently store or use a token.

Check your controller: Confirm that the PUT and DELETE routes exist and match the paths above. Route names and entity/property types in your ASP.NET project may differ.

Test the app

With both frontend and backend running:

Sign in with an account accepted by the API.
Confirm the student list appears.
Add a student. After a successful save, the form should clear, status should return to Active, and the new student should appear.
Click Edit on a row. Its fields should populate. Change a field and click Update Student; the table should show the updated value.
Click Edit, then Cancel. The app should leave edit mode without sending an update.
Click Delete. Cancel the confirmation and verify the row stays. Repeat and confirm; the row should disappear.
Stop the API temporarily or use an invalid API URL and submit a request. The page should show an error instead of silently appearing successful.
Common problems
The browser says it cannot connect to the API
Confirm the backend is running.
Check the host and port in API_URL.
Confirm CORS allows the Vite development origin.
Check the browser developer tools' Network tab for the failed request.
Login succeeds but refresh returns to login

That is expected with the current frontend: isLoggedIn exists only in React memory. It resets when the page reloads. Persisted login would require a backend authentication design and token/session handling.

Create works but the new row does not appear

Check that the create request succeeded, then inspect the GET /StudentDetails response. The form asks AdminPage to reload the list after a successful create.

Edit or Delete returns an error

Confirm the backend implements PUT /api/StudentDetails/{id} and DELETE /api/StudentDetails/{id}, accepts the request body/ID format, and returns a successful HTTP status when the operation completes.

What I learned
Structuring a React app into components, pages and a service layer
Passing data and callbacks between components with props and managing state
Writing a REST API in C# with ASP.NET Core controllers
Using Entity Framework Core with PostgreSQL
Connecting a frontend to a backend, and handling CORS and API errors
Git and GitHub workflow
Roadmap
 CI with GitHub Actions (build and lint on every push)
 Deploy to Azure
 Move the API URL to an environment variable
 Real authentication (JWT) and persistent login
Author

Arsh Khan: GitHub