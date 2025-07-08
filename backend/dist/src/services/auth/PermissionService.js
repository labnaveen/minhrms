"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoles = void 0;
const models_1 = require("../../models");
async function getUserRoles(roleId) {
    try {
        const scope = await models_1.Roles.findByPk(roleId, {
            include: [{
                    model: models_1.Permissions,
                    attributes: ['id', 'name'],
                    as: 'permissions',
                    through: {
                        attributes: []
                    }
                }]
        });
        // console.log('here is the scope: ', scope?scope:[])
        return scope ? scope : [];
    }
    catch (err) {
        // console.log(err)
        throw err;
    }
}
exports.getUserRoles = getUserRoles;
