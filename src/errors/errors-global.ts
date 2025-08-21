export class ErrorsGlobal extends Error{
    constructor(
        public message: string,
        public status_code: number,
        public description?: string
    ){
        super()
    }
}