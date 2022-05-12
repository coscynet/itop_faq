export default class ConexionApi {
  constructor() {
    this.user = null;
    this.pass = null;
    // this.url = "http://190.192.35.48/itop/webservices/rest.php"
    this.url = "http://10.100.4.173/itop/webservices/rest.php"
    console.log("make api conection");
  }

  setCredential(user, pass){
    this.user = user;
    this.pass = pass;
  }

  async logIn(credential){
    this.user = credential.username;
    this.pass = credential.password;
    let res =  await this.fetch({
       "operation": "core/get",
       "operation":"list_operations"
     })
     console.log(res);
     return res
  }

  async getOrgs(){
    return await this.fetch({
       "operation": "core/get",
       "class": "Organization",
       "bSearchMode": true,
       "key":"SELECT Organization"
     })
  }

  async getDocumentTypes(){
    return await this.fetch({
       "operation": "core/get",
       "class": "DocumentType",
       "key":"SELECT DocumentType"
     })
  }

  async getDiagramById(id){
    return await this.fetch({
       "operation": "core/get",
       "class": "BPMN",
       "key":  id
     })
  }

  async getDiagrams(id){
    return await this.fetch({
       "operation": "core/get",
       "class": "BPMN",
       "key":{
         "org_id": id
       }
     })
  }
  async deleteDiagrama(id){
    return await this.fetch({
      "operation":"core/delete",
      "class": "BPMN",
      "key":  id
    })
  }



  // draft => Borrador de Documento,
  // obsolete => Obsoleto,
  // published => Publicado
  async uploadDiagrama(diagrama){
    // los datos que mantenemos activos en front
    // id:objects[key].key,
    // title:objects[key].fields.name,
    // description:objects[key].fields.description,
    // alcance:objects[key].fields.alcance,
    // entrada:objects[key].fields.entrada,
    // objetivo:objects[key].fields.objetivo,
    // salida:objects[key].fields.salida,
    // orgId:objects[key].fields.org_id,
    // orgName:objects[key].fields.org_name,
    // xml,svg
    console.log(diagrama);
    let fields =  {
      "name": diagrama.title,
      "org_id": diagrama.orgId,
      "alcance":diagrama.alcance,
      "description":diagrama.description,
      "entrada":diagrama.entrada,
      "objetivo":diagrama.objetivo,
      "salida":diagrama.salida,
      // "documenttype_id":null,

      "file":{
        data: btoa(diagrama.xml),
        mimetype: "application/xml",
        filename: "diagrama.bpmn"
      }
    }
    if(diagrama.id == null){
      return await this.fetch({
            "operation": "core/create",
            "class": "BPMN",
            "comment": "Creación diagrama BPMN",
            "fields" : fields
          })
    }
    return await this.fetch({
       "operation": "core/update",
       "class": "BPMN",
       "key": diagrama.id,
       "comment": "Actualización diagrama BPMN",
       "fields" : fields
       })
  }


  // fetch GENERAL
  async fetch(json){
    let f = new FormData();
    f.append('version', "1.3" );
    f.append('auth_user', this.user);
    f.append('auth_pwd', this.pass );
    f.append('json_data', JSON.stringify(json));
    let res = await fetch(this.url,{
      method: 'POST', body: f
    });
    console.log(res);
    return await res.json();
  }
}
