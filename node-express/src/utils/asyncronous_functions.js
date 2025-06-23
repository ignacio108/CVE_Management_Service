const cve_model = require("../mongo_models/cve_list_model")
const versions_model = require('../mongo_models/versions_model')
const vulnerabilitites_model  = require('../mongo_models/vulnerabilitites_model')
const mongoose = require('mongoose')
var escapere = require('escape-regexp');
var HashMap = require('hashmap');
const axios = require('axios');


//Contador del numero de peticiones al NVD

let contador = 0;

//Variable sobre el estado de la actualizacion

var actualizando_boolean=false;

//Variable para guardar el posible error que pueda generar la API del NVD
var error_nvd;

//Array para guardar las versiones que se estan actualizando solo para la ruta update-cves-one

var array_version_wait= []


//Map para asociar los cpe a los SO

var map_cpe = new HashMap();
//IMPORTANTE DE ESTO DEPENDERAN NUESTRAS PETICIONES A LA NVD
map_cpe.set("IOS", "cpe:2.3:o:cisco:ios:");
map_cpe.set("NX-OS", "cpe:2.3:o:cisco:nx-os:");
map_cpe.set("EXOS", "cpe:2.3:o:extremenetworks:exos:");
map_cpe.set("ArubaCX", "cpe:2.3:o:hpe:arubaos-cx:");
map_cpe.set("ArubaOS-Switch", "cpe:2.3:o:hpe:arubaos-switch:");
map_cpe.set("Comware", null);
map_cpe.set("FortiOS", "cpe:2.3:o:fortinet:fortios:");
map_cpe.set("AlliedWare Plus", null)

//Map para asociar los sistemas operativos a sus respectivos nombres en la db

var map_so_real = new Map()
    
map_so_real.set("ios", "IOS");
map_so_real.set("nx-os", "NX-OS");
map_so_real.set("exos", "EXOS");
map_so_real.set("arubacx", "ArubaCX");
map_so_real.set("arubaos-switch", "ArubaOS-Switch");
map_so_real.set("fortios", "FortiOS");
map_so_real.set("comware","Comware");
map_so_real.set("alliedware-plus","AlliedWare-Plus");

//Mapa para asociar a los so con sus correspondientes identificadores en la db

var map_so_id= new Map()

map_so_id.set("ios","IOS")
map_so_id.set("nx-os","NX-OS")
map_so_id.set("exos","EXOS")
map_so_id.set("arubacx","ArubaCX")
map_so_id.set("arubaos-switch","ArubaOS-Switch")
map_so_id.set("fortios","FortiOS")



//Mapa para aosciar los so con los nombres completos de los fabricantes
var map_manufacturers = new Map()

map_manufacturers.set("ios", "cisco");
map_manufacturers.set("nx-os", "cisco");
map_manufacturers.set("exos", "extreme-networks");
map_manufacturers.set("arubacx", "hewlett-packard-enterprise");
map_manufacturers.set("arubaos-switch", "hewlett-packard-enterprise");
map_manufacturers.set("comware", "hewlett-packard-enterprise");
map_manufacturers.set("alliedware-plus", "allied-telesis");
map_manufacturers.set("fortios", "fortinet");

//Necesitamos el map con los modelos

//Mapa para asociar los modelos con las colleciones
//Creamos este map porque una vez definidos por primera vez los modelos no los podemos volver a definir
var map_so = new Map();


//Tienes que añadir el resto de tablas
map_so.set('CVE_List_IOS', cve_model.ios);
map_so.set('CVE_List_NX-OS', cve_model.nx_os)
map_so.set('CVE_List_EXOS', cve_model.exos);
map_so.set('CVE_List_ArubaCX', cve_model.arubacx);
map_so.set('CVE_List_ArubaOS-Switch', cve_model.arubaos_switch);
map_so.set('CVE_List_FortiOS', cve_model.fortios);


/*
Función Get_actualizando_boolean()

Funcion con la que obtendremos el estado del sistema, si se est actualizando o no

Atributo:
    

Resultado:
    -Un boolean
*/

async function Get_actualizando_boolean() {

    return actualizando_boolean
    
}

/*
Función Set_actualizando_boolean(state)

Funcion con la que establecerremos el valor de el boolean actualizando

Atributo:
    -state

Resultado:
    
*/

async function Set_actualizando_boolean(state) {

    if(typeof state == "boolean"){

        actualizando_boolean = state


    }else{
        console("Como es posible que hayas llegado a este else?¿?¿?")

    }
    
}

/*
Función version_check(versionId))

Función para comprobar si una versión existe en la db

Atributo:
    -versionId
    -soId

Resultado:

boolean
    
*/


async function version_check(soId,versionId) {

    return new Promise(async function(resolve){

        await versions_model.find({ $and: [{ SO: { $regex: `^${soId}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(versionId)}$`, $options: 'i' } }] }).then(async function (aux) {
    
            var aux_promise= await aux
    
            if(aux_promise.length==0){
                resolve(false)
            }else{
                resolve(true)
            }
    
        }).catch(function (err) {
            console.log(err)
        })
        

    })



}


/*
Función list_so_versions()

Funcion con la que obtendremos un array con las versiones y sus SO correspondientes

Atributo:
    

Resultado:
    -Un array con los so y versiones de nuestra mongodb
*/



async function list_so_versions() {

let results
    
    await versions_model.find({}).then(async function (aux) {

        let lista_promise = await aux.map(async col => {
            return {
                version: col.Version,
                so: col.SO
            }


        });

        results = await Promise.all(lista_promise)
    })

return results;
    
}

