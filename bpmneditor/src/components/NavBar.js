import UserPicture from "./UserPicture"

export default function NavBar({session, view, exit}){
  return (
    <div>
      {(session)
      ?<UserPicture salir={exit} name={session.name} img={process.env.PUBLIC_URL + "/img/gobierno-facebook-shared.png"}/>
    :<UserPicture />
      }
      <div className="pb-3 d-flex justify-content-between">
      <img width="100px" src={process.env.PUBLIC_URL + "/img/logo.jpeg"}></img>
      <div className="d-flex align-items-center">Secretaría de Tecnologías para la Gestión</div>
      </div>
    <div className="btn-group px-2 w-100" role="group" aria-label="Basic example">
      <button onClick={()=>{view.set("editor")}} type="button" className={(view.actual == "editor")?"btn shadow-sm btn-sm  btn-primary btn2":"btn shadow-sm btn-sm"}>Editor</button>
      <button onClick={()=>{view.set("buscar")}} type="button" className={(view.actual == "buscar")?"btn shadow-sm btn-sm  btn-primary btn2":"btn shadow-sm btn-sm"}>Buscar</button>
      <button onClick={()=>{view.set("inicio")}} type="button" className={(view.actual == "inicio")?"btn shadow-sm btn-sm  btn-primary btn2":"btn shadow-sm btn-sm"}>Nuevo</button>
    </div>
    </div>
  );
}
