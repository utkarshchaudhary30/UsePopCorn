import { useEffect, useRef, useState ,useMemo, useImperativeHandle} from "react";
import Starrating from "./Starrating"
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  

  const KEY="434b56f1";

  export default function App() {
  const[query,setQuery]=useState("inception")
  const[movies,setMovies]=useState([])
  const [watched, setWatched] = useState([]);
  const [isloading,setisloading]=useState(false);
  const [error,seterror]=useState("")
  
  const [selectedid,setselectedid]= useState("tt1375666")
  // const [watched, setWatched] = useState(function(){
  //   const storedvalue=localStorage?.getItem("watched")
  //   return JSON.parse(storedvalue)
  // });



  function handleselectmovie(id){
     setselectedid((selectedid)=>(id===selectedid? null:id));
  }
  function handleclosemovie(){
   setselectedid(null) 
  }

function handleaddwatched(movie){
   setWatched((watched)=>[...watched,movie])

}
function handledeleteWatched(id){
  setWatched((watched)=>watched.filter((movie)=>movie.imdbID!==id))

}
useEffect(function(){
  localStorage.setItem("watched",JSON.stringify(watched))
},[watched])


  useEffect(function(){
   async function fetchmovies(){
    const controller = new AbortController();
   try {setisloading(true);
    seterror("");
    const res= await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal})
    if(!res.ok) throw new Error("something wrong with loading the movies")
    const data= await res.json();
    if(data.Response ==='False') throw new Error("Movie not found");
    setMovies(data.Search);
    seterror("")
    console.log(data.Search);
    } catch(err){
      seterror(err.message)
      if(err.name!=="AbortError"){
        seterror(err.message)
      }
    } finally{
      setisloading(false)
    }
   }
   if(!query.length){
    setMovies([]);
    seterror("Movie not found")
    return;
   }
   handleclosemovie();
   fetchmovies();
   return function(controller){
    controller?.abort();
   }
  },[query])

 

    return (
      <>
         <Navbar >
    <Search query={query} setQuery={setQuery}/>
    <Numresults movies={movies}/>
         </Navbar>
          <Main >
          <Box>
   {/* {isloading? <Loader/>: <Movieslist movies={movies}/>} */}
   {isloading && <Loader/>}
   {!isloading && !error && <Movieslist movies={movies} onselectmovie={handleselectmovie}/>}
   {error && <Errormessage message={error}/>}
    


          </Box>
          <Box>
            { selectedid? <Moviedetails selectedid={selectedid} onclosemovie={handleclosemovie}
            onaddwatched={handleaddwatched}/>:<>
          <Watchedsummary watched={watched}/>
          <Watchedlist watched={watched} ondeletewatched={handledeleteWatched}/>
          </>
            }
          </Box>
          </Main>
        
      </>
    );
  }

  function Loader(){
    return <p className="loader">Loading...</p>
   
  }
  function Errormessage({message}){
    return(
    <p className="error">
  <span></span>{message}
    </p>
    )
  }

function Navbar({children}){

  return(
    <nav className="nav-bar">
         <Logo/>

    {children}
  </nav>
  )
}
function Logo(){
  return(
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}
function Search({query,setQuery}){
  // useEffect(function(){
  //   const el=document.querySelector(".search")
  //   el.focus()
  // },[])
  const inputel=useRef(null)
 useEffect(function(){
  function callback(e){
    if(document.activeElement===inputel.current)return
    if(e.code==="Enter"){
    inputel.current.focus()
    setQuery("")
    }
  }
  document.addEventListener('keydown',callback)
  return ()=>document.addEventListener('keydown',callback)
 },[setQuery])
  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref={inputel}
  />
  )
}
function Numresults({movies}){
  return(
    <p className="num-results">
    Found <strong>{movies?.length >0 ?  movies.length:'no' }</strong> results
  </p>
  )
}
function Main({children}){
 



  
  return(
    <main className="main">
      {children}

      </main>
  )
}
function Box({children}){
  const [isOpen, setIsOpen] = useState(true);

  return(
    <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && (
      children
    )}
  </div>
  )
}

