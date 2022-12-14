const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const model = require("../models/token");
const jwt  = require('jsonwebtoken');
const md5 = require('md5');
var fs = require('mz/fs')
exports.authLogin = async (req, res, next) => {
    try {
        const jwtExpirySeconds = "365d";
        const encryptedPassword= req.body.password;
        console.log("user",req.body.password)
        const data = await model.authLogin(req.body.username,encryptedPassword);
        //console.log('userdata1',data)
        if (!_.isEmpty(data)) {
            const userData = data[0];
            //console.log('userdata',userData)
           // const token = jwt.sign({userData}, process.env.TOKEN_SECRET, {
            const token = jwt.sign({userData}, '8ac21a22-0589-4c10-adff-4d5a6b94c176', {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
              })
              res.status(StatusCodes.OK).send({"expires_in":jwtExpirySeconds,"access_token":token,"token_type": "bearer","userData":userData});
        } else {
            res.status(StatusCodes.NOT_FOUND).send({ message: "Not found." });
        }
    } catch (e) {
        //console.log(`Error in create`, e);
        next(e);
    }
};
