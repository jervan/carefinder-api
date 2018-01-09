const mongoose = require('mongoose');
const config = require('../helpers/config-helper');

const definition = {

    id: { type: Number },
    position: { type: Number },
    uuid: { type: String, trim: true },
    address: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    county_name: { type: String, trim: true, required: true },
    emergency_services: { type: Boolean, required: true },
    hospital_name: { type: String, trim: true, required: true },
    hospital_ownership: { type: String, trim: true },
    hospital_type: { type: String, trim: true, required: true},
    location: {
        human_address: { type: String, trim: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        needs_recoding: { type: Boolean }
    },
    phone_number: {
        phone_number: { type: Number, required: true }
    },
    provider_id: { type: String, trim: true },
    state: { type: String, trim: true, required: true },
    zip_code: { type: Number, required: true },
    url: { type: String, trim: true },
    dateCreated: { type: Date, required: true },
    dateModified: { type: Date, required: true }
};

const hospitalSchema = new mongoose.Schema(definition);

module.exports = mongoose.model(config.models.hospitals, hospitalSchema);

