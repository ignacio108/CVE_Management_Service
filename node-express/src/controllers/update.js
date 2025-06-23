const af = require('../utils/asyncronous_functions')//af=>asyncronous_functions
const versions_model = require('../mongo_models/versions_model')
var escapere = require('escape-regexp');


//https://nvd.nist.gov/developers/start-here
/*The rate limit with an API key is 50 requests in a rolling 30 second window. 
    Requesting an API key significantly raises the number of requests that can be made in a given time frame. 
    However, it is still recommended that your application sleeps for several seconds between requests so that legitimate requests are not denied, 
    and all requests are responded to in sequence.  */

exports.index = async (req, res, next) => {

    //Boolean correspondiente a la actualización general
    var boolean_aux = await af.Get_actualizando_boolean()


    /*

    NO tendremos en eucnta si se esta actualizando una version con /update-cves-one, simplemtente nos preocuparemos que no estemos actualizando
    */
    if (boolean_aux == false) {

        await af.Set_actualizando_boolean(true)

        console.log("Actualizando")

        lista_aux = await af.list_so_versions()

        //Llamamos a la función main que a su vez invocará a las otras funciones necesarias para actualizar la mongodb
        var main_respuesta = await af.main(lista_aux)

        await res.json(main_respuesta).end()

        await af.Set_actualizando_boolean(false)

    } else {

        res.json([{ status: 100, info: "Se esta actualizando la base de datos" }]).end()

    }



}

exports.update_one = async (req, res, next) => {

    //Comprobamos el SO y la version
    var params_associate_collection_aux = await af.params_association(req.params.soId, req.params.manufacturerId)

    //Boolean correspondiente a la actualización general
    var boolean_aux = await af.Get_actualizando_boolean()

    //Boolean correspondiente a la actualización de una unica version
    var boolean_aux_unique = await af.check_array_version_wait(req.params.soId, req.params.versionId)

    var so_aux = req.params.soId.toLowerCase()

    if ((boolean_aux == false) && (boolean_aux_unique == false)) {

        if ((so_aux == "comware") || (so_aux == "alliedware-plus")) {


            res.json([{ status: 400, info: "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD" }]).end()

        } else {

            if (params_associate_collection_aux[1]) {

                //Añadimos la version al array/buffer con las versiones que se estan actualizando
                await af.push_check_array_version_wait(req.params.soId, req.params.versionId)

                versions_model.find({ $and: [{ SO: { $regex: `^${req.params.soId}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }] }).then(async function (aux) {


                    if (aux.length == 0) {


                        //Devolveremos una respuesta json diciendo que la version no existe en la db y no se puede actualizar, deberá añadirse primero

                        //Eliminamos la version del array despues de actualizar
                        await af.delete_check_array_version_wait(req.params.soId, req.params.versionId)

                        res.json([{ status: 400, info: "La version y so no existen en la base de datos, prueba a añadirla primero" }]).end()


                    } else if (aux.length > 0) {


                        //Devolveremos un json con el status de la version 
                        var aux_update = await af.unique_update(req.params.soId, req.params.versionId)

                        //Eliminamos la version del array despues de actualizar
                        await af.delete_check_array_version_wait(req.params.soId, req.params.versionId)

                        res.json(aux_update).end()
                    }
                })

            } else {

                res.json([{ status: 400, info: "El tipo de SO no esta soportado" }]).end()
            }
        }
    } else if (boolean_aux || boolean_aux_unique) {

        res.json([{ status: 100, info: "Se esta actualizando la base de datos" }]).end()
    }
}