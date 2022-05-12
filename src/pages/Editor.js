import {useEffect, useContext} from 'react'
import {ContextGlobal} from './../context/Context'

import NavBar from './../components/NavBar'
import Login from './../components/Login'
import Editor from './../components/Editor'
import Inicio from './../components/Inicio'
import Buscar from './../components/Buscar'

import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import customTranslate from './customTranslate/customTranslate';
import minimapModule from 'diagram-js-minimap';

import './app.css';
let bpmnModeler = null;
let customTranslateModule = {
  translate: [ 'value', customTranslate ]
};


export default function EditorPage(){
  const {
    session,
    view,
    log,
    orgs,
    filterDiagram,
    diagram
  } = useContext(ContextGlobal);

  useEffect(()=>{
    if(bpmnModeler == null){
      console.log("montado editorB");
      orgs.download()
      // Instanciamos el modelador de diagramas
      bpmnModeler = new BpmnModeler({
        container: '#js-canvas',
        propertiesPanel: { parent: '#js-properties-panel'},
        additionalModules: [
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          customTranslateModule,
          minimapModule
        ]
      });
    }
    openDiagram(diagram.info.xml)
    console.log("montado editorUseEffect");

  },[diagram.info])

  useEffect(()=>{
    let commandStack = bpmnModeler.get("commandStack");
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 26)
        commandStack.undo();
      if (event.keyCode === 25)
        commandStack.redo();
    });
  },[])

  let renderView = ()=>{
    switch (view.actual) {
      case "editor":
      return <Editor orgs={orgs} diagram={diagram} modeler={bpmnModeler}/>
      case "buscar":
      return <Buscar orgs={orgs} filterDiagram={filterDiagram} diagrama={diagram}/>
      default:
      return <Inicio diagram={diagram} bpmnModeler={bpmnModeler}/>
    }
  }
  return (
    <div className="content" >
      <img onClick={(e)=>{
          bpmnModeler.get('canvas').zoom('fit-viewport');
          // console.log("change");
        }} className="FocusMap" src={process.env.PUBLIC_URL + "/img/focus.svg"}/>
      <div className="canvas" id="js-canvas"></div>
      <div id="js-properties-panel">
        <div className="px-2">
          <NavBar session={session} view={view} exit={log.out}/>
          <div className={(session == null)?'':'d-none'}>
            <Login submit={log.in}/>
          </div>
          <div className={(session == null)?'d-none':''}>
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  )
}

async function openDiagram(xml) {
  try {
    await bpmnModeler.importXML(xml);
    return true;
  } catch (err) {
    console.error(err);
    await bpmnModeler.importXML('<?xml version="1.0" encoding="UTF-8"?> <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn"> <bpmn2:process id="Process_1" isExecutable="false"> <bpmn2:startEvent id="StartEvent_1"/> </bpmn2:process> <bpmndi:BPMNDiagram id="BPMNDiagram_1"> <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"> <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"> <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </bpmn2:definitions>');
    alert("Error al leer el xml bpmn")
    return false;
  }
}
