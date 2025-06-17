import React, {useContext, useState} from 'react';
import { TailSpin } from 'react-loader-spinner';
import { getMoviesRef, addDoc } from '../firebase/firebase.js';
import swal from 'sweetalert';
import { useAutocomplete } from '@mui/material';
import { Appstate } from '../App.js';
import { useNavigate } from 'react-router-dom';
const moviesRef = getMoviesRef();

const AddMovie = () => {
const useAppState = useContext(Appstate)
const navigate = useNavigate();
 const [form, setForm] = useState({
    title: "Ritik",
    year: "2014",
    description: "good movie",
    image: "",
    rated:0,
    rating:0,
    videoUrl: "" // ✅ Yeh naya field
});
const [loading, setLoading] = useState(false);
// movie add krne bala function
const addMovie = async () => {
  try{
   if(useAppState.login) {
    setLoading(true); //loading start
    const movieRef = getMoviesRef();
    await addDoc(movieRef, form);

    swal({
     title: "Successfully Added",
     icon: "success",
     buttons: false,
     timer: "3000"
   });
   setForm({title: "", year: "", description: "", image: "", videoUrl: ""});
  } else {
   navigate('/login')
  }
 } catch(err){
  swal({
    title: "Error!",
    text: err.message,
    icon: "error",
    buttons: false,
  });
} finally{
setLoading(false);
}
};
  return (
    <div className='add-movie-container'>
        <h1 className='add-movie-title'>Add Movie</h1>
        
       <form className='add-movie-form' onSubmit={(e) => e.preventDefault()}>  {/* 📌 Ye line ensure karegi ki page reload na ho jab tu "Submit" dabaye. */}
            <div className='form-row'>
            <div className='form-group'>
                <label className='name'>Title</label>
               <input 
               type='text'
               id='name'
               name='title'
               value={form.title}
               onChange={(e) => setForm({...form, title: e.target.value})}
               placeholder='Enter movie name'
               />
            </div>

            <div className='from-group'>
                <label className='year'>Year</label>    
                <input
                type='text'
                id='year'
                name='year'
                value={form.year}
               onChange={(e) => setForm({...form, year: e.target.value})}
                placeholder='Enter release year'
                />      
       </div>
          </div>

          <div className='form-group'>
           <label>Image Link</label>
           <input id='image'
           name='image'
           rows={5}
           value={form.image}
          onChange={(e) => setForm({...form, image: e.target.value})}
           placeholder='Enter movie link'
           />
          </div>

          <div className='form-group'>
  <label>Video URL</label>
  <input
    id='videoUrl'
    name='videoUrl'
    value={form.videoUrl}
    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
    placeholder='Enter video link (e.g., https://xyz/video.mp4)'
  />
</div>


          <div className='form-group'>
           <label>Description</label>
           <textarea id='description'
           name='description'
           rows={5}
           value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
           placeholder='Enter movie description'
           >
           </textarea>
          </div>

          <button onClick={addMovie} type='submit' className='submit-button'>{ loading ? <TailSpin height={25} color='white'/>: 'Submit'}</button>
        </form>
    </div>
  );
}

export default AddMovie;