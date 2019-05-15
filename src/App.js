import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

class Wopper extends Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      outputs:[],
      typeSelection:null,
      displayOutputs:[],
      personalDisplay: false,
      outputColourClasses:["output-c0","output-c1", "output-c2","output-c3","output-c4","output-c5","output-c6","output-c7","output-c8","output-c9","output-c10","output-c11"],
      outputColourClassesActive:["output-c0 focusGrow","output-c1 focusGrow", "output-c2 focusGrow","output-c3 focusGrow","output-c4 focusGrow","output-c5 focusGrow","output-c6 focusGrow","output-c7 focusGrow","output-c8 focusGrow","output-c9 focusGrow","output-c10 focusGrow","output-c11 focusGrow"],
      inFocus:null,
      oCCpos:0,
      pageSelection:null

    }
    this.setDisplay = this.setDisplay.bind(this);
    this.setFocus = this.setFocus.bind(this);

  }

  async componentDidMount(){
    let typeResponse = await fetch("http://localhost:1337/types");
    let outputsResponse = await fetch("http://localhost:1337/outputs");

    if (!outputsResponse.ok) {
      console.log("##outputsResponse = "+outputsResponse);
      return
    }
    let outputs = await outputsResponse.json();
    var types = await typeResponse.json();

    console.log(types);
    types.sort(function(a, b){
      return a.Sequence - b.Sequence;
    });
    outputs.sort(function(a, b){
      return a.Sequence - b.Sequence;
    });

      for(let i =0; i<outputs.length; i++){
        outputs[i].types.sort(function(a, b){
          return a.Sequence - b.Sequence;
        });
      }
    this.setState({loading: false, outputs : outputs, types: types})
    this.setDisplay(null);

  }
  setFocus(id){
    console.log("hi :)");
    let currFocus = this.state.inFocus;
    if(currFocus !== id){
      this.setState({inFocus: id});
      console.log("this.state.inFocus = ",this.state.inFocus);
    }else{
      console.log("no change in focus");
    }

  }
  render(){
    if(!this.state.loading){
      return(
        <div className="container">
          <HeadWanger/>
          <StrapWanger/>


          <Switch>

            <Route
              exact path ="/page/:permalink"
              render={(props) => (
                  <PageLayoutWanger {...props } outputs={this.state.outputs} pageSelection={this.state.pageSelection}/>
                )}/>

            <Route
            path='/'
            render={(props) => (
              <div>
              <ControlWanger workTypes = {this.state.types} wopperState = {this.state.outputs} setDisplay = {this.setDisplay} colourClasses = {this.state.outputColourClasses} cClass= {this.state.oCCpos}/>
              <HomeLayoutWanger {...props} workTypes = {this.state.types}  wopperState = {this.state.outputs} freshDisplays = {this.state.displayOutputs} colourClasses = {this.state.outputColourClasses} orderedTypes = {this.state.types} boxSets = {this.state.boxSets} offSets = {this.state.offSets} setFocus= {this.setFocus}  isFocus= {this.state.isFocus}/>
              </div>
            )}/>

          </Switch>
        <FootWanger/>
      </div>);
    }
    return (<h2 className="outputList-title">Waiting for API...</h2>);
  };
  setDisplay(t){
    console.log("t= "+t);
    let tmpDisp =[];
    if(!this.state.personalDisplay){
      console.log("not set");
      let allOutputs = this.state.outputs;
      tmpDisp = allOutputs;
      console.log(this.state.displayOutputs);
      this.setState({personalDisplay:true});
    }else{
      console.log("set");
      this.setState({typeSelection:t,displayOutputs:0});

      console.log("state t = "+t);
      var sO = this.state.outputs;
      for(let i =0; i < sO.length; i++){
        console.log(sO.length);
        console.log(sO[i].types);
        for(let j =0; j < sO[i].types.length; j++){
          console.log("sO[i].types[j].Type= "+sO[i].types[j].Type);

          if(sO[i].types[j].Type === t){
            console.log("add "+sO[i].types[j].Type);
            tmpDisp.push(sO[i]);
          }
        }
      }
    }
    this.setState({displayOutputs: tmpDisp});
  }


}
class HeadWanger extends Component{
  render(){
    return(
      <div className="headWanger"><a href = "/">S-J Inputs and Outputs </a></div>
    )
  };
}
class StrapWanger extends Component{
  render(){
    return(
      <div className="strap-line">Making Cool things, both Physical and Digital</div>
    )
  }
}

class ControlWanger extends Component{