function Movieslist({movies,onselectmovie}){
  return(
    <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie}  key={movie.imdbID} onselectmovie={onselectmovie}/>
    ))}
  </ul>
  )
}
function Movie({movie,onselectmovie}){
  return(
    <li onClick={()=>onselectmovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
  )
}
function Moviedetails({selectedid,onclosemovie,onaddwatched,watched}){
  const[movie,setmovie]=useState({});
  const [isloading,setisloading]=useState(false);
  const[userrating,setuserrating]=useState(0);
  console.log(userrating);
  const countRating=useRef(0);
  
 const iswatched= watched?.map((movie) => movie.imdbID).includes(selectedid);
 const watcheduserrating =watched?.find((movie)=> movie.imdbID ===selectedid)?.userrating;
 
//  const [isTop,setisTop]=useState(imdbRating>8)
//  useEffect(function(){
//   setisTop(imdbRating>8)
//  },[imdbRating])
// const istop= imdbRating>8;
// console.log(istop)
// const [avgrating,setavgrating]=useState(0);
  const{
    Title:title,
    Year:year,
    Poster:poster,
    Runtime:runtime,
    imdbRating,
    Plot:plot,
    Realeased:released,
    Actors:actors,
    Director:directors,
    Genre:genre
  }=movie;
  function handleAdd(){
    const newwatchedmovie={
      imdbID:selectedid,
      title,
      year,
      poster,
      imdbRating:Number(imdbRating),
      runtime:runtime.split('').at(0),
      userrating,

    }
    onaddwatched(newwatchedmovie)
    onclosemovie();
    // setavgrating(Number(imdbRating))
    // setavgrating((avgrating)=>(imdbRating + userrating)/2)
  }
  useEffect(function(){
    function callback(e){
  
        if(e.code==='Escape'){
        onclosemovie();
        }
      
    }
    document.addEventListener('keydown',callback)
    return function(){
      document.removeEventListener('keydown',callback);
    }
  },[onclosemovie])
  useEffect(function(){
    async function getmovieDetails(){
      setisloading(true);
      const res= await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedid}`);
      const data=await res.json();
      setmovie(data);
      setisloading(false);
    }
    getmovieDetails();
  },[selectedid])
  useEffect(function(){
    if(!title)return;
    document.title=`Movie| ${title}`
    return function(){
      document.title="UsePopcorn"
    }

  },[title] 

  )
  return(
    <div className="details">
      <header>
      <button className="btn-back" onClick={onclosemovie}>&larr;</button>
      <img src={poster} alt={`Poster of${movie}`}></img>
      <div className="details-overview">
        <h2>{title}</h2>
        <p>
          {released} &bull;{runtime}
        </p>
        <p>{genre}</p>
        <p><span></span> ⭐️{imdbRating} IMDB rating</p>
      </div>
      </header>
    {/* <p>{avgrating}</p> */}
      <section>
        <div className="rating">
        {!iswatched ? (
            <>
              <Starrating
                maxrating={10}
                size={24}
                onsetrating={setuserrating}
              />
             <button className="btn-add" onClick={handleAdd}>+ Add to list</button>
            </>
          ) : (
            <p>You rated the movie</p>
          )}

        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring : {actors}</p>
        <p>Directed by {directors}</p>
      </section>
      </div>

  )
}

function Watchedsummary({watched}){
  const avgImdbRating = average(watched?.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched?.map((movie) => movie.userRating));
  const avgRuntime = average(watched?.map((movie) => movie.runtime));
  return(
    <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
  )

}
function Watchedlist({watched,ondeletewatched}){

  return(
    <ul className="list">
    {watched?.map((movie) => (
      <Watchedmovie key={movie.imdbID} movie={movie} ondeletewatched={ondeletewatched}/>
    ))}
  </ul>
  )
} 
 function Watchedmovie({movie,ondeletewatched}){
  return(
    <li >
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
          <button className="btn-delete" onClick={()=>ondeletewatched(movie.imdbID)}>X</button>
        </div>
      </li>
  )
 }
