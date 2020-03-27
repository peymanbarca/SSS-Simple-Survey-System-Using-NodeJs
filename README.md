# SSS-Simple-Survey-System-Using-NodeJs
Simple Survey System Using NodeJs


Demo Version (V0.x) for A simple node.js app for survey and commenting system working via MongoDB
along with simple UI with HTML,BootStrap & Jquery
Dockerfile added for containerized deploying via docker and pm2

for further learning, 
 do todos task so this project can be convered as a high class and perfect application written in node.js, mongoDb, Redis and Docker!

# Includes:
    # User Serivce 
        . User Registration and Authentication and logot with simple login,password
        . Express Session for maintain login state with duration
        . todo : implement via JWT
    # Comment Service
        . Add comments for login user
        . See all comments
        . like/dislike
        . todo 
            . Implement via JWT token
            . Add more Functionality such as edit,delete,reply
            . search fuzzy text added
            . integrate Redis via mongoDb to increase both speed and class of project!
            
# Deploy
    . direct
        node server.js 
    . Via PM2
       pm2 start server.js -name SSS-v0
    . Dockerized
        ./deploy.sh