/*
Función db_collections 

Función que nos devuleve las collecciones con su numero de documentos

Atributo:


Resultado:
    -Un array con el nombre de la colleccion y su numero de documentos
*/

async function db_collections() {

    return new Promise(async function (resolve){

        await mongoose.connection.listCollections()
        .then(async collections => {
            const promises = collections.map(async col => {
    
                return {
                    col: col.name,
                    count: await mongoose.connection.collection(col.name).countDocuments()
                };
            });
            //console.log(await Promise.all(promises))

            
            resolve(await Promise.all(promises))
        })

    })

  
    
}


/*
Función params_association

Función para asociar los parametros de la petición en concreto soId y manufacturerId, con los nombre de las coleccines correspondientes.

Atributo:
    -soId
    -manufactuerId

Resultado:
    -Un array con el nombre que le correspondería a la coleccion CVE_List_"Texto de ejemplo".
    -un boolean si se ha encontrado dicha coleccion en la base de datos.
*/


async function params_association(soId,manufacturerId) {


        var aux1=await db_collections()

    
        
        //Todas se incluyen en minusicula para poder compararlas con req.params.manufacturersId
    
    
        var so=soId.toLowerCase()
        var manufacturer= manufacturerId.toLowerCase()
    
        var result;
    
        fullname = 'CVE_List_' + so;
    
        result = [fullname, false]
    
        
    
        //Con este if comprobaremos si realmente un so va asociado a nuestra version en caso de que no sea asi acabaremos eventualmente devolviendo un 404
    
        if( map_manufacturers.get(so)==manufacturer){
    
        //Bucle para recorrer todas las colecciones que tenemos en la base de datos
        aux1.forEach(element => {

            if((soId=="comware") || (soId=="alliedware-plus")){

                fullname=element.col
                
                return result = [fullname, true]

            }
            
    
            if (element.col.toLowerCase() == fullname.toLowerCase()) {
    
                fullname=element.col
                
                return result = [fullname, true]
    
            }
        });
    
        }
    
        //console.log(resolve(result))
        //console.log(result)
    
        return result
            

}


/*
Función sleep(ms = 0)

Función sleep equivalente de otro lenguajes como python o java

Atributo:
    -ms

Resultado:
    -Una promesa que se quedará sin ejecutar código durante el tiempo que hayamos pasado como parámetro en ms
*/


function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
Función main (lista)

Función para asociar hacer llamadas de forma asincrona y esperar a que estas ser terminen para continuar

Atributo:

    -lista

Resultado:
    -POR DETERMINAR
*/

async function main(lista) {

    return new Promise(async function(resolve){

        var resultado_final= []

        let start1 = performance.now()

        for (let index = 0; index < lista.length; index++) {
          
            //Tecnicamente deberiamos esperar unos segundos por petición a la NVD para que no empiece a devolver 500, en teoria dicen que hay que poner 6s de espera por petición
            //Pero como el algoritmo ya tarda tiempo pues me lo salto.
           
            
            const element = lista[index];

            //Si el so es comware o alliedo nos lo saltamos directamente :)

            if((element.so.toLowerCase()=="comware")||(element.so.toLowerCase()=="alliedware-plus")){
                console.log("Nos saltamos Comware y Allied")

                //Mensaje de salida despues de realizar el update
                //Comware y Allied no estan soportadas
                var respuesta_aux={status:400,version:element.so+element.version,info:"Las versiones de Allied y de Comware no estan soportadas"}
                resultado_final.push(respuesta_aux)
                continue;
            }


            /*
            Estamos recorriendo el nuestra db las versiones que tenemos, a partir de hay obtenemos por orden una por una las cves de la NVD y las de nuestra db
            Haciendo uso de promesas para mantener el orden,
    
            */
    
            
            //Obtenemos los CVES de nuestra mongodb
            var mongodb_cvelist = await cves_obtain(element)

            
            
            //Obtenemos los CVES de la NVD
            var nvd_cvelist = await nvd_unique_petition(element)

            if(nvd_cvelist==null){

                resultado="Esta version " + element.so+element.version +"no se encuentra en la NVD"+error_nvd

                console.log(resultado)

                var respuesta_aux={status:400,version:element.so+element.version,info:"Hubo un problema con la petición a la API de la NVD"+error_nvd}

                resultado_final.push(respuesta_aux)


                console.log(resultado)

                await sleep(1000)
                
                continue;
                
            }else if(nvd_cvelist.size==0){
                
                resultado = await warning_end(element.so, element.version);
                console.log(resultado)

                //SI no existen vulnerabilidades asociadas a esa version continuaremos con la ejecución
                var respuesta_aux={status:200,version:element.so+element.version,info:"No hay CVE asociadas a este version en la NVD"}

                resultado_final.push(respuesta_aux)

                await sleep(1000)

                continue;

            }

            
            //Actualizaremos nuestra collecion Vulnerabilities, pasaremos como parámetro el array de las vulnerabilidades del NIST 

           await number_vul_update(element,nvd_cvelist)
    
            //Comprobaremos si nuestra varaible mongodb_cvelist esta vacia, es decir si una coleccion esta vacia habrá primero que introducir la primera tanda de cves
            
            //let timeTaken1_update_cves= performance.now()
            await update_cves(nvd_cvelist,mongodb_cvelist,element.version,element.so)
            //let timeTaken2_update_cves=performance.now() - timeTaken1_update_cves
           
            //POdemos incremetnar el tiempo de este sleep sumandole el timeTaken2_update_cves para debugear
            await sleep(1000)
            
            var respuesta_aux={status:200,version:element.so+element.version,info:"Se han actualizado correctamente los CVEs"}

            resultado_final.push(respuesta_aux)
    
            resultado = await warning_end(element.so, element.version);
            console.log(resultado)
           
            
        }

        resolve(resultado_final)

        //Reseteamos el contador una vez se haya acabado el proceso de actualizacion
        contador = 0;

        console.log("Ha tardado el alogritmo de actualizacion "+ (performance.now()-start1)/1000 + "segundos")

        
        return resultado_final

    })

}



