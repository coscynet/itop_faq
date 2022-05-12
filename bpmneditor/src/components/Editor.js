import Select from './Select'


export default function Editor({diagram, modeler, orgs}){

  const update = async (e)=>{
    const { xml } = await modeler.saveXML();
    diagram.info.xml = xml;
    diagram.info[e.target.name] = e.target.value;
    diagram.set({...diagram.info})
    console.log({...diagram.info});
  }
  const handler = async (e)=>{
    e.preventDefault();
    const { xml } = await modeler.saveXML();
    diagram.info.xml = xml;
    alert(await  diagram.push(diagram.info) );
  }

  const updateOrg = async (e)=>{
    const { xml } = await modeler.saveXML();
    diagram.info.xml = xml;
    diagram.info.orgId = e.id;
    diagram.info.orgName = e.name;
    diagram.set({...diagram.info})
  }

  return (
    <form onSubmit={handler} className="pt-4">
     <div className="bio-properties-panel-entry" data-entry-id="name">
       <div className="bio-properties-panel-textfield">
         <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
           Nombre del proceso
         </label>
         <input required name="title" onChange={update} defaultValue={diagram.info.title} type="text" spellCheck="false" autoComplete="off" className="bio-properties-panel-input"/>
       </div>
     </div>

     <div className="bio-properties-panel-entry" data-entry-id="name">
       <div className="bio-properties-panel-textfield">
         <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
           Organización
         </label>
         <Select defaultValue={diagram.info.orgName} organizaciones={orgs.list}  change={updateOrg}/>
       </div>
     </div>

    <div className="accordion accordion-flush" id="accordionFlushExample">
     <div className="accordion-item">
       <h2 className="accordion-header py-0" id="flush-headingOne">
         <button className="text-muted accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
           <small>Mas detalles</small>
         </button>
       </h2>
       <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
         <div className="accordion-body p-0">

           <div className="bio-properties-panel-entry" data-entry-id="name">
             <div className="bio-properties-panel-textfield">
               <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
                 Resumen en una oracion
               </label>
               <textarea name="description" onChange={update}  defaultValue={diagram.info.description} className="bio-properties-panel-input"  ></textarea>
             </div>
           </div>
           <div className="bio-properties-panel-entry" data-entry-id="name">
             <div className="bio-properties-panel-textfield">
               <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
                 Objetivo
               </label>
               <textarea  name="objetivo" onChange={update} defaultValue={diagram.info.objetivo}    className="bio-properties-panel-input"  ></textarea>
             </div>
           </div>
           <div className="bio-properties-panel-entry" data-entry-id="name">
             <div className="bio-properties-panel-textfield">
               <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
                 Alcance
               </label>
               <textarea  name="alcance" onChange={update} defaultValue={diagram.info.alcance}   className="bio-properties-panel-input"  ></textarea>
             </div>
           </div>
           <div className="bio-properties-panel-entry" data-entry-id="name">
             <div className="bio-properties-panel-textfield">
               <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
                 Entrada
               </label>
               <textarea  name="entrada" onChange={update} defaultValue={diagram.info.entrada}   className="bio-properties-panel-input"  ></textarea>
             </div>
           </div>
           <div className="bio-properties-panel-entry" data-entry-id="name">
             <div className="bio-properties-panel-textfield">
               <label htmlFor="bio-properties-panel-name" className="bio-properties-panel-label">
                 Salida
               </label>
               <textarea name="salida" onChange={update} defaultValue={diagram.info.salida}  className="bio-properties-panel-input"  ></textarea>
             </div>
           </div>

         </div>
       </div>
     </div>
   </div>
   <div className="bio-properties-panel-entry" data-entry-id="name">
       <button  className="btn2 btn btn-sm w-100 btn-primary">{(!diagram.info.id)?'Guardar Nuevo':'Guardar cambios'}</button>
   </div>
 </form>
  );
}

// <div className="bio-properties-panel-entry mt-2" data-entry-id="name">
//  <button  className="btn btn-sm w-100 btn-secondary">{(!diagram.info.id)?'GUARDAR EN LOCAL':'GUARDAR EN LOCAL'}</button>
// </div>
