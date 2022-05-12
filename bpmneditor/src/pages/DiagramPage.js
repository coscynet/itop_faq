import {useEffect, useContext, useState} from 'react'
import {ContextGlobal} from './../context/Context'

import BpmnModeler from 'bpmn-js/lib/Modeler';
import {useParams} from 'react-router-dom'

let modeler = null;

export default function DiagramPage() {
  const {id} = useParams();
  const [d, setD] = useState(null);

  const {
    diagram
  } = useContext(ContextGlobal);
    useEffect(async ()=>{
      modeler = new BpmnModeler({container: '#js-canvasVisor'});
      let diagrama = (await diagram.get(id)).fields;
      await modeler.importXML(atob(diagrama.file.data))
      let definitions  = await modeler.getDefinitions();
      let doc = ""
      for (let i in definitions.rootElements) {
         doc += getDocumentDefinition(definitions.rootElements[i]);
      }
      let {svg} = await modeler.saveSVG();

      setD({
        ...diagrama, svg, doc
      });
    },[])

    function info() {
      return (<>
        <small>Document {id}</small>
        <h1 className="pt-3">{d.name || "Sin Nombre"}</h1>
        <p>{d.description}</p>
        <div><strong>Objetivo: </strong> {d.objetivo} <br/><br/></div>
        <div><strong>Alcance: </strong> {d.alcance} <br/><br/></div>
        <div><strong>Entrada: </strong> {d.entrada} <br/><br/></div>
        <div><strong>Salida: </strong> {d.salida} <br/><br/></div>
        <div className="svgBOX py-3" dangerouslySetInnerHTML={{ __html: d.svg }} ></div>
        <div dangerouslySetInnerHTML={{ __html: d.doc }} ></div>

        </>
      )
    }

  return(
    <section className="container py-5">
      <div className="text-center">
        <img width="200px" src={process.env.PUBLIC_URL + "/img/descarga.png"}/>
      </div>
      {(d != null)?info():'...Cargando'}
      <div id="js-canvasVisor"></div>
    </section>
  );
}





function getDocu(arr) {
  try {
    return arr[0].text
  } catch (e) {
    return ""
  }
}

function getDocumentDefinition(process) {

  let html = ""
  html += `<small class="text-secondary">${process.id}</small><h2>${process.name || ""}</h2>`
  html += `<p>${getDocu(process.documentation) || "sin description"}</p>`

  if(process.flowElements){
      process.flowElements = process.flowElements.filter((i)=>{
          return i.$type == 'bpmn:StartEvent' || i.$type == 'bpmn:Task' || i.$type == 'bpmn:SubProcess'
      }).sort((x,y)=>{
        if (x.name < y.name) {return -1;}
        if (x.name > y.name) {return 1;}
        return 0;
      })

      for (let k in process.flowElements){
        let  a = process.flowElements[k];
        if(a.$type == 'bpmn:StartEvent'){
          html += `<small class="text-warning">StartEvent</small><h3>${a.name || ""}</h3>`
          html += `<p>${getDocu(a.documentation) ||  "sin description"}</p>`
        }
        if(a.$type == 'bpmn:Task'){
          html += `<small class="text-primary">Actividad</small><h3>${a.name}</h3>`
          html += `<p>${getDocu(a.documentation)  || "sin description"}</p>`
        }
        if(a.$type == "bpmn:SubProcess") {
          html += `<hr/>`
          html += getDocumentDefinition(a)
        }
      }
  }
  return html;
}
