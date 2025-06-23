const mongoose = require('mongoose')

//Nuestro esquema para la coleccion de Fabricantes


const ManufacturersSchema = mongoose.Schema({
    Manufacturer_Name: String,
    SO: Array
  },{
    versionKey: false //Podemos en un futuro necesitar la version del documento por ahora no
});

//Hay que poner dos veces la referencia a la colección deseada porque sino, mongodb creará una coleccion aleatoria


module.exports = mongoose.model("Manufacturers", ManufacturersSchema, "Manufacturers");