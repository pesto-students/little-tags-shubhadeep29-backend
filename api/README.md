# oSlash-assignment

REST API for small audit log management using three user roles SuperAdmin, Admin, User

NodeJS version: 12.x

NodeJS modules used

- aws-serverless-express
- bcryptjs
- body-parser
- express
- express-jwt
- jsonwebtoken
- knex (mysql query builder)
- markup-js
- mysql-await
- nodemon
- uuid

Database used: MYSQL (Hosted on AWS EC2)

Database Schema : [oslash (5).pdf](https://github.com/nitinmadelyn/oslash-assignment/files/6218002/oslash.5.pdf)



### Phpmyadmin details (incase you need)

    http://ec2-13-127-218-228.ap-south-1.compute.amazonaws.com/phpmyadmin
    Username: root
    Password: Newjobpass
    Database Name: oslash


### List of users created
    
Full Name | Username | password | Role 
--- | --- | --- | --- 
Shoaib Khan | shoaib | Iloveoslash | SuperAdmin 
Dhanvi Tammala | dhanvi | Iloveoslash | Admin
Nitin Muchhadiya | nitin | Iloveoslash | User
Tapan Rai | tapan | Iloveoslash | User
Sarfraaz Talat | sarfraaz | Iloveoslash | User


### API Deployment details

- API code hosted on AWS Lambda & API endpoint configured on AWS API Gateway.

- API end point: https://mt6bjbo9yi.execute-api.ap-south-1.amazonaws.com/v1


### Run the app

`npm start`


### REST API Documentation

https://documenter.getpostman.com/view/1316746/TzCL7njY

### POSTMAN Collection

https://www.getpostman.com/collections/10fe962e6e4148854673


### Tests

`npm test`

- CRUD operations for user with role User
- CRUD operations by Admin on behalf of User + List all audit logs
- List all audit logs + Update audit log + Audit log report
- Library used for tests mocha, chai, chai-http