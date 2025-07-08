"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeastPriorityManager = void 0;
const reportingRole_1 = __importDefault(require("../models/reportingRole"));
const getLeastPriorityManager = async (managers) => {
    try {
        if (!managers || managers.length === 0) {
            console.log('No managers provided.');
            return null;
        }
        // Fetch ReportingRole information for each manager
        const managersWithRoles = await Promise.all(managers.map(async (manager) => {
            const reportingRole = await reportingRole_1.default.findByPk(manager.reporting_role_id);
            return { ...manager, reportingRole };
        }));
        // Find the manager with the least priority
        const leastPriorityManager = managersWithRoles.reduce((minManager, currentManager) => {
            if (!minManager || currentManager.reportingRole.priority < minManager.reportingRole.priority) {
                return currentManager;
            }
            return minManager;
        }, null);
        const leastPriorityManagerWithoutCircular = JSON.parse(JSON.stringify(leastPriorityManager));
        return leastPriorityManagerWithoutCircular;
    }
    catch (error) {
        console.error('Error fetching least priority manager:', error);
        return null;
    }
};
exports.getLeastPriorityManager = getLeastPriorityManager;