/*
Función petition(cpeNameId)

Realiza una peticion a la api del nvd utilizando un cpeNameId como identificador y agrupa los datos como deseamos

Atributo:
    -cpeNameId
    

Resultado:
    -Devuleve un map con el los datos de nuestra peticion a la API del NVD
*/


async function petition(cpeNameId) {

    var map = new HashMap();

    var url_config = axios.create({
        baseURL: 'https://services.nvd.nist.gov/rest/json/cves',
        //FALLO DE SEGURIDAD PASAR EL CODIGO DE NUESTRA API-KEY EN PLANO ¡REQUIRE MEJORA!
        //headers: { 'apikey': 'cad5ee03-6f22-4373-bbcf-b1478c16209b' }
        headers: { 'apikey': process.env.PERSONAL_NVD_API_KEY }
    
    });

    

    //console.log('2.0?cpeName='+`${cpeNameId}`)

    var vul_array;

    

    /*
    IMPORTANTE 

    Para las versiones que tienen parentesis no debes meter el cpe name si no una modificacion de este:
    
    cpe:2.3:o:cisco:ios:15.0\(1\)m11:*:*:*:*:*:*:*
    cpe:2.3:o:cisco:ios:15.0.1.m11:*:*:*:*:*:*:*

    Y por alguna razon cuando lo buscas en la web tiene mas resultados que en la API, la gran mayoria de CVEs coinciden, ¿Puede ser porque sea una versión vieja?
    ¿Será porque son unos vagos y les da pereza revisar si la API tiene todas las CVEs que muestra la web? Pero las ultimas CVEs si estan actualizadas ?¿??¿?¿?

    */


    //PROBLEMA CON LA ASINCRONIDAD DE JS 
    //SOLUCIÓN https://www.geeksforgeeks.org/how-to-make-javascript-wait-for-a-api-request-to-return/


    //FALTA POR HACER LA DESCRIPCIÓN DE LA FUNCIÓN

    let start1 = performance.now()

    return new Promise (function(resolve){
        url_config.get('2.0?cpeName='+`${cpeNameId}`)
        .then(apiResponse => {



            let timeTaken1 = performance.now() - start1

            vul_array = apiResponse.data.vulnerabilities;



            for (let i = 0; i < vul_array.length; i++) {


                //Cuidado en este if solo estamos comprobando si exsite una cvss score HIGH para la version cvssMetricV2, también deberemos comprobar para la versión 3
                //Pero si existe en ambas tendriamos duplicados (ten en cuenta esta variable), en al V2 no existe CRITICAL y el NIST dejo de darles soporte y generarlas en 2022

                /*
                Atributos de nuestro Hashmap

                Key:
                -CVE_ID

                Value: Un array con la siguiente información

                -cvssVersion
                -cvssbaseScore
                -cvssbaseSeverity
                -cvssexploitabilityScore
                -cvssimpactScore
                -url
                -description_ES

                */


                //SI existe una versión v3.0 obtendremos solo info de esa, si no existe obtenemos la info de la v2, si existe la v3.1 usaremos esa ya que si la v3.1 existe la v3.0 tendrá valores nulos
                if ((vul_array[i].cve.metrics.cvssMetricV30 != null) || (vul_array[i].cve.metrics.cvssMetricV31 != null)) {

                    //Codigo correspondiente a la descripción 

                    var aux_descripcion = "N/A";

                    if (vul_array[i].cve.descriptions[1] != null) {
                        aux_descripcion = vul_array[i].cve.descriptions[1].value;
                    }
                    
                    else{
                        //Si no esta en español la pondremos en ingles
                        aux_descripcion = vul_array[i].cve.descriptions[0].value;
                    }

                    
                    //Si existe versión v3.1 utilizaremos esa en vez de la v3.0 y si no usaremos la v3.0

                    if (vul_array[i].cve.metrics.cvssMetricV31 != null) {

                        map.set(vul_array[i].cve.id, [
                            vul_array[i].cve.metrics.cvssMetricV31[0].cvssData.version,
                            vul_array[i].cve.metrics.cvssMetricV31[0].cvssData.baseScore,
                            vul_array[i].cve.metrics.cvssMetricV31[0].cvssData.baseSeverity,
                            `https://nvd.nist.gov/vuln/detail/${vul_array[i].cve.id}`,
                            aux_descripcion
                        ])

                    } else {

                        map.set(vul_array[i].cve.id, [
                            vul_array[i].cve.metrics.cvssMetricV30[0].cvssData.version,
                            vul_array[i].cve.metrics.cvssMetricV30[0].cvssData.baseScore,
                            vul_array[i].cve.metrics.cvssMetricV30[0].cvssData.baseSeverity,
                            `https://nvd.nist.gov/vuln/detail/${vul_array[i].cve.id}`,
                            aux_descripcion
                        ])


                    }


                } else {

                    //Código correspondiente a la descripción
                    var aux_descripcion = "N/A";

                    if (vul_array[i].cve.descriptions[1] != null) {
                        aux_descripcion = vul_array[i].cve.descriptions[1].value;
                    }

                    //Código para guardar los valores de la cvss v2.x

                    map.set(vul_array[i].cve.id, [
                        vul_array[i].cve.metrics.cvssMetricV2[0].cvssData.version,
                        vul_array[i].cve.metrics.cvssMetricV2[0].cvssData.baseScore,
                        vul_array[i].cve.metrics.cvssMetricV2[0].baseSeverity,
                        `https://nvd.nist.gov/vuln/detail/${vul_array[i].cve.id}`,
                        aux_descripcion
                    ])


                }



                /*
                   if((vul_array[i].cve.metrics.cvssMetricV2[0].baseSeverity == 'HIGH' || vul_array[i].cve.metrics.cvssMetricV2[0].baseSeverity == 'CRITICAL')){
    
                    var aux_descripcion="N/A";
    
                    if(vul_array[i].cve.descriptions[1]!=null){
                        aux_descripcion=vul_array[i].cve.descriptions[1].value;
                    }
    
    
                    //console.log(`CVE con id: ${vul_array[i].cve.id} tiene un nivel de vulnerabilidad ${vul_array[i].cve.metrics.cvssMetricV2[0].baseSeverity} `)
                    map.set(vul_array[i].cve.id, [vul_array[i].cve.metrics.cvssMetricV2[0].baseSeverity,vul_array[i].cve.metrics.cvssMetricV2[0].cvssData.baseScore,`https://nvd.nist.gov/vuln/detail/${vul_array[i].cve.id}`,aux_descripcion])//.push(vul_array[i].cve.metrics.cvssMetricV2[0].baseSeverity);
                    //onsole.log(map)
                    
                   }
                   */
            }
            
            

            
            console.log("Ha tardado la API REQUEST " + timeTaken1 / 1000 + "segundos")
            

            

            resolve(map)



        })
        .catch(err => {
            console.log("Ha ocurrido un error al obtener los datos de la NVD"+err+"  (Conosole.log en la funcion petition)")
            error_nvd=err;
            resolve(null)
            
            
        })


    })
    

       


}


