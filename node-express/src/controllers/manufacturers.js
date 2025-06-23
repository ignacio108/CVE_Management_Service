const mongoose = require('mongoose')
const manufacturers_model = require('../mongo_models/manufacturers_model')
const af = require('../utils/asyncronous_functions')//af=>asyncronous_functions



//Controlador correspondiente a la API para obtener los Fabricantes y sus SO

exports.index = async (req, res, next) => {

    var boolean_aux = await af.Get_actualizando_boolean()

    if (boolean_aux == false) {

        manufacturers_model.find({}).then(function (aux) {
            res.json(aux)
        }).catch(function (err) {
            console.log(err)
        })

    } else if (boolean_aux) {

    
        res.json([{status:100,info:"Se esta actualizando la base de datos" }]).end()

    }


}

//Controlador correspondiente para obtener los SO y Hardware de los distintos sistemas operativos de un frabricante

exports.details_Manufacturer = async (req, res, next) => {

    var boolean_aux = await af.Get_actualizando_boolean()


    if (boolean_aux == false) {

        manufacturers_model.find({}).then(function (aux) {

            var boolean_manufacturer_aux = false

            //Este for each me permite comprobar que el manufacturer introducido existe en la db, si no existe devolverá un status 400 en el res.json

            aux.forEach(element => {

                var manufactuer_aux = element.Manufacturer_Name.toLowerCase()

                if (req.params.manufacturerId.toLowerCase() == manufactuer_aux) {
                    boolean_manufacturer_aux = true;
                }

            });

            if (boolean_manufacturer_aux == false) {

                res.json([{status:400,info:"El tipo de Fabricante introducido no está soportado o es incorrecto" }]).end()


            } else {

                manufacturers_model.find({ Manufacturer_Name: { $regex: `^${req.params.manufacturerId}$`, $options: 'i' } }).then(function (aux) {
                    res.json(aux)

                }).catch(function (err) {
                    console.log(err)
                })
            }


        }).catch(function (err) {
            console.log(err)
        })


    } else if (boolean_aux) {

        res.json([{status:100,info:"Se esta actualizando la base de datos"}]).end()

    }


}

//Controlador correspondiete para obtener los detalles de un Sistema operativo Hardware





