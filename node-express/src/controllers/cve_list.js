const cve_model = require("../mongo_models/cve_list_model")
var escapere = require('escape-regexp');
const af = require('../utils/asyncronous_functions')//af=>asyncronous_functions


exports.list_vulnerabilities = async (req, res, next) => {

    /*
        Buscaremos nuesto id en la base de datos, si existe una coleccion de vulnerabilidades asociada a dicho SO entonces:
            -Devolvera un json con todas las vulnerabilidades

        Si no exite una coleccion de ese SO entonces devolvera una response tipo 404

        ¿Cómo comprobamos si existe dicha colección?

        Llamaremos a la función pac del req_params_associations.js
        Y cogerá nuestro SO y lo unirá al identificador CVE_List_

        Ejemplo:

        SO: IOS
        Identificador de la colección: CVE_List_IOS


        Estó se hace porque sino mongodb creará una nueva colección aunque hagamos una consulta a una coleccion que no existe.

    */

    //Boolean correspondiente a la actualización general
    var boolean_aux = await af.Get_actualizando_boolean()

    //Boolean correspondiente a la actualización de una unica version
    var boolean_aux_unique = await af.check_array_version_wait(req.params.soId,req.params.versionId)

    var params_associate_collection_aux = await af.params_association(req.params.soId, req.params.manufacturerId)

    if ((boolean_aux == false) && (boolean_aux_unique==false)) {

        let so_aux = req.params.soId.toLowerCase()

        //Nos aseguramos que las versiones de comware y allied quedan excluidas ya que params_associate_collection no tiene en cuenta este caso para las CVEs

        if ((so_aux == "comware") || (so_aux == "alliedware-plus")) {


            res.json([{ status: 400, info: "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD" }]).end()

        } else {

            //Comnprobamos que el fabricante y el SO sean correctos

            if (params_associate_collection_aux[1]) {

                //Comprobamos que la version introducida exista en la db
                var check_version_aux = await af.version_check(req.params.soId, req.params.versionId)

                if (check_version_aux) {

                    af.map_so.get(params_associate_collection_aux[0]).find({ Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }).then(async function (aux) {

                        //Devolveremos solo la version correspondiente de la petición no todo el array

                        await aux.forEach(element => {

                            element.Version = req.params.versionId.toLowerCase()

                        });

                        await res.json(aux).end()

                    }).catch(function (err) {
                        console.log(err)
                    })

                } else {

                    res.json([{ status: 400, info: "La versión introducida no está en la db" }]).end()

                }


            } else {
                res.json([{ status: 400, info: "El tipo de SO introducido no está soportado o es incorrecto" }]).end()
            }
        }

    } else if (boolean_aux || boolean_aux_unique) {

        res.json([{ status: 100, info: "Se esta actualizando la base de datos" }]).end()

    }

}


exports.details_vulnerabilities = async (req, res, next) => {


    //Boolean correspondiente a la actualización general
    var boolean_aux = await af.Get_actualizando_boolean()

    //Boolean correspondiente a la actualización de una unica version
    var boolean_aux_unique = await af.check_array_version_wait(req.params.soId,req.params.versionId)

    //Comprobación del SO y la version

    var params_associate_collection_aux = await af.params_association(req.params.soId, req.params.manufacturerId)

    if ((boolean_aux == false) && (boolean_aux_unique==false)) {


        let so_aux = req.params.soId.toLowerCase()

        //Nos aseguramos que las versiones de comware y allied quedan excluidas ya que params_associate_collection no tiene en cuenta este caso para las CVEs

        if ((so_aux == "comware") || (so_aux == "alliedware-plus")) {

            res.json([{ status: 400, info: "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD" }]).end()


        } else {

            //Comnprobamos que el fabricante y el SO sean correctos

            if (params_associate_collection_aux[1]) {


                //Comprobamos que la version introducida exista en la db
                var check_version_aux = await af.version_check(req.params.soId, req.params.versionId)

                if (check_version_aux) {

                    af.map_so.get(params_associate_collection_aux[0]).find({ $and: [{ CVE_id: { $regex: `^${req.params.vulnerabilityId}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }] }).then(async function (aux) {

                        //Devolveremos solo la version correspondiente de la petición no todo el array


                        if (aux.length == 0) {

                            res.json([{ status: 400, info: "No hay ninguna vulnerabilidad con ese Id para esta version" }]).end()

                        } else {

                            await aux.forEach(element => {

                                element.Version = req.params.versionId.toLowerCase()

                            });

                            await res.json(aux).end()

                        }



                    }).catch(function (err) {
                        console.log(err)
                    })

                } else {

                    res.json([{ status: 400, info: "La versión introducida no está en la db" }]).end()

                }

            } else {
                res.json([{ status: 400, info: "El tipo de SO introducido no está soportado o es incorrecto" }]).end()
            }

        }

    } else if (boolean_aux || boolean_aux_unique) {

        res.json([{ status: 100, info: "Se esta actualizando la base de datos" }]).end()
    }

}


exports.level_vulnerabilities = async (req, res, next) => {

        //Boolean correspondiente a la actualización general
        var boolean_aux = await af.Get_actualizando_boolean()

        //Boolean correspondiente a la actualización de una unica version
        var boolean_aux_unique = await af.check_array_version_wait(req.params.soId,req.params.versionId)

    if ((boolean_aux == false) && (boolean_aux_unique==false)) {

        let so_aux = req.params.soId.toLowerCase()

        //Nos aseguramos que las versiones de comware y allied quedan excluidas ya que params_associate_collection no tiene en cuenta este caso para las CVEs

        if ((so_aux == "comware") || (so_aux == "alliedware-plus")) {

            res.json([{ status: 400, info: "Comware y AlliedWare-Plus no tienen asociadas vulnerabilidades en la NVD" }]).end()


        } else {

            //Comnprobamos que el fabricante y el SO sean correctos

            var params_associate_collection_aux = await af.params_association(req.params.soId, req.params.manufacturerId)


            if (params_associate_collection_aux[1]) {


                //Comprobamos que la version introducida exista en la db
                var check_version_aux = await af.version_check(req.params.soId, req.params.versionId)

                if (check_version_aux) {

                    //Comprobaremos si severity es critical, high, medium o low en caso de no serlo devolveremos un 400

                    var severity_aux = req.query.severity.toLowerCase()

                    if ((severity_aux == "critical") || (severity_aux == "high") || (severity_aux == "medium") || (severity_aux == "low")) {

                        af.map_so.get(params_associate_collection_aux[0]).find({ $and: [{ cvssbaseSeverity: { $regex: `^${req.query.severity}$`, $options: 'i' } }, { Version: { $regex: `^${escapere(req.params.versionId)}$`, $options: 'i' } }] }).then(async function (aux) {

                            //Devolveremos solo la version correspondiente de la petición no todo el array

                            await aux.forEach(element => {

                                element.Version = req.params.versionId.toLowerCase()

                            });

                            await res.json(aux)

                        }).catch(function (err) {
                            console.log(err)
                        })

                    } else {

                        res.json([{status:400,info:"El nivel de severidad que se esta buscando no es válida"}]).end()

                    }

                } else {

                    res.json([{status:400,info:"La versión introducida no está en la db"}]).end()
                }
            } else {
                res.json([{status:400,info:"El tipo de SO introducido no está soportado o es incorrecto"}]).end()
            }
        }
    } else if ((boolean_aux || boolean_aux_unique)) {

        res.json([{status:100,info:"Se esta actualizando la base de datos"}]).end()

    }


}



