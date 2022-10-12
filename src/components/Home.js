import { NavLink } from 'react-router-dom'
import {useState, useEffect} from 'react'
import useToken from './useToken';
import { useHistory } from 'react-router-dom';
import { Redirect } from "react-router-dom"
import Logout from './Logout';
import { InlineWidget } from "react-calendly";
        
const Home = () => {
    const { token } = useToken();
    const [Home, setHome] = useState([])
    const [Load] = useState([])
    
    const [isLoading, setisLoading] = useState(true)
    const nextRoute = useHistory();
    useEffect(() =>{
        let isMounted = true
        const controller = new AbortController();
        try{
            fetch('http://localhost:8080', {
            method: 'GET',
            signal: controller.signal,
            
            headers: {
                'Authorization': 'Bearer'+' '+token,
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => {
            
            if (!res.ok){
                setisLoading(true)
                
                sessionStorage.clear()
                if(!token){
                setTimeout(()=>{
                    
                    nextRoute.push('/Login')
                    
                }, 2000)}
                return res.json()

            }else{
                setisLoading(false)
                return res.json()
            } 
        } ).then(jsonResponse => {
                isMounted && setHome(jsonResponse)
                console.log(jsonResponse)
            
        })        


        }catch(err){
            console.error(err)
            return () => {
                setisLoading(false)
                
            }
        }

          
    }, [])
    

    
    
    return (
        
        <div>
            <nav className = 'main-nav'>
                <ul>
                    <li><NavLink className='nav' to = '/'>Home</NavLink></li>
                    <li><NavLink className='nav' to = '/About'>About</NavLink></li>
                    <li><NavLink className='nav' to = '/Account'>Account</NavLink></li>
                    <li><NavLink className='nav' to = '/User'>Profile</NavLink></li>
                </ul>
            </nav>
            {isLoading? <p>Loading...</p>:
            <p>{Home.status===0? <Redirect to="Login" />: Home.map(Main=> 
            <div key={Main._id}>
               Hello, {Main.name}
            </div>)}</p>}
            <div>
                {token? <NavLink to = '/Logout'>Logout</NavLink> : ""}
            </div>

            <div>
            <InlineWidget className='calendar' url="https://calendly.com/omisolaidowu" />
            </div>
        
            
        
            
        </div>
    )
}

export default Home;