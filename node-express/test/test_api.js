const test = require('node:test');
const axios = require('axios');
const assert = require('assert');
const https = require('https')


/*
        ***Batería de TEST para comprobar las respuestas de la API***
        --Se ejecuta con:
            npm run test-api

        --Requisitos para realizarlos:

            -Tener el servidor node corriendo, y asegurarnos que ningun usuario esta haciendo peticiones

            -Tener las siguientes versiones en la db
                        -FortiOS 7.4.0
                        -IOS 15.0(1)M
                        -Comware 9.10.R91 
                        -ArubaOS-Switch 15.16.0004




*/

/*
Bateria de test para comprobar todas las respuestas de los path, tantos los 200 como los 400, los 100se comprobaran en otras baterias de test


*/
test('Peticiones a la API generales', async (t) => {

    //Test para el path /manufacturer
    await t.test('/manufacturers', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data.length == 5)) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturer")
            }

        })

    })


    //Test para el path /manufacturer/:manufacturerId


    await t.test('/manufacturers/:manufacturerId status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO.length == 2)) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturer/:manufacturerId")
            }
        })
    })


    await t.test('/manufacturers/:manufacturerId status 400(El tipo de Fabricante introducido no está soportado o es incorrecto)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/example',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400)) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "No comprueba correctamente que se haya pasado un fabricante correcto")
            }
        })
    })


    //Test para el path /manufacturers/:manufacturerId/:soId/versions

    /*
    
    Para este test será necesario tener al menos una versin de comware introducida
    
    */

    await t.test('/manufacturers/:manufacturerId/:soId/versions status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/comware/versions',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "Comware")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturer/:manufacturerId/:soId/versions")
            }
        })
    })


    await t.test('/manufacturers/:manufacturerId/:soId/versions status 400(El tipo de SO introducido no está soportado o es incorrecto)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard/comware/versions',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == "400") && (apiResponse.data[0].info == "El tipo de SO introducido no está soportado o es incorrecto")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación del SO")
            }
        })
    })



    //Test para el path /manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities

    /*
    
        Para este test será necesario tener al menos una versión de cisco ios 15.0(1)M introducida
    
    */


        await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].Version == "15.0(1)M")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturers/:manufacturerId/:soId/versions")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities status 400(El tipo de SO introducido no está soportado o es incorrecto)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/error/versions/exampleexample/vulnerabilities',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El tipo de SO introducido no está soportado o es incorrecto")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación del SO")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities status 400(La versión introducida no está en la db)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/exampleexample/vulnerabilities',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "La versión introducida no está en la db")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de la versión")
            }
        })
    })
    //Comprobaremos que comware y allied dan error ya que no tienen ninguna cve asociada a ellos

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities status 400(AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Allied-telesis/Alliedware-Plus/versions/XXX/vulnerabilities',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de allied")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities status 400(Comware no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/comware/versions/XXX/vulnerabilities',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de comware")
            }
        })
    })

    //Test para el path /manufacturers/extreme-networks/exos/versions/31.0/vulnerabilities/cvelist

    /*
    
        Para este test será necesario tener al menos una version de extreme-networks exos 31.0 y 32.5.1.5 introducida
    
    */


        await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/extreme-networks/exos/versions/31.0/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "EXOS") && (apiResponse.data[0].CVE_id != null)) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturers/:manufacturerId/:soId/versions")
            }
        })
    })

    //Probaremos con una versión que no tiene vulnerabilidades 

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 200 empty response', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/extreme-networks/exos/versions/32.5.1.5/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data.length == 0)) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 400(El tipo de SO introducido no está soportado o es incorrecto)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/tworks/exos/versions/31.0/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            //Comprobaremos que nuestra API manufacturers tenga un tamaño correcto y una respuesta 200
            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El tipo de SO introducido no está soportado o es incorrecto")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación del SO")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 400(La versión introducida no está en la db)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/extreme-networks/exos/versions/eeeeerrrooooorrrr/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "La versión introducida no está en la db")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de la versión")
            }
        })
    })

    //Comprobaremos que comware y allied dan error ya que no tienen ninguna cve asociada a ellos

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 400(AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Allied-telesis/Alliedware-Plus/versions/XXX/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de allied")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 400(Comware no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/comware/versions/XXX/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de comware")
            }
        })
    })

    //Test para el path /manufacturers/fortinet/fortios/versions/7.4.0/vulnerabilities/cvelist/CVE-2023-37935

    /*
    
        Para este test será necesario tener al menos una version de fortinet 7.4.0 introducida
    
    */


        await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/fortinet/fortios/versions/7.4.0/vulnerabilities/cvelist/CVE-2023-37935',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "FortiOS") && (apiResponse.data[0].CVE_id == "CVE-2023-37935")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 400(El tipo de SO introducido no está soportado o es incorrecto)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/errrrr/fors/versions/7.4.0/vulnerabilities/cvelist/CVE-2023-37935',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El tipo de SO introducido no está soportado o es incorrecto")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación del SO")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 400(La versión introducida no está en la db)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/fortinet/fortios/versions/aaaaa/vulnerabilities/cvelist/CVE-2023-37935',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "La versión introducida no está en la db")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de la versión")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 400(No hay ninguna vulnerabilidad con ese Id para esta version)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/fortinet/fortios/versions/7.4.0/vulnerabilities/cvelist/CVE-uouououuou',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "No hay ninguna vulnerabilidad con ese Id para esta version")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación del CVE")
            }
        })
    })

    //Comprobaremos que comware y allied dan error ya que no tienen ninguna cve asociada a ellos

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 400(AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Allied-telesis/Alliedware-Plus/versions/XXX/vulnerabilities/cvelist/aaaa',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de allied")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 400(Comware no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/comware/versions/XXX/vulnerabilities/cvelist/aaaaaa',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de comware")
            }
        })
    })

    //Test para el path /manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk?severity=critical

    /*
    
        Para este test será necesario tener al menos una version de cisco 15.0(1)M introducida ya que tiene todos los tipos de nivel de severidad de vulnerabilidades
    
    */


        await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 200 critical', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk?severity=critical',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].cvssbaseSeverity == "CRITICAL")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 200 high', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk?severity=high',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].cvssbaseSeverity == "HIGH")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 200 medium', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk?severity=medium',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].cvssbaseSeverity == "MEDIUM")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 200 low', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk?severity=low',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].cvssbaseSeverity == "LOW")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 400(El tipo de SO introducido no está soportado o es incorrecto)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/co/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk?severity=critical',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El tipo de SO introducido no está soportado o es incorrecto")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación del SO")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 400(La versión introducida no está en la db)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/errorerror/vulnerabilities/cvelist/severity/risk?severity=critical',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "La versión introducida no está en la db")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de la versión")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 400(El nivel de severidad que se esta buscando no es válida)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk?severity=error',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El nivel de severidad que se esta buscando no es válida")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación del CVE")
            }
        })
    })

    //Comprobaremos que comware y allied dan error ya que no tienen ninguna cve asociada a ellos

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 400(AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Allied-telesis/Alliedware-Plus/versions/XXX/vulnerabilities/cvelist/severity/risk?severity=critical',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de allied")
            }
        })
    })

    await t.test('/manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/severity/risk status 400(Comware no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_config = axios.create({
            
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/comware/versions/XXX/vulnerabilities/cvelist/severity/risk?severity=critical',  
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
             
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la comprobación de comware")
            }
        })
    })



})



