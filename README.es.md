# CVE_Management_Service
Application to manage the vulnerabilities from the NVD related to networking devices


El principal objetivo de este proyecto será el mejorar el proceso de endurecimiento informático
relacionado con el estado del software de los equipos de red. El primer procedimiento será una
investigación y estudio sobre la existencia y viabilidad de un repositorio sobre vulnerabilidades,
compatibilidad, estado del software y hardware de los equipos de red de Cisco, Aruba, Allied, Extreme
Networks, Fortinet y Comware. Finalmente, se diseñará e implementará un base de datos con toda la
información obtenida, y a su vez se creará un API para una posible implementación de este servicio en
aplicaciones de terceros.

![Application architecture](img/image.png)

## Requisitos:

Crear un .env con las siguientes varibles de entorno:

Es necesario obtener un API-KEY a traves del siguiente url:

https://nvd.nist.gov/developers/request-an-api-key

    PERSONAL_NVD_API_KEY
    MONGO_INITDB_ROOT_USERNAME
    MONGO_INITDB_ROOT_PASSWORD

## Instalación:

    docker-compose up -d


## Volumen base de datos

-Path: 
    ~/mongodb-volume
-Version:
    -MongoDB 7.0.7 Community(Era la versión de la latest en el momento en el que se realizo el proyecto)
    -Docker nos hara un pull automático de la imagen de mongo en caso de no tenerla, en caso de error ejecutar: docker pull mongo:latest
-Descripción:
    Los cambios en la base de datos son persistentes
    

## Servidor web

-Path: 
    ~/node-express
-Version:
    -Node.js v20.11.1
-Descripción:
    Servidor encargado de recibir información de la NVD, realizar cambios en la mongodb y enviar dicha información al usuario.
    Para acceder a la información se deberá hacer una petición al puerto 3000 

## Peticiones de la API:

    GET /manufacturers
    GET /manufacturers/:manufacturerId
    GET /manufacturers/:manufacturerId/:soId/versions
    GET /manufacturers/:manufacturerId/:soId/versions/:versionId
    GET /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities
    GET /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist
    GET /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId
    GET /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/risk?severity=XXX
    PUT /update-version/:soId/:versionId/:eol/:eoes/:eos (Admite fechas o UNKNOWN, LATEST, TBD (en mayuscula))
    POST /add-version/:soId/:versionId/:eol/:eoes/:eos (Admite fechas o UNKNOWN, LATEST, TBD (en mayuscula))
    DELETE /delete/:soId/:versionId
    PUT /update-cves-one-version/:manufacturerId/:soId/:versionId
    PUT /update-db


## Ejemplo de petición con la versión CiscoIOS15.0(1)m, Recomendable seguir por orden

    https://localhost:3000/manufacturers
    https://localhost:3000/manufacturers/cisco
    https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)m
    https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)m/vulnerabilities
    https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)m/vulnerabilities/cvelist
    https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)m/vulnerabilities/cvelist/CVE-2022-20920
    https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)m/vulnerabilities/cvelist/severity/risk?severity=critical
    https://localhost:3000/update-version/IOS/15.0(1)m/TBD/TBD/TBD 
    https://localhost:3000/delete/ios/15.0(1)m
    https://localhost:3000/add-version/ios/15.0(1)m/UNKNOWN/UNKNOWN/UNKNOWN
    https://localhost:3000/update-cves-one-version/cisco/ios/15.0(1)m
    https://localhost:3000/update-db


## Versión

    v1.0

## Autor

    Ignacio Botella Lledin




