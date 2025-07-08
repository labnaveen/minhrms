import { authorize } from "../../../src/services/auth/AuthService";
import { expect } from "chai";
import { User } from "../../../src/models/";
import sinon, {mock} from "sinon";
import { describe, it } from "mocha";
import {getUserRoles} from "../../../src/services/auth/PermissionService";
import * as PermissionService from "../../../src/services/auth/PermissionService";



describe('Authorize Function', () => {
    it('should return an object existing of user, scope, token, and refresh token.', async() => {
        const user = {
            id: 1,
            company_id: 1,
            employee_name: 'Anugrah Bhatt',
            employee_generated_id: 'GV-123',
            date_of_joining: '2023-04-03',
            probation_period: '6 months',
            probation_due_date: '2023-10-03',
            designation: 'Software Engineer',
            department: 'IT',
            work_location: 'office',
            level: '',
            grade: '',
            cost_center: '',
            employee_official_email: 'anugrah.bhatt@glocalview.com',
            employee_personal_email: 'bhattanugrah@gmail.com',
            dob_adhaar: '1998-04-01',
            dob_celebrated: '1998-04-01',
            employee_gender_id: 1,
            is_deleted: false,
            role_id: 1,
            status: true,
            employee_password: '$2a$10$pq45/XqbKBMxmyQyL4l73.nc0ClLAtDaxQCn0UOuccNf/gZkB6Uc.'
        } as any;


        const scope = {"scope": {
            "id": 1,
            "name": "Admin",
            "alias": "admin",
            "description": "This role is for the main super HR",
            "status": true,
            "createdAt": "2023-03-23T19:53:50.000Z",
            "updatedAt": "2023-03-23T19:53:50.000Z",
            "permissions": [
              {
                "id": 1,
                "name": "permissions.list"
              },
              {
                "id": 2,
                "name": "permissions.create"
              },
              {
                "id": 3,
                "name": "permissions.show"
              },
              {
                "id": 4,
                "name": "permissions.update"
              },
              {
                "id": 5,
                "name": "permissions.destroy"
              },
              {
                "id": 6,
                "name": "permissions.status"
              },
              {
                "id": 7,
                "name": "users.list"
              },
              {
                "id": 8,
                "name": "users.create"
              },
              {
                "id": 9,
                "name": "users.show"
              },
              {
                "id": 10,
                "name": "users.update"
              },
              {
                "id": 11,
                "name": "users.destroy"
              },
              {
                "id": 12,
                "name": "users.status"
              },
              {
                "id": 13,
                "name": "roles.list"
              },
              {
                "id": 14,
                "name": "roles.create"
              },
              {
                "id": 15,
                "name": "roles.show"
              },
              {
                "id": 16,
                "name": "roles.update"
              },
              {
                "id": 17,
                "name": "roles.destroy"
              },
              {
                "id": 18,
                "name": "roles.status"
              }
            ]
        }}

        const getUserRolesFake =  sinon.stub().resolves(scope)

        sinon.replace(PermissionService, 'getUserRoles', getUserRolesFake)

        const authData = await authorize(user) as any;

        expect(authData.user).to.deep.equal(user);
        expect(authData.scope).to.deep.equal(scope);
        expect(authData.token).to.be.a('string');
        expect(authData.refresh).to.be.a('string');

    })
})

