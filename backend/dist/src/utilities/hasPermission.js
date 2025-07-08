"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermissions = void 0;
const hasPermissions = (routePermissions, userPermissions) => {
    if (!routePermissions) {
        return true;
    }
    return routePermissions.every((item) => userPermissions.includes(item));
};
exports.hasPermissions = hasPermissions;
