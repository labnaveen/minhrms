import { expect } from "chai";
import { describe, it } from "mocha";
import { generatePassword } from "../../../src/services/auth/RandomPassword";



describe('Generating a random Password',  ()=> {

    it('should return a string of a random password', async() => {
        const result = generatePassword()
        expect(result).to.be.a('string')
    })
})