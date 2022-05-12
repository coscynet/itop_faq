import BpmnModeler from 'bpmn-js/lib/Modeler';
import {useState, createContext} from 'react'
import ConexionApi from './conexionApi'
import Credentials from './credentials'

let bpmnModelertemp = new BpmnModeler({
  container: '#js-canvastemp'
});

const getSVG =  async (xml)=>{
    await bpmnModelertemp.importXML(xml)
    let {svg} = await bpmnModelertemp.saveSVG();
    // let doc = await bpmnModelertemp.getDefinitions().rootElements;
    let doc;
    // doc = "<section class='container px-2 py-5'>" + getDocumentDefinition(doc[0]) + "</section>";
    doc = "";
    return {svg, doc};
}

export const ContextGlobal = createContext()

// ESTADOS GENERALES
const initialState = {
  session: null,
  view:"editor",
  organizaciones:[],
  orgSelected: null,
  termFilterDiagram:"",
  diagramaEdit: {
    id:null,
    title:"Nuevo diagrama",
    xml:'<?xml version="1.0" encoding="UTF-8"?> <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"> <bpmn2:process id="Process_1" isExecutable="false"> <bpmn2:startEvent id="StartEvent_1"/> </bpmn2:process> <bpmndi:BPMNDiagram id="BPMNDiagram_1"> <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"> <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"> <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </bpmn2:definitions>',
    description:"",
    orgId:"",
    orgName:""
  }
}

const apiConexion = new ConexionApi();
const credentials = new Credentials();

export default function Context(props){

  // Datos y credenciales, en local del usuario
  if(initialState.session == null){
    initialState.session = credentials.getSession();
    if(initialState.session != null ) apiConexion.setCredential(initialState.session.username, initialState.session.password)
  }

  const [state, setState] = useState(initialState)

  // Login
  const logIn = async (e)=>{
    let log = await apiConexion.logIn(e);
    if (log.code != 0) return log.message
    let newSession = {...e, name: e.username}
    credentials.setSession(newSession);

    // download orgs
    const {code,message,objects} = await apiConexion.getOrgs();
    let orgArray = []
    for (let key in objects){
      orgArray.push({
        id:objects[key].key,
        name:objects[key].fields.name,
        diagramas:[]
      })
    }
    setState({
      ...state,
      session: newSession,
      organizaciones: orgArray
    })

    return "Logueado correctamente"
  }
  const logOut = ()=>{
    credentials.deleteSession();
    setState({
      ...state,
      session: null,
      view:"inicio"
    })
  }

  // view
  const setView = (newview)=>{
    setState({
      ...state,
      view: newview
    })
  }

  // organizaciones
  const download = async ()=>{
    const {code,message,objects} = await apiConexion.getOrgs();
    let orgArray = []
    for (let key in objects){
      orgArray.push({
        id:objects[key].key,
        name:objects[key].fields.name,
        diagramas:[]
      })
    }
    setState({
      ...state,
      organizaciones: orgArray
    })
  }

  // añade los diagramas a determinada org
  const setOrgSelected = async (neworgSelected)=>{
    const {code,message,objects} = await apiConexion.getDiagrams(neworgSelected.id);
    let newListDiagrams = []
    if(objects != null){
      for (let key in objects) {
          // console.log(objects[key]);
          let xml = atob(objects[key].fields.file.data)
          let {svg,doc} = await getSVG(xml)
        newListDiagrams.push({
          id:objects[key].key,
          title:objects[key].fields.name,
          description:objects[key].fields.description,
          alcance:objects[key].fields.alcance,
          entrada:objects[key].fields.entrada,
          objetivo:objects[key].fields.objetivo,
          salida:objects[key].fields.salida,
          orgId:objects[key].fields.org_id,
          orgName:objects[key].fields.org_name,
          xml,svg,doc
        })
      }
    }
    neworgSelected.diagramas = newListDiagrams;
    setState({
      ...state,
      orgSelected: neworgSelected
    })
  }

  // TermnFilter diagram
  const settermFilterDiagram = (term)=>{
    setState({
      ...state,
      termFilterDiagram: term
    })
  }

  // diagrama
  const setNewDiagram = (newDiagram)=>{
    setState({
      ...state,
      view:"editor",
      diagramaEdit: newDiagram
    })
  }
  const newDiagrama = ()=>{
    setState({
      ...state,
      view:"editor",
      diagramaEdit: {
        id:null,
        title:"diagram name",
        xml:'<?xml version="1.0" encoding="UTF-8"?> <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"> <bpmn2:process id="Process_1" isExecutable="false"> <bpmn2:startEvent id="StartEvent_1"/> </bpmn2:process> <bpmndi:BPMNDiagram id="BPMNDiagram_1"> <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"> <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"> <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </bpmn2:definitions>',
        description:"",
        orgId:"",
        orgName:""
      }
    })
  }

  const uploadDiagrama = async (newDiagram)=>{
    const ret = await apiConexion.uploadDiagrama(newDiagram);
    // console.log("Context 171",ret);
    if(ret.code == 0){
      setOrgSelected(state.orgSelected);
      return "Operación exitosa"
    }
    return "Error, verifique permisos o datos"
  }

  const deleteDiagram = async (diagram)=>{
    const ret = await apiConexion.deleteDiagrama(diagram.id);
    // console.log("Context 181",ret);
    if(ret.code == 0){
      setOrgSelected(state.orgSelected);
      return "Operación exitosa"
    }
    return "Error, verifique permisos o datos"
  }

  const getDiagramById = async (id)=>{
    const ret = await apiConexion.getDiagramById(id);
    if(ret.code == 0){
      return ret.objects["BPMN::"+id]
    }
    return null
  }


  return (
    <ContextGlobal.Provider value={{
      session: state.session,
      view:{actual:state.view,set:setView},
      log:{in:logIn,out:logOut},
      orgs:{
        list:state.organizaciones,
        selected:state.orgSelected,
        download,setOrgSelected
      },
      filterDiagram:{
        term:state.termFilterDiagram,
        set:settermFilterDiagram
      },
      diagram:{
        info:state.diagramaEdit,
        set:setNewDiagram,
        delete:deleteDiagram,
        push:uploadDiagrama,
        new:newDiagrama,
        get:getDiagramById
      }
    }}>
    {props.children}
    </ContextGlobal.Provider>
  )
}
