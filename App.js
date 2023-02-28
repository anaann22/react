import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tree from 'react-d3-tree';


const containerStyles = {
    width: '100%',
    height: '100vh',
}

const nullNode = 'NIL'



const redColor = {
    shapeProps: {
        shape: 'circle',
        r: 11,
        fill: 'red',
        stroke: 'white',
    }
}

const blackColor = {
    shapeProps: {
        shape: 'circle',
        r: 11,
        fill: 'black',
        stroke: 'white',
    }
}


//1 Fiecare nod este fie rosu, fie negru
//2 Rădăcina este este de culoare neagră
//3 Fiecare frunză Nil este de culoare neagră
//4 Fiii unui nod rosu sunt negri.
//5 Fiecare cale dintre un nod si o frunză descendentă contine acelasi număr de noduri de culoare neagră.


class App extends Component {
    state = {
        input1: '',
        input2: '',
        myTreeData: [{ name: nullNode, nodeSvgShape: blackColor }],
        forceMount: true,
        searchPath: ''
    }

    valueFound = false;

    componentDidMount() {
        const dimensions = this.treeContainer.getBoundingClientRect();
        this.setState({
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 7
            }
        });
    }

    insertNode = () => {
        if(this.state.input1 != '') {
            let value = this.state.input1;
            console.log('Value entered = ' + value);
            let tree = this.state.myTreeData;
            // Root is null
            if(tree[0].name == nullNode) {
                tree = [{
                    name: value,
                    nodeSvgShape: blackColor,
                    children: [{ name: nullNode, nodeSvgShape: blackColor }, { name: nullNode, nodeSvgShape: blackColor }]
                }]
            } 
            else {
                // TREE-INSERT procedure
                var rightDirection = true;
                var leftDirection = false;
                var previousNode = null;
                var previousDirection = leftDirection;
                var currentNode = tree[0];
                var prePreviousNode = null;
                var prevPrePreviousNode = null;
                var isValueFound = false;
                while (currentNode.name != nullNode) {
                    prevPrePreviousNode = prePreviousNode;
                    prePreviousNode = previousNode;
                    previousNode = currentNode;
                    if (parseInt(value) > parseInt(currentNode.name)) {
                        currentNode = currentNode.children[1];
                        previousDirection = rightDirection;
                    } 
                    else if (parseInt(value) < parseInt(currentNode.name)) {
                        currentNode = currentNode.children[0];
                        previousDirection = leftDirection;
                    }
                    else {
                        isValueFound = true;
                        break;
                    }
                }
                if(isValueFound == false) {
                    if (previousDirection == leftDirection) {
                        previousNode.children[0] = { name : value, nodeSvgShape: redColor,
                            children: [{ name: nullNode, nodeSvgShape: blackColor }, 
                            { name: nullNode, nodeSvgShape: blackColor }] }
                        currentNode = previousNode.children[0];
                    }
                    else {
                        previousNode.children[1] = { name : value, nodeSvgShape: redColor,
                            children: [{ name: nullNode, nodeSvgShape: blackColor }, 
                            { name: nullNode, nodeSvgShape: blackColor }] }
                        currentNode = previousNode.children[1];
                    }
                    // RB-INSERT
                    while (previousNode.nodeSvgShape == redColor) {
                        if(previousNode.name == prePreviousNode.children[0].name) {
                            var y = prePreviousNode.children[1];
                            if(y.nodeSvgShape == redColor) {
                                previousNode.nodeSvgShape = blackColor;
                                y.nodeSvgShape = blackColor;
                                prePreviousNode.nodeSvgShape = redColor;
                                currentNode = prePreviousNode;
                            }
                            else {
                                if(currentNode.name == previousNode.children[1].name) {
                                    currentNode = previousNode;
                                    // LEFT-Rotate
                                    var temp = currentNode.children[1];
                                    currentNode.children[1] = temp.children[0];
                                    if(temp.children[0].name != nullNode) {
                                        temp = currentNode;
                                    }
                                    currentNode = previousNode;
                                    if(previousNode.name == nullNode) {
                                        tree[0] = temp;
                                    }
                                    else if(currentNode.name == previousNode.children[0].name) {
                                        previousNode.children[0] = temp;
                                    }
                                    else {
                                        previousNode.children[1] = temp;
                                    }
                                    temp.children[0] = currentNode;
                                    previousNode = temp;
                                    // end of LEFT-Rotate
                                }
                                previousNode.nodeSvgShape = blackColor;
                                prePreviousNode.nodeSvgShape = redColor;
                                // RIGHT-Rotate
                            }
                        }
                        else {
                            var y = prePreviousNode.children[0];
                            if(y.nodeSvgShape == redColor) {
                                previousNode.nodeSvgShape = blackColor;
                                y.nodeSvgShape = blackColor;
                                prePreviousNode.nodeSvgShape = redColor;
                                currentNode = prePreviousNode;
                            }
                            else {
                                if(currentNode.name == previousNode.children[0].name) {
                                    currentNode = previousNode;
                                    // RIGHT-Rotate
                                    var temp = currentNode.children[0];
                                    currentNode.children[0] = temp.children[1];
                                    if(temp.children[1].name != nullNode) {
                                        temp = currentNode;
                                    }
                                    currentNode = previousNode;
                                    if(previousNode.name == nullNode) {
                                        tree[0] = temp;
                                    }
                                    else if(currentNode.name == previousNode.children[1].name) {
                                        previousNode.children[1]= temp;
                                    }
                                    else {
                                        previousNode.children[0] = temp;
                                    }
                                    temp.children[1] = currentNode;
                                    previousNode = temp;
                                    // end of RIGHT-Rotate(T,currentNode)
                                }
                                previousNode.nodeSvgShape = blackColor;
                                prePreviousNode.nodeSvgShape = redColor;
                                // LEFT-Rotate(T,prePreviousNode)
                                
                                // end of LEFT-Rotate(T,prePreviousNode)
                            } 
                        } 
                    } 
                    tree[0].nodeSvgShape = blackColor
                }
            }
            this.myTreeData = tree
            this.setState({
                input1: '',
                myTreeData: tree,
                forceMount: !this.state.forceMount  
            });
        }
    }

    searchWithTimeOut = (currentNode, value) =>  
    { 
        setTimeout(function() { 

        }, 1000);
        return currentNode;
    }

    sleep = (miliseconds) => {
        var currentTime = new Date().getTime();
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
    }


    handleInputChange = name => event => {
        this.setState({
            [name] : event.target.value
        });
    }
 
            
    render() {
        return (
        <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
            <div style={{marginTop:-15, height:50, backgroundColor: "#ac63b6"}}>
              <h1 style={{paddingLeft: 1200, paddingTop:7 , marginTop:15, color: "#482486"}}> Red-Black Tree</h1>
            </div>
            <br/>
            <div style={{display: "flex", alignItems: "center"}}>
              <input style={{marginLeft: 15, padding: 10, fontSize: 18}} type ="text" placeholder="Enter a value to be added" value= {this.state.input1} onChange= {this.handleInputChange('input1')}/>
              <button className="custom-button" onClick={ ()=> this.insertNode()}> Insert </button>
            </div>
            <br/>

            <Tree 
            data ={this.state.myTreeData} 
            orientation ={"vertical"} 
            translate={this.state.translate}
            collapsible={false}
            depthFactor={60}
            key={this.state.forceMount}
            />
            </div>
        );
    }
}

export default App;