/*
Función cpenameGet(map_versiones) 

Función para asociar nuestras versiones y sistemas operativos con su correspondiente CPE_name.

Atributo:
    -so
    -version

Resultado:
    -Un string con el cpe correspondiente a dicha version
*/


function cpenameGet(so, version) {

    /*

    Segun la NVD para poder realizar peticiones de aquellas versiones que contengan parentesisi habrá que codificar a utf-8 SOLO la version

    */

    /*
    Hay un problema: Cuando realizamos una peticion a la API está no diferencia entre \ y / Debido a esto tendremos que introducir las versiones con parentesis en la mongodb sin el \
    Y hacer un for para que introduzca dicha \ antes de cada parentesis

    */

    var version_split = version.split("")



    if (version_split.includes('(')) {

        var version_split_aux = version_split

        for (let index = 0; index < version_split.length; index++) {
            const element = version_split[index];


            if (element == '(') {

                version_split_aux.splice(index, 0, '\\')
                index++


            } else if (element == ')') {

                version_split_aux.splice(index, 0, '\\')
                index++

            }

        }

        version_split = version_split_aux

        version = version_split.join("")



    }


    //Tenemos que codificar el componente de la version para poder acceder a aquellas que tengan carácteres especiales

    let version_aux = version.toLowerCase()

    let version_encoded_1 = encodeURIComponent(version_aux)

    //let version_encoded_2= version_encoded_1.replace("(",'%5C(').replace(")",'%5C)')

    //console.log(version_encoded_2)


    let version_string = version_encoded_1 + ":*:*:*:*:*:*:*"

    let resultado;


    if (map_cpe.has(so)) {

        resultado = map_cpe.get(so) + version_string;

    } else {
        resultado = "NO_SE_HA_ENCONTRADO_UN_SO_ASOCIADO_A_UN_CPE"
    }

    

    return resultado

}

/*
Función nvd_unique_petition(element)

Realiza una peticion a la api del nvd utilizando un element como identificador tambien implementa un contador para no exceder las 50 peticiones cada 30 segundos

Atributo:
    -element (Un SO y una version)
    

Resultado:
    -Devuleve una promesa con el valor de nuestra petición a la API de NIST
*/



async function nvd_unique_petition(element) {

    return new Promise(async function (resolve) {

        //Incluiremos un contador para no exceder el criterio del NVD de no hacer mas de 50 peticiones por 30s
        if (contador == 50) {

            //let timeTake1 = performance.now()
            await sleep(6000);
            //let timeTaken2 = performance.now();

            //var tiempo_consumido = timeTake1 - timeTaken2;

            //console.log(tiempo_consumido + "segundos transcurridos")

            contador = 0;

            

            var aux = await petition(cpenameGet(element.so, element.version))
           

            contador++;


            resolve(aux)

        } else {

            contador++;


            var aux = await petition(cpenameGet(element.so, element.version))

            resolve(aux)

        }
    })
}

