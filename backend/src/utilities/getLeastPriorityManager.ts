import ReportingRole from "../models/reportingRole";

export const getLeastPriorityManager = async (managers: any) => {
    try {
        if (!managers || managers.length === 0) {
        console.log('No managers provided.');
        return null;
        }

        // Fetch ReportingRole information for each manager
        const managersWithRoles = await Promise.all(
        managers.map(async (manager: any) => {
            const reportingRole = await ReportingRole.findByPk(manager.reporting_role_id);
            return { ...manager, reportingRole };
        })
        );

        // Find the manager with the least priority
        const leastPriorityManager = managersWithRoles.reduce((minManager, currentManager) => {
        if (!minManager || currentManager.reportingRole.priority < minManager.reportingRole.priority) {
            return currentManager;
        }
        return minManager;
        }, null);

        const leastPriorityManagerWithoutCircular = JSON.parse(JSON.stringify(leastPriorityManager));

        return leastPriorityManagerWithoutCircular;

    } catch (error) {
        console.error('Error fetching least priority manager:', error);
        return null;
    }
};