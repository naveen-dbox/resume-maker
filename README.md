# Resume-Maker



## Introduction

The Resume Maker is a web application designed to streamline the process of creating professional resumes. With a user-friendly interface, it allows users to choose from a variety of templates, fill out a form with their personal and professional information, edit the content,check the resume score with job description and download the finalized resume in PDF, Word, or JPG format.

## Features:

- **Template Selection:** Users can choose from a selection of pre-designed resume templates, offering diverse styles and layouts to suit different preferences and industries.
- **Content Editing:** Users have the flexibility to edit and customize the generated resume content, including text formatting, section reordering, and adding additional sections or details as needed.
- **Download Options:** Once satisfied with the resume, users can conveniently download the finalized document in PDF, Word, or JPG format, ensuring compatibility with various application processes and platforms.
- **Admin Panel:** An admin panel allows authorized users to perform administrative tasks such as adding new resume templates, creating new admin accounts, updating passwords, and viewing messages sent through the platform.
- **Resume Score:** Users can paste the job description into the platform to evaluate their resume's alignment with the job requirements, helping them to improve their chances of success in their job applications.



## Technologies & Frameworks Used:

- Node.js
- Express.js
- MongoDB
- HTML, CSS, JavaScript
- Bootstrap
- AWS

## Code Usage

To run the application, follow these steps:

1. Install dependencies:
    ```bash
    npm install
    ```

2. Start the server:
    ```bash
    npm start
    ```

Alternatively, if you want to use nodemon for automatic server restart during development, you can use:
    ```
    npm run dev
    ```

**Note**: You can access the admin page at `/admin`. Initially, to use the admin features, utilize the functions available in `utils/auth.js` to create a new admin, generate a salt for that admin, hash and store the password in the users mongodb database.


To run tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

To generate test coverage report:
```bash
npm run coverage
```
