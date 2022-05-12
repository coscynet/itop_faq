import {useState, createContext} from 'react'

export default function Login({submit}){
  const [msj, setMsj] = useState("")

  const handle = async (e)=>{
    e.preventDefault();
    setMsj(await submit({
      username:e.target.username.value,
      password:e.target.password.value
    }));
  }

  return (
    <div id="login">
      <form onSubmit={handle} className="pt-4">
        <div className="bio-properties-panel-entry" data-entry-id="name">
          <div className="bio-properties-panel-textfield">
            <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
              Usuario
            </label>
            <input defaultValue="admin" required  type="text" name="username" spellCheck="false" autoComplete="off" className="bio-properties-panel-input"/>
          </div>
        </div>
        <div className="bio-properties-panel-entry" data-entry-id="name">
          <div className="bio-properties-panel-textfield">
            <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
              Contraseña
            </label>
            <input defaultValue="admin" required  type="password" name="password" spellCheck="false" autoComplete="off" className="bio-properties-panel-input w-100"/>
          </div>
        </div>
        <div className="bio-properties-panel-entry" data-entry-id="name">
            <button type="submit" className="mt-2 btn btn2 btn-sm w-100 btn-primary">Ingresar</button>
            <small className="my-2 text-secondary">{msj}</small>
        </div>
      </form>
    </div>
  );
}