/*
Bateria de test para comprobar que minetras se produce una actualización recibiremos un mensaje status 100, si el update tarda menos que los subtest algunos pueden que fallen
Hay que tener en cuenta el caso mencionado anterior, por ello es necesario tener una cuantas versiones para que el /update-db tarde más que la bateria de subtests

Las versiones de FortiOS 7.4.0 y cisco IOS 15.0(1)M deben estar en la db


Bateria de test para comprobar que las respuesta de la update-db funcionan correctamente

Deberemos tener las siguientes versiones en la db:

    -Cisco IOS 15.0(1)M
    -Fortinet FortiOS 7.4.0
    -HPE Comware 9.10.R91
*/
test('/update-db status 100', async (t) => {

    var url_config_update = axios.create({
        baseURL: 'https://localhost:3000/update-db',
        method: 'put',
        httpsAgent: new https.Agent({
                  
            rejectUnauthorized: false,
            
          })
    
    })


    var update_db_petition = url_config_update.put()

    await t.test('subtest /manufacturers status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturer")
            }

        })
    });

    await t.test('subtest /manufacturers/:manufacturerId status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/AruBAOS-Switch',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId")
            }

        })
    });

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/comware/versions',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions")
            }

        })
    });

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/fortinet/fortios/versions/7.4.0',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId")
            }

        })
    });

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/fortinet/fortios/versions/7.4.0/vulnerabilities',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities")
            }

        })
    });


    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist")
            }

        })
    });


    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/CVE-2007-5548',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId")
            }

        })
    });

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/risk?severity=XXX status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              }),
            params: { severity: "critical" }
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/risk?severity=XXX")
            }

        })
    });

    await t.test('subtest /update-version/:soId/:versionId/:eoes/:eos status 100', async (t) => {

        var url_config = axios.create({
            method:'put',
            baseURL: 'https://localhost:3000/update-version/IOS/15.7/2019-01-31/2019-01-31',
            
            httpsAgent: new https.Agent({
                
                rejectUnauthorized: false,
                
              })
        })

         await url_config.put().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /update-version/:soId/:versionId/:eoes/:eos")
            }

        })
    });

    await t.test('subtest /add-version/:soId/:versionId/:eoes/:eos status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/add-version/exos/32.5.1.5/UNKNOWN/UNKNOWN',
            method: 'post',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.post().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /add-version/:soId/:versionId/:eoes/:eos")
            }

        })
    });

    await t.test('subtest /delete/:soId/:versionId status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/delete/comware/9.10.R91 ',
            method: 'delete',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.delete().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /delete/:soId/:versionId")
            }

        })
    });



    await t.test('subtest /update-cves-one-version/:manufacturerId/:soId/:versionId status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/update-cves-one-version/cisco/ios/15.0(1)M',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.put().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /update-cves-one-version/:manufacturerId/:soId/:versionId")
            }

        })
    });


    //Este subtest nos servirá para comprobar que no se puede actualizar mientras ya se esta actualizando :)
    await t.test('subtest /update-db status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/update-db',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.put().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /update-db")
            }

        })
    });


    //No pondremos un await ya que queremos que se ejecute el /update-db mientras se pasan los subtests
    await update_db_petition.then(async apiResponse => {


        await t.test('subtest /update-db Cisco IOS 15.0(1)M status 200', (t) => {

            var boolean_aux = false

            apiResponse.data.forEach(element => {

                if ((element.version == "IOS15.0(1)M") && (element.status == 200) && (element.info == "Se han actualizado correctamente los CVEs")) {
                    boolean_aux = true
                    assert.strictEqual(1, 1);
                }

            });

            if (boolean_aux == false) {
                assert.strictEqual(1, 2, "Error en la actualización Cisco IOS 15.0(1)M ha fallado")
            }

        });

        await t.test('subtest /update-db Fortinet FortiOS 7.4.0 status 200', (t) => {

            var boolean_aux = false

            apiResponse.data.forEach(element => {

                if ((element.version == "FortiOS7.4.0") && (element.status == 200) && (element.info == "Se han actualizado correctamente los CVEs")) {
                    boolean_aux = true
                    assert.strictEqual(1, 1);
                }

            });

            if (boolean_aux == false) {
                assert.strictEqual(1, 2, "Error en la actualización Fortinet FortiOS 7.4.0 ha fallado")
            }

        });

        await t.test('subtest /update-db HPE Comware 9.10.R91  status 400', (t) => {

            var boolean_aux = false

            apiResponse.data.forEach(element => {

                if ((element.version == "Comware 9.10.R91") && (element.status == 400) && (element.info == "Las versiones de Allied y de Comware no estan soportadas")) {
                    boolean_aux = true
                    assert.strictEqual(1, 1);
                }

            });

            if (boolean_aux == false) {
                assert.strictEqual(1, 2, "Error en la actualización HPE Comware 9.10.R91  ha fallado")
            }

        });
    })

})

