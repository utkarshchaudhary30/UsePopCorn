import { useState } from "react"
import PropTypes from "prop-types"
Starrating.propTypes={
  maxrating:PropTypes.number,
  defaultrating:PropTypes.number,
  messages:PropTypes.array,
  onrating:PropTypes.func,
  color:PropTypes.string,
  size:PropTypes.number,
  className:PropTypes.string,
}

export default function Starrating({maxrating=5,color="#fcc419",size=28 
, className="",messages=[],defaultrating=0 ,onrating,onsetrating}){
    const [rating,setrating]=useState(defaultrating)
    const [temprating,settemprating]=useState(0)
    const containerstyle={
        display:"flex",
        alignItems:"center",
        gap:"16px"
    }
    const starcontainerstyle={
        display:"flex",
    }
    const textstyle={
        
        margin:"0",
        color,
        fontSize:`${size}px`
         
    } 
    function handlerating(rating){
      onrating(rating)
    }
  
    
    return(
        <div style={containerstyle}>
        <div style={starcontainerstyle}>
            {Array.from({length:maxrating},(_,i)=>(
              <Star key={i} onrate={()=>setrating(i+1)} full={temprating? temprating>=i+1:rating>=i+1}
              onhoverin={()=>settemprating(i+1)} 
              onhoverout={()=>settemprating(rating)}
              color={color} size={size}
              onrating={handlerating}/>
              
            ))}
        </div>
        <p style={textstyle}>{messages.length===maxrating?messages[temprating? temprating-1: rating-1]: temprating || rating||""}</p>
        </div>
    )
}

function Star({onrate,full,onhoverin,onhoverout ,color,size}){
  const starstyle ={
    width:`${size}px`,
    height:`${size}px`,
    display:"block",
    cursor:"pointer"

}
    return(
        <span role="button" style={starstyle} 
          onClick={onrate} 
          onMouseEnter={onhoverin}
          onMouseLeave={onhoverout
          }
        >
       { full? (<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill={color}
  
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>) :( <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 28 27"
  stroke={color}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="0.2"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>)   }  
       </span>


    )
}


