# Extra Information
Node server that serves the APIs and creates new ones, using a nodejs server and a nosql mongodb database.


To start the database container (Do it from the root directory (versions))


docker run -d -p 27017:27017 -v $(pwd)/mongodb-volume:/data/db --name mongodb \
	-e MONGO_INITDB_ROOT_USERNAME \
	-e MONGO_INITDB_ROOT_PASSWORD \
	mongo:latest


To create the node.js image

docker build -t ~/nodejs-image:1.0 .


To connect to the bash of the contender

docker exec -it mongodb mongosh \
		-u MONGO_INITDB_ROOT_USERNAME \
		-p MONGO_INITDB_ROOT_PASSWORD \
        --authenticationDatabase admin \


