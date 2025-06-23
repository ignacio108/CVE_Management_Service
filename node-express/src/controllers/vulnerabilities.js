const monogoose = require("mongoose");
const vulnerabilitites_model = require('../mongo_models/vulnerabilitites_model')
var escapere = require('escape-regexp');
const af = require('../utils/asyncronous_functions')//af=>asyncronous_functions

exports.index = async (req, res, next) => {

    var params_associate_collection_aux = await af.params_association(req.params.soId, req.params.manufacturerId)

        //Boolean correspondiente a la actualización general
        var boolean_aux = await af.Get_actualizando_boolean()

        //Boolean correspondiente a la actualización de una unica version
        var boolean_aux_unique = await af.check_array_version_wait(req.params.soId,req.params.versionId)

    if ((boolean_aux == false) && (boolean_aux_unique==false)) {

        //Nos aseguramos que las versiones de comware y allied quedan excluidas ya que params_associate_collection no tiene en cuenta este caso para las CVEs

        let so_aux = req.params.soId.toLowerCase()

        if ((so_aux == "comware") || (so_aux == "alliedware-plus")) {

            res.json([{ status: 400, info: "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD" }]).end()

        } else {

            //Comnprobamos que el fabricante y el SO sean correctos

            if (params_associate_collection_aux[1]) {

                //Comprobamos que la version introducida exista en la db
                var check_version_aux = await af.version_check(req.params.soId, req.params.versionId)

                if (check_version_aux) {

                    vulnerabilitites_model.find({ $and: [{ SO: { $regex: `^${req.params.soId}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }] }).then(function (aux) {
                        res.json(aux).end()
                    }).catch(function (err) {
                        console.log(err)
                    })

                }else{
                    res.json([{status:400,info:"La versión introducida no está en la db"}]).end()
                }
            } else {

                res.json([{ status: 400, info: "El tipo de SO introducido no está soportado o es incorrecto" }]).end()

            }
        }
    } else if (boolean_aux || boolean_aux_unique) {
        res.json([{ status: 100, info: "Se esta actualizando la base de datos" }]).end()
    }

}

