import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import nycBands from './nycBands.js';
import ArtistContainer from './containers/artistContainer'
let codeIntake = window.location.href.split('=')[1]  // AFTER login is initiated the Spotify API puts parameters in URL 'code' & 'access token'. This grabs the AccessToken info.

const properCase = // this goes through the imported list of Bands formed in NYC. Then URI encodes the non-alphabetical characters for the Fetch Request.
  
nycBands.map(artist => {
    return artist.replaceAll(' ','%20').replaceAll("'","%27").replaceAll(":", "%3A")
  })

const uniqBy = (arr, key) => {
  var seen = {}; // hash container for pushing unique objects into
  return arr.filter( function(item) {
    var k = key(item);   // REDUCE - will conduct function 'key' on each item in arr & assign value k
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);  // if k is not unique to seen array then FALSE. if unique added to "seen" at index k. Using Json.stringify as key function to each item 
  })
}

class App extends Component {

  constructor(){
    super();
    this.state = {
      artists: [],
      artistsObjArr: [],
      logged_in: window.location.href === 'http://localhost:3000/' ? false : true // if the Spotify access token info isn't present then User isn't logged in yet.  
    }
  }


componentDidMount(){
  //this.allNycBandsFetch()
  console.log("we mounted!")

}

allNycBandsFetch(){
  let artistsObjArr = []; // this will hold EVERY artist object return
  let uniqueArtistsObjs = []; // this will only hold unique artist objects

  for (let i=0; i< properCase.length; i++){    // this loops through each uri encoded band-name & does get Fetch
   
    fetch(`https://api.spotify.com/v1/search?q=${properCase[i]}&type=artist`, {
      headers: {
          'Content-Type':'application/json',
           Accept:'application/json',
           "Authorization": `Bearer ${codeIntake}`    //  codeIntake=> accesstoken auth
      }
     })
     .then(resp=> resp.json())
     .then(artObjs=> {    // going to put this artist obj(s) response into another function which returns correct artist obj from results
        let foundArtist = artObjs.artists.items   // this returns artist(s) item's array.
        
        if (foundArtist !== undefined && foundArtist.length){  // if response isn't undef & has any length
            let realArtist = foundArtist.find( artist => artist.name === decodeURI(properCase[i])) // find artist in array of objects with name matching the initial search
          if (realArtist !== undefined){  // if we have a hit on name matches in the objects & fetch search
            artistsObjArr.push(realArtist)  // pushing the artist obj into array (possible for duplicates)
          }
        }
          uniqueArtistsObjs = uniqBy(artistsObjArr, JSON.stringify) // reducer -> will stringify the object & then search & return only unique values in array
      
     })
     .then(() => {
                                              // Sets State with unique array of Artists' Objects
      this.setState({
        artistsObjArr: uniqueArtistsObjs
      })
    })
     .catch( err => console.log(err))
  }
}

  render(){
    console.log(this.state)
  return (
    <div className="App">
      <header className="App-header">        
       {!this.state.logged_in ? <button id="Login-Spotify" onClick={()=> window.location= "http://localhost:8888/login"}>Log in With Spotify</button> : ''}
      {/* Above if user is not logged in yet button directing to Oauth appears*/}
      {this.state.logged_in ? <ArtistContainer artists={this.state.artistsObjArr} token={codeIntake}/> :''}
      </header>
    </div>
  );
 }
}


export default App;
