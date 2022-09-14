import React from 'react'
import Toast from 'react-bootstrap/Toast';


const Chatpop = ({mess,user="other"}) => {
  return (
    <>
        {user=== "me"? 
        <Toast className=' w-75 bg-dark text-light  ' style={{marginLeft:"23%"}}   >
        <Toast.Body>{mess}  </Toast.Body>
          
        </Toast>
    :
    
        <Toast className='m-2 w-75 '  >
        <Toast.Body>{mess}  </Toast.Body>
        
        </Toast>
    
    
    }
      
    
    </>
  );
}

export default Chatpop