export interface PostalCodeListResponse {
    "code-list": PostalCode[]
  }
  
  export interface PostalCode {
    codigo_postal: number
    municipio_id: number
    municipio_nombre: string
  }
  