/*
Función cves_obtain(lista)

Devuelve un Array con los CVES asociado a un so

Atributo:
    -lista(array con dos elementos el so y la version)

Resultado:
    -String con info sobre el fin de la actualización del so y la versión
*/


async function cves_obtain(lista) {

    let resultado

    return new Promise(async function(resolve){

        //Queda muy chapucero esto pero como la coleccion Versiones no tiene como atributo el fabricante tengo que sacarlo de alguna parte,
        //Se podria hacer dinamicamente sacandolo de la coleccion manufacturer y comparandolo con en valor soId pero la funcion pac(so,manufacturer)
        //Necesita de alguna manera obtener el fabricante. Usaremos el mapa map_manufacturers

        var array_cves
        
        //Obtenemos valores sobre la colleccion y si dicho so tiene una colleccion y el nombre de dicha coleccion
        var params_associate_collection_aux=await params_association(lista.so,await map_manufacturers.get(lista.so.toLowerCase()))
        

        if (params_associate_collection_aux[1]) {

            //Busca en nuestro hasmap si existe dicha colección y si es asi toma su modelo.


            await map_so.get(params_associate_collection_aux[0]).find({ SO: { $regex: `^${lista.so}$`, $options: 'i' } }).then(async function (aux) {
                array_cves = await aux

                resultado=resolve(array_cves)


            }).catch(function (err) {
                console.log(err)
            })

        } else {
            resultado=resolve()
        }

        return resultado

    })

}

/*
Función update_cves(nvd_array,mongodb_array,version,so)

Recorrera el map del nvd, y cada cve será buscada en el array de cves de nuestra mongodb, si dicho cve(nvd) no está se creará y se añadirá, si dicho cve está pero no la versión
en concreto se añadirá la version y se actualizarán sus valores, y si dicho cve esta con la version del so incluida solo se actualizará

Atributo:
    -nvd_array(cves de una version del nvd)
    -mongodb_array(cves de una version del mongodb)
    -version(numero de version)
    -so(sistema operativo)

Resultado:
    -String con info sobre el fin de la ejecucion de la funcion
*/

async function  update_cves(nvd_array,mongodb_array,version,so){

    let resultado_final

    return new Promise(async function(resolve){


       //For each para recorrer el hasmap de la nvd array

        nvd_array.forEach(async function(value,key) {

            //console.log(key)
            

            /*
            Por cada CVE_id de la nvd_array me recorro todo mi array de cves del SO concreto
            
            Por ejemplo:
                -Si estoy comprobando las cve de cisco ios 15.9, obtendremos los cves de esa version y recorreremos la coleccion CVE_List_IOS en busca
                de los cves de la nvd, por cada cve de la nvd recorreremos el array entero pra comprobar si efectivamente está
            */
          
            

            //Variable para comprobar si nuestro cve esta en la mongodb    
            var cve_appears_and_version=false;
            //Variable para comprobar si nuesto cve esta en la mongodb pero dicho cve no tiene asociada nuestra version
            var cve_appears_version_is_not_included=false;

            
            //console.log(value )


            //Recorremos nuestro array en la mongodb buscando un CVE concreto

            for (let index = 0; index < mongodb_array.length; index++) {
                const element = mongodb_array[index];
                //console.log(element)

                 //Esta variable nos dará las versiones del cve que estan en nuestra mongodb
                 var array_versiones_mongodb= element.Version

                 //console.log(boolean_aux)
                 
 
                 //Si el cveid coincide con alguno de nuestra mongodb, comprobará si el array versiones contiene dichas version si no la contiene habrá que incluir la version
                 //En caso de que ninguno se cumpla simplemente añadiremos dicho CVE   
               
                 if((element.CVE_id==key )){
          
                    if(array_versiones_mongodb.includes(version.toLowerCase())){
                        cve_appears_and_version=true;
                        break

                    }else{

                        cve_appears_version_is_not_included=true;
                        break

                    }
                    
                 }
                
            }
            //Si el cve está e incluye la version no haremos nada

            if(cve_appears_and_version){

                resultado ="cve_appears_and_version"
                //Actualizamos el contenido del CVE menos la Version de los SO asociados 
                //al CVE
                await update_cve_info(value,key,version,so)
                //console.log(resultado)
                resultado_final=resolve(resultado)


            }
            //Si esta el cve pero no la version añadiremos al array versiones nuestra version

            else if(cve_appears_version_is_not_included){

                
                resultado= await add_cve_version(value,key,version,so)
                await update_cve_info(value,key,version,so)
                //console.log("cve_appears_version_is_not_included")
                resultado_final=resolve(resultado)
                

            }
            //Finalmente si no esta el cve y obviamnente tampoco esta la version se añadirá dicho cve
            
            else {

               
                
                resultado = await add_cve(value, key, version, so);
                //console.log("Se añade a la db")
                resultado_final=resolve(resultado)

            }

            return resultado_final
        });
    })
}

/*
Función async function update_cve_info(cve_data, cve_key, version, so)

Buscará el modelo correspondiente la versión y actualizará el resto de valores de la CVE menos la Version

Atributo:
    -cve_data(los datos de un cve sacados del nvd)
    -cve_key(clave del CVE)
    -version
    -so

Resultado:
    -actualiza los valores del CVE
*/