/*
Batería de test para comprobar las peticiones update-version, add-version, delete, update-cves-one

Deberemos tener en la db las siguientes versiones:

    -Cisco IOS 15.0(1)M

Para el Testeo añadiremos una version de prueba 
    -HPE ArubaOS-Switch 15.16.0004 


*/


test('Peticiones API que modifican valores en la db', async (t) => {

    var url_add_arubaos = axios.create({

        baseURL: 'https://localhost:3000/add-version/arubaos-switch/15.16.0004/UNKNOWN/UNKNOWN',
        method: 'post',
        httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
            })
        

    })

    var url_delete_arubaos = axios.create({
        baseURL: 'https://localhost:3000/delete/arubaos-switch/15.16.0004',
        method: 'delete',
        httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

    })

    var url_config_arubaos = axios.create({
        baseURL: 'https://localhost:3000/update-db',
        method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
    })

    //Primero eleminaremos dicha versión de Aruba por si estuvierá

    await url_delete_arubaos.delete()

    //Ahora comenzaremos con los test

    //Bateria de test para comprobar /add-version/:soId/:versionId/:eoes/:eos

    await t.test('subtest /add-version/:soId/:versionId/:eoes/:eos status 200', async (t) => {

        await url_add_arubaos.post().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 200) && (apiResponse.data[0].info == "La versión nueva ha sido introducida con éxito")) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al introducir una nueva versión")
            }
        })
    });

    await t.test('subtest /add-version/:soId/:versionId/:eoes/:eos status 400(Ya existe una version con ese SO e identificador)', async (t) => {

        await url_add_arubaos.post().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Ya existe una version con ese SO e identificador")) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al comprobar que ya existe dicha version")
            }
        })
    });

    await t.test('subtest /add-version/:soId/:versionId/:eoes/:eos status 400(El tipo de SO no esta soportado)', async (t) => {

        var url_add_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/add-version/araos/15.16.0004/UNKNOWN/UNKNOWN',
            method: 'post',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_add_arubaos_2.post().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El tipo de SO no esta soportado")) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al comprobar el SO")
            }
        })
    });

    //Ahora comprobaremos la /update-version

    await t.test('subtest /update-version/:soId/:versionId/:eoes/:eos status 200', async (t) => {

        var url_update_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/update-version/arubaos-switch/15.16.0004/UNKNOWN/UNKNOWN',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_update_arubaos_2.put().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 200) && (apiResponse.data[0].info == "La versión ha sido actualizada con éxito")) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al actualizar la fecha")
            }
        })
    });

    //Para este test tenemo que eliminar la version y luego añadirla

    await url_delete_arubaos.delete()

    await t.test('subtest /update-version/:soId/:versionId/:eoes/:eos status 400(No existe ninguna version con ese SO, o no existe la versión, deberá añadirse primero)', async (t) => {

        var url_update_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/update-version/arubaos-switch/15.16.0004/UNKNOWN/UNKNOWN',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_update_arubaos_2.put().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "No existe ninguna version con ese SO, o no existe la versión, deberá añadirse primero")) {

                assert.strictEqual(1, 1)
            } else {

                assert.strictEqual(1, 2, "Fallo al comprobar que no existe la version")
            }
        })
    });

    //Volvemos a añadir la version

    await url_add_arubaos.post()

    await t.test('subtest /update-version/:soId/:versionId/:eoes/:eos status 400(El tipo de SO no está soportado)', async (t) => {

        var url_update_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/update-version/abaos/15.16.0004/UNKNOWN/UNKNOWN',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_update_arubaos_2.put().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El tipo de SO no está soportado")) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al comprobar el SO")
            }
        })
    });




    //Esperamos a que se realice la actualización

    await url_add_arubaos.post().then(async apiResponse => {

        await t.test('subtest /update-cves-one-version/:manufacturerId/:soId/:versionId status 200', async (t) => {

            var apiResponse_aux = await apiResponse

            if ((apiResponse_aux.status == 200)/* && (apiResponse_aux.data[0].status == 200) && (apiResponse_aux.data[0].info == "Se han actualizado correctamente los CVEs")*/) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al actualizar los CVEs")
            }
        })
    })





    await t.test('subtest /update-cves-one-version/:manufacturerId/:soId/:versionId status 400(La version y so no existen en la base de datos, prueba a añadirla primero)', async (t) => {

        await url_delete_arubaos.delete()

        var url_update_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/update-cves-one-version/Hewlett-Packard-Enterprise/arubaos-switch/15.16.0004',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_update_arubaos_2.put().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "La version y so no existen en la base de datos, prueba a añadirla primero")) {

                await url_add_arubaos.post()
                assert.strictEqual(1, 1)
            } else {

                await url_add_arubaos.post()
                assert.strictEqual(1, 2, "Fallo al comprobar que no existe la version")
            }
        })
    });

    await t.test('subtest /update-cves-one-version/:manufacturerId/:soId/:versionId status 400(El tipo de SO no esta soportado)', async (t) => {

        var url_update_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/update-cves-one-version/Hewlett-Packard-erprise/arubaos-switch/15.16.0004',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_update_arubaos_2.put().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El tipo de SO no esta soportado")) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al comprobar el SO")
            }
        })
    });

    await t.test('subtest /update-cves-one-version/:manufacturerId/:soId/:versionId status 400(Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD)', async (t) => {

        var url_update_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/update-cves-one-version/Hewlett-Packard-Enterprise/comware/9.10.R91 ',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_update_arubaos_2.put().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD")) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al comprobar Comware y Allied")
            }
        })
    });

    //Ahora comprobaremos que se elimina correctamente


    await t.test('subtest /delete/:soId/:versionId status 200', async (t) => {

        var url_delete_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/delete/arubaos-switch/15.16.0004',
            method: 'delete',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_delete_arubaos_2.delete().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 200) && (apiResponse.data[0].info == "La versión ha sido eliminada con éxito")) {

                assert.strictEqual(1, 1)
            } else {

                assert.strictEqual(1, 2, "Fallo al eliminar una version")
            }
        })
    });

    await t.test('subtest /delete/:soId/:versionId status 400(La versión que se quiere eliminar no se encuentra en la base de datos)', async (t) => {


        await url_delete_arubaos.delete().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "La versión que se quiere eliminar no se encuentra en la base de datos")) {

                await url_add_arubaos.post()
                assert.strictEqual(1, 1)
            } else {

                await url_add_arubaos.post()
                assert.strictEqual(1, 2, "Fallo al comprobar la no existencia de la versión")
            }
        })
    });

    await t.test('subtest /delete/:soId/:versionId status 400(El tipo de SO no está soportado)', async (t) => {


        var url_delete_arubaos_2 = axios.create({

            baseURL: 'https://localhost:3000/delete/aros/15.16.0004',
            method: 'delete',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })

        })

        await url_delete_arubaos_2.delete().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 400) && (apiResponse.data[0].info == "El tipo de SO no está soportado")) {

                assert.strictEqual(1, 1)
            } else {
                assert.strictEqual(1, 2, "Fallo al comprobar el SO")
            }
        })
    });



    await url_delete_arubaos.delete()

})


