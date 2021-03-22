# KLOTHS REST API

This repo consist of REST API's for KLOTHS onlines shopping cart.

NodeJS version: 12.x

Database used: MYSQL (Hosted on AWS EC2)

## SCHEMA

[KLOTHS-Schema.pdf](https://github.com/pesto-students/little-tags-shubhadeep29-backend/files/6182462/KLOTHS-Schema.pdf)


API code hosted on AWS Lambda & API endpoint configured on AWS API Gateway.




## Run the app

    npm start


# REST API

The REST API is described below.


## Login/Signup User

### Request

`POST /user/authenticated`


### Response
    {"status":"success","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJOaXRpbiIsImxhc3ROYW1lIjoiTXVjaGhhZGl5YSIsImVtYWlsIjoibml0aW4udXNlcjExQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjE2MTk0OTIxLCJleHAiOjE2MjM5NzA5MjF9.FW29q9bI2_PLlL8_rOo3nSF0xYcOi_x9IncsWOtzyu0"}
    



## Run the tests

    npm test

`test 1 - /user/authentication user signup`

`test 2 - /user/authentication user login`

will add more test casees soon afer implementing all api end points

## POSTMAN collection 

    Will add once all api developed





