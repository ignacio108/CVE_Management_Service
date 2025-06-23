const af = require('../utils/asyncronous_functions')//af=>asyncronous_functions
const versions_model = require('../mongo_models/versions_model')
var escapere = require('escape-regexp');



exports.index = async (req, res, next) => {


    //Boolean correspondiente a la actualización general
    var boolean_aux = await af.Get_actualizando_boolean()

    //Boolean correspondiente a la actualización de una unica version
    var boolean_aux_unique = await af.check_array_version_wait(req.params.soId, req.params.versionId)


    if ((boolean_aux == false) && (boolean_aux_unique == false)) {

        //Si estamos añadiendo una versión no se podrán ejecutar otras peticiones

        versions_model.find({ $and: [{ SO: { $regex: `^${req.params.soId}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }] }).then(async function (aux) {

            var respuesta = await aux

            var so_aux = req.params.soId.toLowerCase()
            //var version_aux=req.params.versionId.toLowerCase()


            //Utilizaremos el mapa para asociar los nombres en minuscula con el nombre que tienen en la db
            if (af.map_so_real.has(so_aux)) {

                //Añadimos la version al array/buffer con las versiones que se estan actualizando
                await af.push_check_array_version_wait(req.params.soId, req.params.versionId)

                if ((respuesta.length != 0)) {

                    //Si instroducimos una version con una fecha LATEST, TBD, UNKNOWN o RETIRED Debemos poder introducirla.

                    let eoes_isstring_boolean = req.params.eoes == "LATEST" || req.params.eoes == "TBD" || req.params.eoes == "UNKNOWN" || req.params.eoes == "RETIRED"
                    let eos_isstring_boolean = req.params.eos == "LATEST" || req.params.eos == "TBD" || req.params.eos == "UNKNOWN" || req.params.eos == "RETIRED"


                    if ( eoes_isstring_boolean && eos_isstring_boolean) {

                        var new_version_document = await versions_model.findOneAndUpdate({ $and: [{ SO: { $regex: `^${req.params.soId}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }] }, { EOES: req.params.eoes, EOS: req.params.eos })

                        await new_version_document.save()


                        res.json([{ status: 200, info: "La versión ha sido actualizada con éxito" }]).end()


                    } else {

                        try {
                            //Convertiremos nuestros parametros a una fecha ISO
                            const eoes = new Date(req.params.eoes).toISOString()
                            const eos = new Date(req.params.eos).toISOString()

                            var new_version_document = await versions_model.findOneAndUpdate({ $and: [{ SO: { $regex: `^${req.params.soId}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }] }, { EOES: eoes, EOS: eos })


                            await new_version_document.save()



                            res.json([{ status: 200, info: "La versión ha sido actualizada con éxito" }]).end()

                        } catch (err) {
                            console.log(err)



                            res.json([{ status: 400, info: "La fecha introducida tiene un formato inválido" }]).end()

                        }

                    }


                } else {



                    res.json([{ status: 400, info: "No existe ninguna version con ese SO, o no existe la versión, deberá añadirse primero" }]).end()

                }

                //Eliminamos la version del array despues de actualizar
                await af.delete_check_array_version_wait(req.params.soId, req.params.versionId)

            } else {


                res.json([{ status: 400, info: "El tipo de SO no está soportado" }]).end()


            }




        }).catch(function (err) {
            console.log(err)
            res.status(400).end()
        })




    } else if (boolean_aux || boolean_aux_unique) {
        res.json([{ status: 100, info: "Se esta actualizando la base de datos" }]).end()
    }

}