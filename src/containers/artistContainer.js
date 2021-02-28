import React from 'react';

//let codeIntake = window.location.split('=')[1]
let artists = [{name:"Yeah Yeah Yeahs", href:'https://api.spotify.com/v1/artists/3TNt4aUIxgfy9aoaft5Jj2'}]

export default class ArtistContainer extends React.Component {
    constructor(){
        super();
        this.state={
            artistTracks: []
        }
    }

    
        
    
    
    topTrackFetcher(){
        artists.forEach( art => {
            fetch(art.href+'/top-tracks?market=US', {
                headers: {
                    "Content-type": "Application/json",
                    Accept: "Application/json",
                    "Authorization": `Bearer ${this.props.token}`
                }
            })
            .then(resp=> resp.json())
            .then(res=> {
               let topTrack1= res.tracks[0].preview_url
               let song = new Audio (topTrack1)
               song.play()
                console.log(res.tracks[0].preview_url)})
            .catch(err=> console.log(err))
        })
        
    }

    // player(){
    //     fetch(href", {
    //         headers: {
    //             "Content-type": "Application/json",
    //             "Accept": "Application/json",
    //             "Authorization": `Bearer ${this.props.token}`,
                
    //         }
    //     })
    //     .then(resp=> resp.json())
    //     .then(res=> {
    //         let song = new Audio (res)
    //        //song.play()
    //         console.log(res)
    //     })
    //     .catch(err=> console.log(err))
    // }
    
    componentDidMount(){
        this.topTrackFetcher()
        console.log("did trackFetcher in container")
    }

    render(){

        return(
            <div></div>
        )
    }


}

