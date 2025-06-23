# TFG-node-server
Servidor de node que atiende a las APIs y crea unas nuevas, utilizando un servidor de nodejs y una base de datos nosql mongodb



Para iniciar el contenedor de la base de datos(Hacerlo desde el directorio raiz (versiones))


docker run -d -p 27017:27017 -v $(pwd)/mongodb-volume:/data/db --name mongodb \
	-e MONGO_INITDB_ROOT_USERNAME \
	-e MONGO_INITDB_ROOT_PASSWORD \
	mongo:latest


Para crear la imagen de node.js

docker build -t ~/nodejs-image:1.0 .


Para conectarse al bash del contendor

docker exec -it mongodb mongosh \
		-u MONGO_INITDB_ROOT_USERNAME \
		-p MONGO_INITDB_ROOT_PASSWORD \
        --authenticationDatabase admin \


