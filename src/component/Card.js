import React, { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import ReactStars from "react-stars";
import { getDocs } from "firebase/firestore";
import { getMoviesRef } from '../firebase/firebase.js';
import { Link } from 'react-router-dom';

const Cards = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const querySnapshot = await getDocs(getMoviesRef());
      setData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <div className='eye'>
      {loading ? (
        <div className='go'><ThreeDots height={40} color='white' /></div>
      ) : (
        data.map((e, i) => (
          <Link to={`/detail/${e.id}`} key={i}>
            <div className='b'>
              <div className="image-wrapper">
                <img className='image' src={e.image} alt={e.title} />
              </div>
              <h4 className='abc'>
                <span className='q'></span>{e.title}
              </h4>
              <h4 className='abc'>
                <span className='q'>Rating:</span>
                <ReactStars 
                  size={20}
                  half={true}
                  value={e.rating / e.rated}
                  edit={false}
                />
              </h4>
              <h4 className='abc'>
                <span className='q'>Year:</span> {e.year}
              </h4>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default Cards;
