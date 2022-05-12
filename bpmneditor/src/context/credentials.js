export default class Credentials {
  constructor() {
    console.log("make credentials");
    this.hash = "34789v570548t"
  }
  getSession(){
    return JSON.parse(localStorage.getItem(this.hash));
  }
  setSession(data){
    return localStorage.setItem(this.hash,JSON.stringify(data));
  }
  deleteSession(){
    return  localStorage.removeItem(this.hash);
  }
}
