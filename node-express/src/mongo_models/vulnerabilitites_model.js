const mongoose = require('mongoose')

const VulnerabilitiesSchema = mongoose.Schema({
    SO: String,
    Version: String,
    Critical: Number,
    High: Number,
    Medium: Number,
    Low: Number,

},{
    versionKey: false //Podemos en un futuro necesitar la version del documento por ahora no
});


module.exports = mongoose.model("Vulnerabilities",VulnerabilitiesSchema,"Vulnerabilities");