/*
Batería de test para comprobar que cuando se este actualizando una unica versión, nos devuelva un status 100 si pedimos info de esa actualización solo



*/

test('Actualizar una unica versión y comprobar que no podemos obtener info de esa version', async (t) => {

    var url_update_one = axios.create({

        baseURL: 'https://localhost:3000/update-cves-one-version/Hewlett-Packard-Enterprise/arubaos-switch/15.16.0004',
        method: 'put',
        httpsAgent: new https.Agent({
              
            rejectUnauthorized: false,
            
          })


    })

    var url_add_arubaos = axios.create({

        baseURL: 'https://localhost:3000/add-version/arubaos-switch/15.16.0004/UNKNOWN/UNKNOWN',
        method: 'post',
        httpsAgent: new https.Agent({
              
            rejectUnauthorized: false,
            
          })

    })

    var url_delete_arubaos = axios.create({
        baseURL: 'https://localhost:3000/delete/arubaos-switch/15.16.0004',
        method: 'delete',
        httpsAgent: new https.Agent({
              
            rejectUnauthorized: false,
            
          })

    })

    //Añadimos la version de prueba
    await url_add_arubaos.post()

    //Haremos un update one cves y luego eliminaremos la version de prueba

    var update_one = url_update_one.put()

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId status 100(El tipo de SO no está soportado)', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/arubaos-switch/versions/15.16.0004',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId")
            }

        })
    })

    //Inmediantamente despues haremos una petición de una version que no estemos actualizando 


    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {

            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].Version == "15.0(1)M")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la petición /manufacturer/:manufacturerId/:soId/versions de una version que no se está actualizando")
            }
        })
    })

    //Path ../vulnerabilities

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/arubaos-switch/versions/15.16.0004',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities")
            }

        })
    });


    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].Version == "15.0(1)M")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities")
            }

        })
    });


    //Path ../cvelist

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/arubaos-switch/versions/15.16.0004/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist")
            }

        })
    });

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].Version == "15.0(1)m")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la peticion de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist una version que no se esta actualizando")
            }

        })
    });


    //Path ../cvelist/:vulnerabilityId

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/arubaos-switch/versions/15.16.0004/vulnerabilities/cvelist/CVE-2016-2032',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId")
            }

        })
    });

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/CVE-2007-5548',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].Version == "15.0(1)m") && (apiResponse.data[0].CVE_id == "CVE-2007-5548")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la peticion de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId una version que no se esta actualizando")
            }

        })
    });


    //Path ../cvelist/risk?severity=XXX

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId/risk?severity=XXX status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/Hewlett-Packard-Enterprise/arubaos-switch/versions/15.16.0004/vulnerabilities/cvelist/severity/risk?severity=critical',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) && (apiResponse.data[0].info = "Se esta actualizando la base de datos")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId/risk?severity=XXX")
            }

        })
    });

    await t.test('subtest /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId/risk?severity=XXX status 200', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/manufacturers/cisco/ios/versions/15.0(1)M/vulnerabilities/cvelist/severity/risk?severity=critical',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.get().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].SO == "IOS") && (apiResponse.data[0].Version == "15.0(1)m")) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la peticion de /manufacturers/:manufacturerId/:soId/versions/:versionId/vulnerabilities/cvelist/:vulnerabilityId/risk?severity=XXX una version que no se esta actualizando")
            }

        })
    });

    /*
    Para esta parte del subtest tendfremos en cuenta aquellos path que pueden modificar la db menos /update-db



    */


    await t.test('subtest /add-version/:soId/:versionId/:eoes/:eos status 400(a existe una version con ese SO e identificador)', async (t) => {

        var url_add_config = axios.create({
            baseURL: 'https://localhost:3000/add-version/arubaos-switch/15.16.0004/UNKNOWN/UNKNOWN',
            method: 'post',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_add_config.post().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100) /*&& (apiResponse.data[0].info = "Ya existe una version con ese SO e identificador")*/) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /add-version/:soId/:versionId/:eoes/:eos")
            }

        })
    });

    await t.test('subtest /delete/:soId/:versionId status 100', async (t) => {

        var url_delete_config = axios.create({
            baseURL: 'https://localhost:3000/delete/arubaos-switch/15.16.0004',
            method: 'delete',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_delete_config.delete().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100)) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /delete/:soId/:versionId")
            }

        })
    });


    await t.test('subtest /update-version/:soId/:versionId/:eoes/:eos status 100', async (t) => {

        var url_config = axios.create({
            baseURL: 'https://localhost:3000/update-version/arubaos-switch/15.16.0004/UNKNOWN/UNKNOWN',
            method: 'put',
            httpsAgent: new https.Agent({
                  
                rejectUnauthorized: false,
                
              })
        })

        await url_config.put().then(async apiResponse => {


            if ((apiResponse.status == 200) && (apiResponse.data[0].status == 100)) {
                assert.strictEqual(1, 1)

            } else {

                assert.strictEqual(1, 2, "Error en la respuesta de espera de /update-version/:soId/:versionId/:eoes/:eos")
            }

        })
    });

    await update_one


})


