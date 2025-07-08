import { Permissions, Roles, User } from '../../models'

export async function getUserRoles(roleId: number){
    try{
        const scope = await Roles.findByPk(roleId, {
            include: [{
                model: Permissions,
                attributes:['id', 'name'],
                as: 'permissions',
                through:{
                    attributes:[]
                }
            }]
        });
        // console.log('here is the scope: ', scope?scope:[])
        return scope? scope: []
    }
    catch(err){
        // console.log(err)
        throw err
    }
}