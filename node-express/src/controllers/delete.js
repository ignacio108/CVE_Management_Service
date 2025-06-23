const af = require('../utils/asyncronous_functions')//af=>asyncronous_functions
const versions_model = require('../mongo_models/versions_model')
var escapere = require('escape-regexp');

//A corregir si pasamos un so con minusculas no devuleve un 200 se ha eliminado correctamente bla bla

exports.index = async (req, res, next) => {


    //Boolean correspondiente a la actualización general
    var boolean_aux = await af.Get_actualizando_boolean()

    //Boolean correspondiente a la actualización de una unica version
    var boolean_aux_unique = await af.check_array_version_wait(req.params.soId, req.params.versionId)

    //Si no existe en la base de datos devolveremos un 400, so y version no están en la base de datos,

    //En el caso de que exista se eleminará y devolverá un 200

    //Primero comprobaremos que dicha version existe en la base de datos

    if ((boolean_aux == false) && (boolean_aux_unique == false)) {

        //Ponemos el valor del boolean de actualizar a true para evitar que se actualice la bases de datos mientras eliminamos una version



        versions_model.find({ $and: [{ SO: { $regex: `^${req.params.soId}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }] }).then(async function (aux2) {

            const respuesta = await aux2

            so_aux = req.params.soId.toLowerCase()

            //Utilizaremos el mapa para asociar los nombres en minuscula con el nombre que tienen en la db
            if (af.map_so_real.has(so_aux)) {

                //Añadimos la version al array/buffer con las versiones que se estan actualizando
                await af.push_check_array_version_wait(req.params.soId, req.params.versionId)

                if (respuesta.length == 0) {

                    res.json([{ status: 400, info: "La versión que se quiere eliminar no se encuentra en la base de datos" }]).end()

                } else {

                    //Tenemos que tener en cuenta el caso de comware y alliedo porque no tendran ningun documento sobre numero de vulnerabilidades y tampoco sobre cves

                    var so_aux = req.params.soId.toLowerCase()

                    if ((so_aux == "comware") || (so_aux == "alliedware-plus")) {

                        //Eliminar de la coleccion Version el documento version y so

                        await af.delete_version_versions(req.params.soId, req.params.versionId)


                        res.json([{ status: 200, info: "La versión ha sido eliminada con éxito" }]).end()


                    } else {

                        //Eliminar de la coleccion Version el documento version y so

                        await af.delete_version_versions(req.params.soId, req.params.versionId)

                        //Eliminar de la coleccion Vulnerabilities el documento correspondiente a version y so

                        await af.delete_version_vulnerabilities(req.params.soId, req.params.versionId)

                        //Eliminar de la coleccion correspondiete a ese SO y version todas sus cves

                        await af.delete_version_cvelist(req.params.soId, req.params.versionId)



                        res.json([{ status: 200, info: "La versión ha sido eliminada con éxito" }]).end()

                    }


                }

                //Eliminamos la version del array despues de actualizar
                await af.delete_check_array_version_wait(req.params.soId, req.params.versionId)

            } else {



                res.json([{ status: 400, info: "El tipo de SO no está soportado" }]).end()
            }


        }).catch(function (err) {

            console.log(err)
        })

    } else if (boolean_aux || boolean_aux_unique) {



        res.json([{ status: 100, info: "Se esta actualizando la base de datos" }]).end()



    }


}