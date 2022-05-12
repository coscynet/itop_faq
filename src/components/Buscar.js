import Select from './Select'

export default function Buscar({orgs, filterDiagram, diagrama }){
  const handler = async (org)=>{
    orgs.setOrgSelected(org);
  }

  function generatePdf(d) {
    console.log("generandoPDF");
    let win = window.open(process.env.PUBLIC_URL + `/diagrama/${d.id}`, '_blank');
    win.focus();
    setTimeout(function(){
      win.print()
    }, 2000);
  }

  function generateImg(d) {
    let svg = encodeURIComponent(d.svg);
    let a = document.createElement("a");
    a.href = 'data:application/bpmn20-xml;charset=UTF-8,' + svg
    a.setAttribute('download',d.title+".svg"); a.style = "display: none";
    document.body.appendChild(a);a.click()
  }

  function generateBpmn(d) {
    let a = document.createElement("a");
    a.href = 'data:application/bpmn20-xml;charset=UTF-8,' + d.xml
    a.setAttribute('download',d.title+".bpmn")
    a.style = "display: none";
    document.body.appendChild(a);
    a.click()
  }

  function showDoc(d) {
    let win = window.open(process.env.PUBLIC_URL + `/diagrama/${d.id}`, '_blank');
    win.focus();
  }

  let diagramas = (<small className="text-muted">No se encontraron archivos</small>)
  if(orgs.selected && orgs.selected.diagramas.length){
      diagramas = orgs.selected.diagramas.filter((d)=>{
          return d.title.toLowerCase().includes(filterDiagram.term.toLowerCase())
      }).map((d)=>{
        return (
          <div key={d.id} className="itemDiagram card p-2 shadow-sm mb-2">
            <div className="btnBoxCrud">
              <div className="btnCrud d-flex justify-content-center">
                <img onClick={()=>{
                  showDoc(d)
                }} className="p-2 shadow-sm" width="33px" src={process.env.PUBLIC_URL + "/img/eye.svg"}/>
                <img onClick={()=>{
                  diagrama.delete(d)
                }} className="p-2 shadow-sm" width="33px" src={process.env.PUBLIC_URL + "/img/delete.svg"}/>
                <img onClick={()=>{
                  diagrama.set(d)
                }} className="p-2 shadow-sm" width="33px" src={process.env.PUBLIC_URL + "/img/edit.svg"}/>
                <img className="p-2 shadow-sm" width="33px" src={process.env.PUBLIC_URL + "/img/download.svg"} data-bs-toggle="dropdown" aria-expanded="false" />
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><button onClick={(e)=>generatePdf(d)} className="dropdown-item" type="button">
                  pdf</button></li>
                  <li><button onClick={(e)=>generateImg(d)} className="dropdown-item" type="button">imagen</button></li>
                  <li><button onClick={(e)=>generateBpmn(d)} className="dropdown-item" type="button">bpmn</button></li>
                </ul>
              </div>
            </div>
            <div className="BoxSvgImg" dangerouslySetInnerHTML={{ __html: d.svg }}>
            </div>
            <small><strong>{d.title}</strong></small>
            <label className="bio-properties-panel-label">
              {d.description}
            </label>
          </div>
        )
      })
  }

  return (
    <div className="pt-4">
      <div className="bio-properties-panel-entry" data-entry-id="name">
        <div className="bio-properties-panel-textfield">
          <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
            Seleccione una organización
          </label>
          <Select defaultValue={(orgs.selected)?orgs.selected.name:""} organizaciones={orgs.list}  change={handler}/>
        </div>
      </div>
      <div className="bio-properties-panel-entry" data-entry-id="name">
        <div className="bio-properties-panel-textfield">
          <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
            Filtrar diagrama
          </label>
          <input onChange={(e)=>{
            filterDiagram.set(e.target.value)
          }} defaultValue={filterDiagram.term} type="text" name="name" spellCheck="false" autoComplete="off" role="search" aria-label="Search" className="bio-properties-panel-input"/>
        </div>
      </div>
      <div className="bio-properties-panel-entry" data-entry-id="name">
        {diagramas}
      </div>
    </div>

  );
}