async function update_cve_info(cve_data, cve_key, version, so) {
    var resultado;

    new Promise(async function (resolve) {

        //Comprobación del SO y la version

        var params_associate_collection_aux=await params_association(so,await map_manufacturers.get(so.toLowerCase()))

        if (params_associate_collection_aux[1]) {


            //Actualizamos la nformación del CVE menos las Versiones
            
            await map_so.get(params_associate_collection_aux[0]).updateOne({ CVE_id: { $regex: `^${cve_key}$`, $options: 'i' } },{ cvssVersion: cve_data[0], cvssbaseScore: cve_data[1], cvssbaseSeverity: cve_data[2], description_ES: cve_data[4]}).then(async function (aux) {
           
                resolve()

            }).catch(function (err) {
                console.log(err)
            })
            

        } else {
            res.status(404).end()
        }
        resolve(resultado)
    })
    return resultado
}



/*
Función async function add_cve(cve_data, cve_key, version, so)

Buscará el modelo correspondiente a la version y el so y añadirá dicho cve a la colección correspondiente

Atributo:
    -cve_data(los datos de un cve sacados del nvd)
    -cve_key(clave del CVE)
    -version
    -so

Resultado:
    -añade dicho cve a la mongodb
*/

async function add_cve(cve_data, cve_key, version, so) {

    var resultado;

    await new Promise(async function (resolve) {

        //Queda muy chapucero esto pero como la coleccion Versiones no tiene como atributo el fabricante tengo que sacarlo de alguna parte,
        //Se podria hacer dinamicamente sacandolo de la coleccion manufacturer y comparandolo con en valor soId pero la funcion pac(so,manufacturer)
        //Necesita de alguna manera obtener el fabricante.
       
        //Comprobación del SO y la version

        var params_associate_collection_aux=await params_association(so,await map_manufacturers.get(so.toLowerCase()))

        //console.log(await pac(so,await map_manufacturers.get(so.toLowerCase())))

        if (params_associate_collection_aux[1]) {
            
            //Vale no podemos usar el hasmap para crear directamente el nuevo modelo tenemos que hacer una busqueda en el map para comprobar si el modelo == nombre y luego crear el documento

            switch (params_associate_collection_aux[0]) {
          
            case('CVE_List_IOS'):

                var new_cve_document =new cve_model.ios({
                    _id: new mongoose.Types.ObjectId(),
                    SO: so,
                    Version: [version.toString()],
                    CVE_id: cve_key,
                    cvssVersion: cve_data[0],
                    cvssbaseScore: cve_data[1],
                    cvssbaseSeverity: cve_data[2],
                    url: cve_data[3],
                    description_ES: cve_data[4],
                })
    
                resultado=resolve(await new_cve_document.save())

                break;

            case('CVE_List_NX-OS'):

                var new_cve_document =new cve_model.nx_os({
                    _id: new mongoose.Types.ObjectId(),
                    SO: so,
                    Version: [version.toString()],
                    CVE_id: cve_key,
                    cvssVersion: cve_data[0],
                    cvssbaseScore: cve_data[1],
                    cvssbaseSeverity: cve_data[2],
                    url: cve_data[3],
                    description_ES: cve_data[4],
                })
    
                resultado=resolve(await new_cve_document.save())

                break;
                
            case('CVE_List_EXOS'):

                var new_cve_document =new cve_model.exos({
                    _id: new mongoose.Types.ObjectId(),
                    SO: so,
                    Version: [version.toString()],
                    CVE_id: cve_key,
                    cvssVersion: cve_data[0],
                    cvssbaseScore: cve_data[1],
                    cvssbaseSeverity: cve_data[2],
                    url: cve_data[3],
                    description_ES: cve_data[4],
                })
    
                resultado=resolve(await new_cve_document.save())

                break;

            case('CVE_List_ArubaCX'):

                var new_cve_document =new cve_model.arubacx({
                    _id: new mongoose.Types.ObjectId(),
                    SO: so,
                    Version: [version.toString()],
                    CVE_id: cve_key,
                    cvssVersion: cve_data[0],
                    cvssbaseScore: cve_data[1],
                    cvssbaseSeverity: cve_data[2],
                    url: cve_data[3],
                    description_ES: cve_data[4],
                })
    
                resultado=resolve(await new_cve_document.save())

                break;

            case('CVE_List_ArubaOS-Switch'):

           
                var new_cve_document =new cve_model.arubaos_switch({
                    _id: new mongoose.Types.ObjectId(),
                    SO: so,
                    Version: [version.toString()],
                    CVE_id: cve_key,
                    cvssVersion: cve_data[0],
                    cvssbaseScore: cve_data[1],
                    cvssbaseSeverity: cve_data[2],
                    url: cve_data[3],
                    description_ES: cve_data[4],
                })
    
                resultado=resolve(await new_cve_document.save())

                break;

            case('CVE_List_FortiOS'):

                var new_cve_document =new cve_model.fortios({
                    SO: so,
                    Version: [version.toString()],
                    CVE_id: cve_key,
                    cvssVersion: cve_data[0],
                    cvssbaseScore: cve_data[1],
                    cvssbaseSeverity: cve_data[2],
                    url: cve_data[3],
                    description_ES: cve_data[4],
                })

                resultado=resolve(await new_cve_document.save())

                break;
    
            }
        }else {
            resolve(end())
        }
    })
    return resultado
}


/*
Función async function add_cve_version(cve_data, cve_key, version, so)

Buscará el modelo correspondiente a la version y el so y añadirá a dicho cve la version

Atributo:
    -cve_data(los datos de un cve sacados del nvd)
    -cve_key(clave del CVE)
    -version
    -so

Resultado:
    -añade dicha version a un cve existente
*/

