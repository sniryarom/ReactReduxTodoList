import React from 'react';
import TodoList from '../TodoList/TodoList';
import './TodoApp.css'; 


function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

 class TodoApp extends React.Component {
  constructor(props){
    console.debug("constructor started");
     super(props);
     var newArray = [];

     this.state = {text: '', todoList: newArray, filteredList: newArray, isLoaded: false}
     this.getInitialData = this.getInitialData.bind(this)
     this.update = this.update.bind(this)
     this.addItem = this.addItem.bind(this)
     this.removeItem = this.removeItem.bind(this)
     this.checkItem = this.checkItem.bind(this)
     this.filterList = this.filterList.bind(this)
     console.debug("constructor ended");
   }

   componentWillMount() {
      console.debug('TodoApp: component will mount');  
      this.getInitialData();
   }

   getInitialData() {
      let newArray = [];
  
      fetch('http://localhost:5000/api/todo')
      .then(status)
      .then(json)
      .then((data) => {
        console.log('Request succeeded with JSON response', data);
        data.map((item) => (  
            newArray.push(item)
        ))
        console.debug('New array of todo: ', newArray);
        this.setState({todoList: newArray, filteredList: newArray})
      }).catch(function(error) {
        console.log('Request failed', error);
      });
   }

   update(e){
      this.setState({text: e.target.value})
   }

   addItem(){
    if (this.state.text !== '') {
      let newArray = this.state.todoList.slice();    
      newArray.push({text: this.state.text, isComplete: false});   
      this.setState({todoList: newArray, text: ''})
      console.debug('New item added: ' + this.state.text + '. Num of items: ' + newArray.length)
    }
    
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
    this.addItem();  
    }
  }

  checkItem(e, index){
    console.log('check item clicked');
    let array = this.state.todoList;
    array[index].isComplete = (e.target.checked) ? true : false;
    this.setState({todoList: array})
  }

  removeItem(e, index) {
    const key = this.state.todoList[index].key;
    const url = 'http://localhost:5000/api/todo';
    let newArray = [];
    fetch(url + '/' + key, {
      method: 'delete'
    })
    .then(status)
    .then(json)
    .then((data) => {
      console.log('Request succeeded with JSON response', data);
      data.map((item) => (  
          newArray.push(item)
      ))
      console.debug('New array of todo: ', newArray);
      this.setState({todoList: newArray, filteredList: newArray})
    }).catch(function(error) {
      console.log('Request failed', error);
    });
     
  }


  filterList (filter){
    console.log('filter applied with filter: ' + filter)
    var filteredArray = this.state.todoList;
    switch(filter) {
      case "Closed":
        filteredArray = this.state.todoList.filter((item) => item.isComplete === true );
        break;
      case "Open":
        filteredArray = this.state.todoList.filter((item) => item.isComplete === false );
        break;
      case "All":
      default:
        filteredArray = this.state.todoList;
          break;

    }
    this.setState({filteredList: filteredArray});
  }
  
  render(){
     console.log('App render');
     return (
       <div>
        <input type="text" className='inputBtnStyle' value={this.state.text} onChange={this.update} onKeyPress={this.handleKeyPress} />
        <button onClick={this.addItem} >ADD</button>
          <hr/>
          <div>
            <TodoList list={this.state.filteredList} checkItemFunc={this.checkItem} removeItemFunc={this.removeItem} filterFunc={this.filterList} />
          </div>
       </div>
     )
   }
 } 

 export default TodoApp