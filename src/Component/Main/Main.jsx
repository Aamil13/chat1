import Button from 'react-bootstrap/Button';
import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Chatpop from '../Chatpop/Chatpop';
import "./main.css"
import {AiOutlineSend} from "react-icons/ai"
import {signOut ,onAuthStateChanged ,getAuth ,GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {app} from "../../firebase"
import {getFirestore,addDoc,serverTimestamp,collection,onSnapshot,query,orderBy} from "firebase/firestore"



    const auth = getAuth(app)
    const db = getFirestore(app)
  

    const loginHandler = ()=>{
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth , provider)
    }
    
    const logoutHandler =()=>{
      signOut(auth)
    }

    


const Mainb = () => {

  const [user,  setUser] = useState(false);
  const [message , setMessage] = useState("");
  const [showmsg,setShowmsg] = useState([]);
  // console.log(user);
  const q = query(collection(db,"Messagess"),orderBy("createdAt","asc"));


  const divtoscroll = useRef(null)

  const submitHandler= async(e)=>{
    e.preventDefault();
    // console.log("aaaaaaa");
    try {
      setMessage("")
        await addDoc(collection(db,"Messagess"),{
          text:message,
          uid:user.uid,
          uri:user.photoURL,
          createdAt:serverTimestamp(),


        })
         
          divtoscroll.current.scrollIntoView({behavior:"smooth"});

    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    const unloger= onAuthStateChanged(auth,(data)=>{
        setUser(data);
        // console.log(data);
    })

    const unshowmsg= onSnapshot(q,(snap)=>{
      setShowmsg(snap.docs.map((item)=>{
        const id = item.id;
        return {id,...item.data()}
      }));
    })

      return ()=>{
        unloger();
        unshowmsg();
      }
    
  }, [])
  

  return (
    <>
        <div className=" d-flex justify-content-center " style={{height:"100vh",backgroundColor:'black'}}>
           {user ? <div className='bg-light  rr h-100 d-flex flex-column'>
            <div className='bg-danger text-center w-100 h-25'>
              <Button onClick={logoutHandler} className='btn-warning mt-5'>Log out</Button>
            </div>
               <div className='ovvov  '  >
                   
                   {
                    showmsg.map((item)=>(
                      <Chatpop key={item.id}  user={item.uid ===user.uid ?"me" : "other"} mess={item.text}/>
                    ))
                   }




                    {/* <Chatpop user={"me"} mess={"first onea"}/>
                    <Chatpop mess={"first one"}/> */}    
                        <div ref={divtoscroll}></div>           
               </div>
             
            <form onSubmit={submitHandler} className=' d-flex align-items-end '  >
                
                <input value={message} onChange={(e)=>(setMessage(e.target.value))} className='form-control shadow mb-1 pt-2'></input>
                <Button type='submit' className='  '><AiOutlineSend size={30}/></Button>
            </form>
           </div>
           :
            <div className=' align-self-center'>
              <p className='fw-bold text center text-light'>You are about to enter the chating room</p>
              <Button onClick={loginHandler} className='m-5'>sign in to continue</Button>
            </div>
           }
        </div>
    
    </>
  )
}

export default Mainb