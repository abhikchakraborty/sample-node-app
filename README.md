# What this sample project does

Its a small application built on node.js and front end with EJS template where 
- User can login and create a post from their timeline
- The timeline will show their own post along with the comments from other users and likes
- The network will show all the post from other users with the comments, and the logged in user should be able to comment and like the post.

This is a sample application covering most of the things to start a project on `node.js`, there may be some bugs and could be fixed easily. 
The purpose of this is to provide a well covered code base to start and learn node.js

# Prerequisite

- You need to have the latest node and npm
- Need to have the mysql DB up and running and should be accessible via localhost as host name from the app 

# Setup

- Clone or download the repo
- Create the DB on your mysql (choose any name), make sure to remember the dbusername and password if you are choosing a new one other than root
- Import the `installations/db.sql` file to mysql
- From terminal get inside the root of the project folder and type `sudo npm install`
- From root of the project folder create a file called `.env`
- Inside the `installations` folder there is a file called `env.sample`, open that file and place the content inside the `.env` file created
- Make sure to replace the values as required, the `env.sample` file looks like
```
API_DB_MYSQL_NAME={your mysql db name}
API_DB_MYSQL_READ_HOST=localhost
API_DB_MYSQL_READ_PASS={db password}
API_DB_MYSQL_READ_USER={db username}
API_DB_MYSQL_WRITE_HOST=localhost
API_DB_MYSQL_WRITE_PASS={db password}
API_DB_MYSQL_WRITE_USER={db username}
API_DOMAIN=localhost
SESSION_SECRET={somesecrectstringasyouwant}
API_PORT=9601
```
- In the above `env.sample` there are 2 db connections one for read and one for write, this is helpful in case we decide to do replication of mysql, if there is no replication and having only one mysql server then also make sure to provide connection details for both read and write which will be same without replication.
- Once all the above mentioned steps are done from the project root folder type `node server.js`
- The command will create the node server and we should be able to open the project on browser as http://localhost:9601

### Note : If we change the port number on env as shown on env.sample we may need to adjust the above URL as well.

By default DB will be empty and hence the obvious thing is to create some users, and to do so we have a user migration script which is `installations/sample-user.js` and to execute the script follow the step as below
- Copy the `.env` created for the project to the `installations` folder.
- Open the file `installations/sample-user.js` on your favorite editor
- There is an array containing the user information to be imported as
```
var userList = [
 	{userName:'user1', password: 'user123', email: 'user1@gmail.com',firstName:'user1', lastName:'user1'}
];
```
- Change the above as you want and add more users as needed.
- Once done from the `installations` folder in terminal run `node sample-user.js`, this will create the users into the DB.
- Make sure that the userName is unique.

### Under the hood

This sample project is built with the following
- Express.js
- Waterline ORM, this is useful since it supports adapter based DB connections where we can have multiple DB connections setup which may need in real life project environment 
- All the sensitive information is stored in `.env` which is often done in real projects
- Currently it's not utilizing the `Grunt`, however we can easily implement the same
- Uses JSONAPISerializer for the JSON representation www.jsonapi.org , right now its doing the minimum coverage of JSON representation which could be extended if needed
- Using Passport.js local strategy for login/logout handling
- All the libraries are latest.

