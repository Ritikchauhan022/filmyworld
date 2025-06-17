import React, {useContext, useEffect, useState} from 'react'
import ReactStars from "react-stars";
import {getReviewsRef, db} from '../firebase/firebase.js'
import { addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert';
import { Appstate } from '../App.js';
import { useNavigate } from 'react-router-dom';

const Reviews = ({id, prevRating, userRated}) => {
const useAppState = useContext(Appstate);
const navigate = useNavigate();
console.log("Current userName in review:", useAppState.userName); 
const [rating, setRating] = useState(0);
const [loading, setLoading] = useState(false);
const [reviewsloading, setReviewsloading] = useState(false);
const [form, setForm] = useState("");
const [data, setData] = useState([]);


// firebase me reviews data add ho jaye 
const sendReview = async () => {
  setLoading(true);
  try{
    if(useAppState.login) {
      await addDoc(getReviewsRef(), {
       movieid: id,
       name: useAppState.userName,
       rating: rating,
       thought: form,
       timestamp: new Date().getTime()
      });

const ref = doc(db, "movies", id);
       await updateDoc(ref, {
      rating: prevRating + rating,
      rated: userRated + 1
    }); 

      await getData(); // 👈 ye line add kar di mene yha per esse ab reviews dene per refrec  nhi krna pdega 

     swal({
      title: "Review Sent",
      icon: "success",
      buttons: false,
      timer: "3000"
    });

     setForm("");
     setRating(0);
  } else {
    navigate('/login')
  }

  } catch (error) {
    swal({
      title: "error.message",
      icon: "error",
      buttons: false,
      timer: "3000"
    });
  }
  setLoading(false);

}

//ab hum firebase se reviews data get krege
 //ab hum yha per particuler movie ki id se usi ke reviews kese get kre 

 const getData = async () => {
// async function getData() { // es line ka kaam ab es line ke uper bali  line kregi or ye line mene isliye di taki reviews dete time referce na krna pde or useEffect niche use kiya
setReviewsloading(true);
let quer = query(getReviewsRef(), where('movieid', '==', id));
const querySnapshot = await getDocs(quer); //esne mughe multipal documents de deye movie ke under se nekal ker OR ab me unhe niche map kr duga

setData([]); //clear previous reviews
querySnapshot.forEach((doc) => {
  setData((prev) => [...prev, doc.data()]);
});

setReviewsloading(false);
}

useEffect(() => {
getData();
},[id])


  return (
    <div className='reviews'>
            <ReactStars 
            size={30}
            half={true}
            value={rating}
            onChange={(rate) => setRating(rate)} //onchange ka matlab hai ki hum rating stars ko edit kr sakte 
            />
       <input 
       value={form}
       onChange={(e) => setForm(e.target.value)}
       placeholder='Share Your thoughts...'
       className='input'
       />
       <button className='button' onClick={sendReview} >
            {loading ? <TailSpin height={20} color='white'/> : 'Share'}
        </button>

        { reviewsloading ?
        <div className='t'><ThreeDots height={10} color='white'/></div>
         :
         <div className='v'>
          {data.map((e, i) => {
            return(
              <div className='sarereviews' key={i}>
                <div className='ba'>
                  <p className='name'>{e.name}</p>
                  <p className='time'>({new Date(e.timestamp).toLocaleString()})</p>
                </div>
                <ReactStars 
                   size={15}
                   half={true}
                   value={e.rating}
                   edit={false} // eska matlab hai ki hum rating stars ko edit nhi kr sakte
                />
                <p>{e.thought}</p>
              </div>
            )
          }) }
         </div>
        }
    </div>
  )
}

export default Reviews;