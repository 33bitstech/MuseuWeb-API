export default interface IMuseumRegisterCaseContract {
    verifyExistEmail: (email:string) => Promise<boolean> 
    verifyExistCnpj: (cnpj:string) => Promise<boolean> 
    verifyValidCnpj: (cnpj:string) => Promise<boolean>
}