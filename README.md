# TechNotes

#### _A full-stack MERN project_

### Contents of this file
- Description
- Installation
- Usage
- Documentation

## Description

- This website is actually like an employee management system for a small tech repair shop business, used to keep track of the tasks for each employee.
- This project also implements role based permissions. Each user can be either an Admin, Manager or Employee. An employee can only view and edit its assigned notes. Anyone can create a note (when a customer checks-in) which will be assigned to a specific employee. Notes can only be deleted by managers or admins. They can view, edit and delete all notes and only they can acces user setings and even add new users (create new accounts).
- I made the project by following this tutorial: https://www.youtube.com/watch?v=CvCiNeLnZ00&t=350s&ab_channel=DaveGray


## Installation

Here are the steps you need to follow to clone this repository: 

1. Install Git:
If you don't have Git installed, download and install it from https://git-scm.com/.

2. Navigate to the directory where you want to clone the repository. In your terminal, type: 

```sh
cd path/to/your/directory
```
or you can directly open the built-in terminal from VSCode.

3. Clone the reporitory, using: 
```sh
git clone "https://github.com/Luisa-Elena/TechNotes.git"
```

4. Install the dependencies: 
```sh
cd TechNotes
cd server
npm install
cd ../client
npm install
```

5. In order to  run the project, you can split the built-in terminal from VSCode. Use one to navigate in the client folder, and the other one to navigate in the server folder
6. To run the server side, type:
```sh
npm run dev
```
7. To run the client side, type:
```sh
npm start
```

## Usage
- In the .env file in the server folder, there should be the variables NODE_ENV=development (since the project is not yet ready for deployment), PORT, DATABASE_URI, ACCESS_TOKEN_SECRET and  REFRESH_TOKEN_SECRET. 
- After clicking on the Employee Login link, on the login form, there is a 'trust this device' checkbox which must be checked in order to make the login persist through refreshing the page.
- The website provides easy navigation, with a header and a footer containing buttons which redirect you on the pages you have access to based on your role and permissions.
