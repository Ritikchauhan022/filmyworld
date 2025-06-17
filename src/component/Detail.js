import React, {useState, useEffect } from 'react'
import ReactStars from 'react-stars'
import {useParams} from 'react-router-dom'
import {db} from '../firebase/firebase.js'
import {getDoc, doc} from 'firebase/firestore';
import {ThreeCircles} from 'react-loader-spinner'
import Reviews from './Reviews';
import ReactPlayer from 'react-player';

// import { Description, Title } from '@mui/icons-material'


const Detail = () => {
const {id} = useParams();
const [data, setData] = useState({
  title: "",
  year: "",
  image: "",
  description: "",
  rating:0,
  rated:0,
  videoUrl: "" // ✅ Yeh field add karna zaroori tha
});
const [loading, setLoading] = useState(false);

useEffect(() => {
async function getData(){
setLoading(true);
const _doc = doc(db, "movies", id);
const _data = await getDoc(_doc);
setData(_data.data());
setLoading(false);
}
getData();
},[])

  return (
    <div className='detail'>
  { loading ? <div className='s'><ThreeCircles height={25} color='white'/></div>:
    <>
   <div className="image-container">
        <img className="detailimage" src={data.image} />
      </div>
      
    <div className='side'>
    <h1>{data.title}<span>({data.year})</span></h1>
    <ReactStars
     size={20}
     half={true}
     value={data.rating/data.rated}
     edit={false}
    />
    <p>{data.description}</p>
    
      {/* ✅ Video Player */}
            {data.videoUrl && (
              <div className='video-player-wrapper'>
                <ReactPlayer
                  url={data.videoUrl}
                  controls
                  width="100%"
                  height="400px"
                />
              </div>
            )}
            
    <Reviews id={id} prevRating={data.rating} userRated={data.rated}/>
    </div>
    </>
    }
    </div>
  );
};

export default Detail