async function add_cve_version(cve_data, cve_key, version, so) {

    var resultado;

    new Promise(async function (resolve) {

        //Queda muy chapucero esto pero como la coleccion Versiones no tiene como atributo el fabricante tengo que sacarlo de alguna parte,
        //Se podria hacer dinamicamente sacandolo de la coleccion manufacturer y comparandolo con en valor soId pero la funcion pac(so,manufacturer)
        //Necesita de alguna manera obtener el fabricante.

        //Definimos el schema para su uso en los middlewares

        //Comprobación del SO y la version

        var params_associate_collection_aux=await params_association(so,await map_manufacturers.get(so.toLowerCase()))

        if (params_associate_collection_aux[1]) {

            await map_so.get(params_associate_collection_aux[0]).updateOne({ CVE_id: { $regex: `^${cve_key}$`, $options: 'i' } },{$push: { Version: version.toLowerCase()}}).then(async function (aux) {
           
                resolve()

            }).catch(function (err) {
                console.log(err)
            })

        } else {
            res.status(404).end()
        }
        resolve(resultado)
    })

    return resultado

}

/*
Función number_vul_update(element,nvd_cvelist)

Actualizará los documentos para añadir el número de vulnerabilidades criticas y graves

Atributo:
    -so
    -version

Resultado:
    -String con info sobre el fin de la actualización del so y la versión
*/

async function  number_vul_update(element, nvd_cvelist) {

    var resultado_final

    var params_associate_collection_aux=await params_association(element.so,await map_manufacturers.get(element.so.toLowerCase()))
    

    new Promise(async function (resolve) {


        if (params_associate_collection_aux[1]) {


            var number_map = new Map()

            number_map.set('critical', 0)
            number_map.set('high', 0)
            number_map.set('medium', 0)
            number_map.set('low', 0)


            await vulnerabilitites_model.find({ $and: [{ SO: { $regex: `^${element.so}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(element.version)}$`, $options: 'i' } }] }).then(async function (aux) {

                var vulnerabilitites_number = await aux

                //Contaremos el numero de vulnerailidades segun su severity y las guardaremos cuantas hay en un map auxiliar

                await nvd_cvelist.forEach(element => {

                    var key_aux = element[2].toLowerCase()

                    let new_value = number_map.get(key_aux)

                    number_map.set(element[2].toLowerCase(), new_value + 1)
                });

                //console.log(number_map)

                var num_critical = number_map.get("critical")
                var num_high = number_map.get("high")
                var num_medium = number_map.get("medium")
                var num_low = number_map.get("low")


                if (vulnerabilitites_number.length == 0) {

                    var new_vulnerabilities_document =new vulnerabilitites_model({
                        SO: element.so,
                        Version: element.version,
                        Critical: num_critical,
                        High: num_high,
                        Medium: num_medium,
                        Low: num_low
                    })
    
                    
                    await new_vulnerabilities_document.save()

                    resultado_final= resolve(200)


                } else {

                    const doc = await vulnerabilitites_model.findOneAndUpdate({ $and: [{ SO: { $regex: `^${element.so}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(element.version)}$`, $options: 'i' } }] }, { Critical: num_critical, High: num_high, Medium: num_medium, Low: num_low })


                    await doc.save()

                    //const doc= await vulnerabilitites_model.findOneAndUpdate({Version: '15.9' },{Critical: 3},{new: true})

                    //console.log(doc)

                    //await doc.save()

                    resultado_final = resolve(200)
                }
            }).catch(function (err) {
                console.log(err)
                resultado_final = resolve(400)
            })

        }
    })
    return resultado_final
}

/*
Función async function delete_version_versions(so,version)

Elimina una version de la coleccion Versions que tenga un so y una version determinada

Atributo:
    -so
    -version

Resultado:
    -200 despues de haberse ejecutado
*/


async function delete_version_versions(so,version) {

    let resultado_final

    return new Promise (async function(resolve){
        
        await versions_model.deleteOne({$and :[{ SO: {$regex: `^${so}$`, $options: 'i'} }, { Version: {$regex: `^${escapere(version)}$`, $options: 'i'} }]})

        resultado_final==200

        resolve(resultado_final)

    })
}

/*
Función async function delete_version_vulnerabilities(so,version)

Elimina una version de la coleccion Versions que tenga un so y una version determinada

Atributo:
    -so
    -version

Resultado:
    -200 despues de haberse ejecutado
*/

async function delete_version_vulnerabilities(so,version){

    let resultado_final

    return new Promise( async function (result) {

        await vulnerabilitites_model.deleteOne({$and :[{ SO: {$regex: `^${so}$`, $options: 'i'} }, { Version: {$regex: `^${escapere(version)}$`, $options: 'i'} }]})

        resultado_final=200
        

        result(resultado_final)
    })


}

/*
Función async function delete_version_cvelist(so,version)

Elimina una version de la coleccion Versions que tenga un so y una version determinada

Atributo:
    -so
    -version

Resultado:
    -200 despues de haberse ejecutado
*/

