/**
 * hospitals-controller - Hospitals controller
 * @type {*|Mongoose}
 */
const config = require('../helpers/config-helper');
const Hospitals = require('../models/hospital-models');

/**
 * index - Show all records
 *
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
exports.index = async (req, res) => {
    const hospitals = await Hospitals.find().exec();
    if (hospitals && hospitals.length > 0) {
        res.status(config.http.status.ok).json({data: hospitals});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.hospitals_not_found);
    }
};

/**
 * showById - Show a single record by id
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.showById = async (req, res) => {
    const hospital = await  Hospitals.findById(req.params.id).exec();
    if (hospital) {
        res.status(config.http.status.ok).json({data: hospital});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.id_not_found);
    }
};

/**
 * showByCity - Show all hospitals for a city and optional a state
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.showByCity = async (req, res) => {
    const query = {};
    query.city = (req.params.city).toUpperCase();
    if (req.params.state) {
        query.state = req.params.state.toUpperCase();
    }
    const hospitals = await Hospitals.find(query).exec();
    if (hospitals && hospitals.length > 0) {
        res.status(config.http.status.ok).json({data: hospitals});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.hospitals_not_found_city);
    }
};

/**
 * showByState - Show all hospitals for a state
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.showByState = async (req, res) => {
    const state = (req.params.state).toUpperCase();
    const hospitals = await Hospitals.find({state}).exec();
    if (hospitals && hospitals.length > 0) {
        res.status(config.http.status.ok).json({data: hospitals});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.hospitals_not_found_state);
    }
};

/**
 * showByCounty - Show all hospitals for a county
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.showByCounty = async (req, res) => {
    const county_name = (req.params.county).toUpperCase();
    const hospitals = await Hospitals.find({county_name}).exec();
    if (hospitals && hospitals.length > 0) {
        res.status(config.http.status.ok).json({data: hospitals});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.hospitals_not_found_county);
    }
};

/**
 * showByName - Show all hospitals that name contains provided name
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.showByName = async (req, res) => {
    const hospital_name = {$regex: ".*" + (req.params.name).toUpperCase() + ".*"};
    const hospitals = await Hospitals.find({hospital_name}).exec();
    if (hospitals && hospitals.length > 0) {
        res.status(config.http.status.ok).json({data: hospitals});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.hospitals_not_found_name);
    }
};

/**
 * store - Store a new hospital
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.store = async (req, res) => {
    // Ensure that the request contains a message body
    if(Object.keys(req.body).length===0) {
        // Error: no body was sent
        throw config.getErrObj(config.http.status.bad_request, config.errmsg.app.missing_body)
    }

    // Generate the new Hospital
    let hospital = new Hospitals(config.db.minimum_document);
    hospital = hospitalCopy(hospital, req.body);
    hospital = hospitalToUpperCase(hospital);
    await hospital.save();

    // Set the Location header
    res.location(config.app.hospitalUrl + hospital._id);

    // Send response
    res.status(config.http.status.created).json({data: hospital});

};

/**
 * update - Updates a hospital by id
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.update = async (req, res) => {
    // Ensure that the request contains a message body
    if(Object.keys(req.body).length===0) {
        // Error: no body was sent
        throw config.getErrObj(config.http.status.bad_request, config.errmsg.app.missing_body)
    }

    const hospital = await Hospitals.findById(req.params.id).exec();
    if (hospital) {
        // Combine/patch the two objects together
        let newHospital = config.updateJson(req.body, hospital);
        // set server controlled values
        newHospital._id = hospital._id;
        newHospital.dateCreated = hospital.dateCreated;
        newHospital.dateModified = new Date();
        // make sure upperCase for required fields
        newHospital = hospitalToUpperCase(newHospital);
        await newHospital.save();
        res.json({data: newHospital});
        return;
    }

    throw config.getErrObj(config.http.status.bad_request, config.errmsg.app.id_not_found);
};

/**
 * replace - Replaces a hospital by id
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.replace = async (req, res) => {
// Ensure that the request contains a message body
    if(Object.keys(req.body).length===0) {
        // Error: no body was sent
        throw config.getErrObj(config.http.status.bad_request, config.errmsg.app.missing_body)
    }

    let hospital = await Hospitals.findById(req.params.id).exec();
    if (hospital) {
        // set all user editable fields to given values
        hospital = hospitalCopy(hospital, req.body);
        hospital = hospitalToUpperCase(hospital);
        hospital.dateModified = new Date();
        await hospital.save();
        res.json({data: hospital});
    } else {
        // this id is not in the database add a new document
        let newHospital = new Hospitals(config.db.minimum_document);
        newHospital = hospitalCopy(newHospital, req.body);
        newHospital = hospitalToUpperCase(newHospital);
        newHospital._id = req.params.id;
        await newHospital.save();
        res.json({data: newHospital});
    }
};

/**
 * destroy - Deletes a hospital by id
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.destroy = async (req, res) => {
    const hospital = await  Hospitals.findByIdAndRemove(req.params.id).exec();
    if (hospital) {
        res.status(config.http.status.ok).json({data: hospital});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.id_not_found);
    }
};

/**
 * hospitalCopy - Copies information to a hospital object
 *
 * @param hospital object to have information copied to
 * @param copy Object to copy from
 * @returns {*}
 */
const hospitalCopy = (hospital, copy) => {
    hospital.id = copy.id;
    hospital.position = copy.position;
    hospital.uuid = copy.uuid;
    hospital.address = copy.address;
    hospital.city = copy.city;
    hospital.county_name = copy.county_name;
    hospital.emergency_services = copy.emergency_services;
    hospital.hospital_name = copy.hospital_name;
    hospital.hospital_ownership = copy.hospital_ownership;
    hospital.hospital_type = copy.hospital_type;
    hospital.location = copy.location;
    hospital.phone_number = copy.phone_number;
    hospital.provider_id = copy.provider_id;
    hospital.state = copy.state;
    hospital.zip_code = copy.zip_code;
    hospital.url = copy.url;
    return hospital;
};

/**
 * hospitalToUpperCase - sets required hospital string fields to upper case strings
 *
 * @param hospital object to have strings changed on
 * @returns {*}
 */
const hospitalToUpperCase = (hospital) => {
    hospital.address = typeof hospital.address === "string" ? hospital.address.toUpperCase() : hospital.address;
    hospital.city = typeof hospital.city === "string" ? hospital.city.toUpperCase() : hospital.city;
    hospital.county_name = typeof hospital.county_name === "string" ? hospital.county_name.toUpperCase() : hospital.county_name;
    hospital.hospital_name = typeof hospital.hospital_name === "string" ? hospital.hospital_name.toUpperCase() : hospital.hospital_name;
    hospital.state = typeof hospital.state === "string" ? hospital.state.toUpperCase() : hospital.state;
    return hospital;
};

/**
 * Part 1
 *
 * Gets / all,id, city, state, county, city & state, name - Done
 *
 * API Key / URL or header - Done with admin control
 *
 * Post / create new hospital - Done
 *
 * Patch / id - Done
 *
 * Put / id - Done
 *
 * Delete / id - Done
 *
 *
 * Part 2
 *
 * Build a client
 *
 * or
 *
 * authorization/authentication in API
 * oAuth2/passport
 */
