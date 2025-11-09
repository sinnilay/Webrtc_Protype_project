import React from 'react';

const Todo = ({todo,deltodo,idxx}) => {
    return (
        <div onClick={()=>deltodo(idxx)}>
           {todo} 
        </div>
    );
}

export default Todo;
