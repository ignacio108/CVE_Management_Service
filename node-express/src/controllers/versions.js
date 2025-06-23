const versions_model = require('../mongo_models/versions_model')
var escapere = require('escape-regexp');
const af = require('../utils/asyncronous_functions')//af=>asyncronous_functions



//Controlador correspondiente para obtener las versiones de los SO operativos asi como su EOL, EOES, EOS y guia de usuario.

exports.index = async (req, res, next) => {

    var boolean_aux = await af.Get_actualizando_boolean()

    so_aux = req.params.soId.toLowerCase()

    var params_associate_collection_aux = (await af.params_association(req.params.soId, req.params.manufacturerId))


    if (boolean_aux == false) {

        //Comnprobamos que el fabricante y el SO sean correctos

        if (params_associate_collection_aux[1]) {


            versions_model.find({ SO: { $regex: `^${req.params.soId}$`, $options: 'i' } }).then(function (aux) {
                res.json(aux)
            }).catch(function (err) {
                console.log(err)
            })

        } else {
            res.json([{status:400,info:"El tipo de SO introducido no está soportado o es incorrecto"}]).end()
        }

    } else if (boolean_aux) {

        res.json([{status:100,info:"Se esta actualizando la base de datos"}]).end()
    }

}

//Controlador correspondiente para obtener el SO, EOES, EOS y guia de usuario DE UNA UNICA VERSION.

exports.details_versions = async (req, res, next) => {

    var params_associate_collection_aux = await af.params_association(req.params.soId, req.params.manufacturerId)

    //Si es comware o allied deberemos mostrar las versiones cves no porque no tienen y tampoco la lista de los mismos

    so_aux = req.params.soId.toLowerCase()

    //Boolean correspondiente a la actualización general
    var boolean_aux = await af.Get_actualizando_boolean()

    //Boolean correspondiente a la actualización de una unica version
    var boolean_aux_unique = await af.check_array_version_wait(req.params.soId,req.params.versionId)

    //Si se está modificando la db no se podrán obtener datos

    if ((boolean_aux == false) && (boolean_aux_unique==false)) {


        //Comnprobamos que el fabricante y el SO sean correctos

        if (params_associate_collection_aux[1]) {


            //Comprobamos que la version introducida exista en la db
            var check_version_aux= await af.version_check(req.params.soId,req.params.versionId)

            if(check_version_aux){

                versions_model.find({ Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }).then(function (aux2) {
                    res.json(aux2)
                }).catch(function (err) {
                    console.log(err)
                })

            }else{

                res.json([{status:400,info:"La versión introducida no está en la db"}]).end()

            }

        } else {

            res.json([{status:400,info:"El tipo de SO introducido no está soportado o es incorrecto"}]).end()

        }

        


    } else if (boolean_aux || boolean_aux_unique) {

        res.json([{status:100,info:"Se esta actualizando la base de datos"}]).end()

    }



}