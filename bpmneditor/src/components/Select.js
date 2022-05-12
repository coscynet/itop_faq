import {useState, useRef } from 'react'

export default function Select({organizaciones, change, defaultValue}) {
  const [option, setOption] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const inputRef = useRef()

  function viewOptions(e) {
    setOption(true)
  }
  function key(e) {
    setBusqueda(e.target.value);
  }

  const org = organizaciones.filter((e)=>{
    return e.name.toLowerCase().includes(busqueda.toLowerCase())
  }).map((e)=>{
    return (
      <div key={e.id} onClick={()=>{
        setOption(false)
        change(e);
        inputRef.current.value = e.name;
      }} className="zelect">{e.name}</div>
    )
  })
  return (
      <div>
          <input required defaultValue={defaultValue} ref={inputRef} onKeyUp={key} onClick={viewOptions} type="text" className="bio-properties-panel-input" />
          <div className={option?'boxListOrg':'d-none'}>
            <div className="ListOrg">
              {org}
            </div>
          </div>
        </div>
  );
}