async function delete_version_cvelist(so,version) {

    var resultado_final;

    //Comprobamos el SO y la version

    var params_associate_collection_aux=await params_association(so,await map_manufacturers.get(so.toLowerCase()))

    new Promise(async function (resolve) {

        //Queda muy chapucero esto pero como la coleccion Versiones no tiene como atributo el fabricante tengo que sacarlo de alguna parte,
        //Se podria hacer dinamicamente sacandolo de la coleccion manufacturer y comparandolo con en valor soId pero la funcion pac(so,manufacturer)
        //Necesita de alguna manera obtener el fabricante.

        //Comprobación del SO y la version

        if (params_associate_collection_aux[1]) {

            //Buscaremos el modelo asociado a nuestro so 


            map_so.get(params_associate_collection_aux[0]).find({ Version: {$regex: `^${escapere(version)}$`, $options: 'i'} }).then(async function(aux){
            
                var response= await aux


                for (let index = 0; index < response.length; index++) {
                    const element = response[index];

                    const cve_key= element.CVE_id

                  
                    
                    if(element.Version.length>1){

                        //Obtenemos el cve_id
                        

                        
                        //array de versiones de dicho cve
                        const versions_array= element.Version


                        //obtenemos la posicion de nuestras version en el array
                        var index_version=versions_array.indexOf(version.toLowerCase())
                        
                    
                        //eliminamos dicha version del array
                        versions_array.splice(index_version,1)

                    

                        //Actualizamos el cve quitando la version
                        const doc = await map_so.get(params_associate_collection_aux[0]).findOneAndUpdate({ CVE_id: cve_key }, { Version: versions_array })


                        await doc.save()

                        resultado_final=200
                        

                    }else if ((element.Version.length==1)&&(element.Version[0].toLowerCase()==version.toLowerCase())){

                        //Si el cve solo tiene una version lo eliminaremos y su version coincide con la que tenemos


                        await map_so.get(params_associate_collection_aux[0]).deleteOne({ CVE_id: cve_key })

                        resultado_final=200
                    } 
                }
            })
        }
        resolve(resultado_final)
    })

    return resultado_final
}
/*
Función update_unique(so, version)

Actualizará en nuestra db la información obtenida respecto a la base de datos del NIST para una única version

Atributo:
    -so
    -version

Resultado:
    -Devuleve un array con información del estado de actualización de la unica version introducida
*/


async function unique_update(so,version) {


    //En esencia invocará a la función main que es la encargada de realizar todo el proceso de actualización

    console.log("Actualizando: "+"SO: "+so+"Version:"+version )

    //Fue necesrio crear otro mapa que asociara los SO como estan creado en la monogodb ya que sino no funcionaba si insertamos un so que no sea exatamente el mismo
    //Que en la db

    var version_aux=version.toLowerCase()
    var so_aux=map_so_id.get(so.toLowerCase())



    var aux_version_info= [{version: version_aux,so: so_aux}]
 
    var main_execution=await main(aux_version_info)

    return main_execution
    
}



/*
Función warning_end(so, version)

Devuelve un String con info sobre el fin de la actualización del so y la versión

Atributo:
    -so
    -version

Resultado:
    -String con info sobre el fin de la actualización del so y la versión
*/

async function warning_end(so, version) {

    return new Promise(function (resolve) {

        if (version != undefined) {
            var result = "Fin de la actualización de " + so + version
            resolve(result);
        } else {

            var result = ""
            resolve(result);

        }
    })
}

/*
Función check_array_version_wait(so,version)

FUnción que nos permite comprobar si un so+version esta en el array/buffer de aquellas versiones que se estan  

Atributo:
    -so
    -version

Resultado:
    -Boolean 
*/

async function check_array_version_wait(so,version) {

    return new Promise( function (resolve) {

        var so_version=(so.toLowerCase()+version.toLowerCase()).toString()
    
        var resultado_final=false
    
        for (let index = 0; index < array_version_wait.length; index++) {
            const element = array_version_wait[index]
            
            if(element==so_version){
                resultado_final=true
                break
            }
            
        }
    
        resolve(resultado_final)
        
    })


    
}

/*
Función push_check_array_version_wait(so,version)

Función que nos permite añadir un so+version a nuestrto array/buffer de versiones que utilizan la ruta update-cves-one para actualizarse,
no comprobaremos que dicha version es correcta ya aque la función se llamará despues de comprobar la version en el controlador  

Atributo:
    -so
    -version

Resultado:
    
*/

async function push_check_array_version_wait(so,version) {

    return new Promise( function (resolve) {

        var so_version=(so.toLowerCase()+version.toLowerCase()).toString()
        resolve(array_version_wait.push(so_version))

        
    })


}

/*
Función delete_check_array_version_wait(so,version)

Función que nos permite eliminar un so+version de nuestrto array/buffer de versiones que utilizan la ruta update-cves-one para actualizarse,
no comprobaremos que dicha version es correcta ya aque la función se llamará despues de comprobar la version en el controlador  

Atributo:
    -so
    -version

Resultado:
    
*/

async function delete_check_array_version_wait(so,version) {

        var so_version=(so.toLowerCase()+version.toLowerCase()).toString()

        return new Promise ( function (resolve) {

            for (let index = 0; index < array_version_wait.length; index++) {
                const element = array_version_wait[index];

                if(element==so_version){

                    resolve(array_version_wait.splice(index,1))
                    break;

                }
                
            }

            
            
        })

}







module.exports = {list_so_versions, warning_end,main,cves_obtain, sleep, delete_version_versions, delete_version_vulnerabilities, delete_version_cvelist,Get_actualizando_boolean,Set_actualizando_boolean,params_association,unique_update,db_collections, map_so,version_check,map_so_real,array_version_wait,push_check_array_version_wait,check_array_version_wait,delete_check_array_version_wait,cpenameGet,petition}
