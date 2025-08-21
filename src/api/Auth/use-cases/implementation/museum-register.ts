import { MuseumRepository } from "../../../Museum/repositories/implementation/museum.repository";
import IMuseumRegisterCaseContract from "../IMuseum-register";
import { UserRepository } from "../../../User/repositories/implementation/user.repository";
import { CuratorRepository } from "../../../Curator/repositories/implementation/curator.repository";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";

export class MuseumRegisterCases implements IMuseumRegisterCaseContract{
    constructor(
        private readonly museumRepository: MuseumRepository,
        private readonly userRepository: UserRepository,
        private readonly curatorRepository: CuratorRepository,
    ){}

    public verifyExistCnpj = async (cnpj: string) => {
        const museum = await this.museumRepository.findByCnpj(cnpj)
        if(museum) return true
        return false
    }
    public verifyValidCnpj = async (cnpj: string) => {
        return cnpjValidator.isValid(cnpj)
    }
    public verifyExistEmail = async (email: string) => {
        const [
            museum, curator, user
        ] = await Promise.all([
            this.museumRepository.findByEmail(email),
            this.curatorRepository.findByEmail(email),
            this.userRepository.findByEmail(email)
        ])

        if ( museum || curator || user ) return true
        return false
    }
}