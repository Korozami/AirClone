# AirClone

Database Schema Design Prototype

TBA

API Documentation

USER AUTHENTICATION/AUTHORIZATION

TBA

GET THE CURRENT USER

Return information about the current user that is logged in.
    -Require Authentication: True
    -Request
        -Method: GET
        -URL: /user/:id (maybe????)
        -Body: none
    -Successful Response when there is a logged in user
        -Status Code: 200
        -Headers:
            -Content-Type: application/json
        -Body:
            {
            "user": {
                "id": 1,
                "firstName": "Kevin",
                "lastName": "Sy",
                "email": "kevin.sy@secret.com",
                "username": "KAirClone"
              }
            }
    -Successful Response when there is no logged in user
        -Status Code: 200
        -Headers:
            -Content-Type: application/json
        -Body:
            {
                "user": null
            }

LOG IN A USER
    Logs in a current user with valid credentials and returns the current user's information
        -Require Authentication: false
        -Request
            -Method: GET??????
            -URL: /user/userId ????????
            -Headers:
                -Content-Type: application/json
            -Body:
                {
                    "credential": "kevin.sy@secrete.com",
                    "password": "sec
                }
