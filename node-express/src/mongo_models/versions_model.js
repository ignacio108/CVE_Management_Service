const mongoose = require('mongoose')


const VersionsSchema = mongoose.Schema({
    SO: String,
    Version: String,
    EOES: String,
    EOS: String,
},{
    versionKey: false //Podemos en un futuro necesitar la version del documento por ahora no
});


module.exports = mongoose.model("Versions", VersionsSchema, "Versions",{ ignoreUndefined: true });