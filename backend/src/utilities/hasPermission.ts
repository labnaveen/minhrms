export const hasPermissions = (routePermissions : any, userPermissions: any) => {

    if (!routePermissions) {

        return true

    }

    return routePermissions.every((item: any) => userPermissions.includes(item))

}