  pinger(t){
    console.log("pinger type.Type= "+t);
    this.props.wopperState.typeSelection= t;
    console.log(this.props.wopperState.typeSelection);
  this.props.setDisplay(t);
  }

  render(){
    return(
      <div className="control-wanger">

        <ul>
        {this.props.workTypes.map((type, index) => {
          return (
                <li id = {type.Sequence}  key={type.id}> <a className = { outputColours(this.props.colourClasses, type.Sequence)} href="#" onClick={() => this.pinger(type.Type)}> {type.Type} </a> </li>
          );
        })}
        </ul>

      </div>
    )
  }
}

class HomeLayoutWanger extends Component{
  constructor(props){
    super(props);
    this.state = {
      isFocus:null,
      classToAdd:""


    }

  }
  handleMouseOver(id){
    let sf = this.state.isFocus;
    this.setState({isFocus:id})
    this.setState({classToAdd:"focusGrow"})
    console.log(id);
    this.props.setFocus(id);


  }
  handleMouseOut(id){
    this.setState({isFocus:null})
    console.log("and im out!");


  }
  handleClick(id){
    console.log(id);
    this.setState({pageSelection:id})

  }
  setURL(pageId){
    let url = "/page/:"+pageId;
    return url;
  }
  render(){
    return(
      <div className="outputList">
         <div className="outputList-container">
         {console.log(this.props.freshDisplays)}
         {this.props.freshDisplays.map((output, index) => {
           return (
             <div className="outputBox" id= {output.id} key={output.id}>

              {output.types.map((Type, index) => {

                  return(
                    <div id={Type.Type} key={Type.id} className={boxColour(Type.Type, this.props.orderedTypes, this.state.classToAdd, output.id, this.state.isFocus)} style = {setBoxPos(output.types.length, index)}></div>
                  )

             })}


              <Link  to ={this.setURL(output.permalink)} onMouseOver={()=>this.handleMouseOver(output.id)} onMouseOut={()=>this.handleMouseOut(output.id)} onClick={()=>this.handleClick(output.id)}><img className = "thumbHero" src={ "http://localhost:1337/" +output.thumb.url} alt={output.Name}/></Link>
              <Link className = "titleHero"  to ={this.setURL(output.permalink)}  onClick={()=>this.handleClick(output.id)}>{output.Name} </Link>

             </div>
           );
         })}

         </div>
       </div>
    )
  }
}
class PageLayoutWanger extends Component{
  constructor(props){
    super(props);
    this.state = {
      selectedOutput:[],
      other:"ting"
    }

  }
  updateState(){


  }
  render(){
    console.log(this.props);
    var page;
    let pageId = this.props.match.params.permalink;

    console.log(pageId);
    pageId = pageId.replace(/^:/, '');
    console.log(pageId);
    for(let i=0 ; i <= this.props.outputs.length -1 ; i++){
      let thisOutput = this.props.outputs[i];
      if(thisOutput.permalink === pageId){
        console.log("Match");
        page = thisOutput;

        console.log(this.state.selection);

      }
    }


    return(
    <div className="feature-item">
      <div className="page-banner">
      <img className = "banner-hero" src={ "http://localhost:1337/" +page.Banner.url} alt={page.Name}/>

      </div>
    <div className="pageBody">

      We are looking at{page.Name} <br/>
      {page.Description}

    </div>
    </div>
  )
  }


}

function setBoxPos(typelength, index){
  let mid = Math.trunc(typelength/2);
  if(mid===0){mid=1;}
  let gap = 4;
  let thisOffset = (mid - index ) * gap;
  let x;
  let y;
  if(index< mid){ // 0 <= 1
    x = ((thisOffset) * -1);
    y = thisOffset;
  }else if(index >= mid){
    x = (thisOffset * -1)+gap;
    y = thisOffset - gap;
  }
  return {left: x+'px', top: y+'px'};
}

function boxColour(t,o,extraClass,thisId, currFocus){
  let ec;
  if(thisId == currFocus){
     ec = extraClass;
  }else{
     ec = "";
  }

  let len = o.length;
  for(let i = 1; i <=len; i++){
    if(o[i-1].Type === t){
      let ii = i.toString();

      return "output-c"+ii+" colourBox "+ec;
    }
  }

}

function outputColours(classArray, currentPosition){
  return (classArray[currentPosition]);
}



class FootWanger extends Component{
  render(){
    return(
      <div className="foot-wanger">foot stuff</div>
    )
  };
}

export default Wopper;
