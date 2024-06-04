// App.js
import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import ImageLinkForm from './components/ImageLinkForm';
import Rank from './components/Rank';
import FaceRecognition from './components/FaceRecognition';
import SignIn from './components/SignIn';
import Register from './components/Register';

const PAT = '1ab146928f4d4a48b12d810918b0caa5';
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

const raw = JSON.stringify({
  "user_app_id": {
    "user_id": USER_ID,
    "app_id": APP_ID
  },
  "inputs": [
    {
      "data": {
        "image": {
          "url": IMAGE_URL
        }
      }
    }
  ]
});

const requestOptions = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Key ' + PAT
  },
  body: raw
};

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageurl: '',
      boxes: [],
      route: 'signin',
      issignedin: false,
      user: {
        name: '',
        id: '',
        email: '',
        password: '',
        entries: 0,
        joindate: new Date()
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        name: data.name,
        id: data.id,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onClickDetect = async () => {
    // Update the image URL in the API request
    const updatedRequestOptions = {
      ...requestOptions,
      body: JSON.stringify({
        ...JSON.parse(raw),
        inputs: [
          {
            data: {
              image: {
                url: this.state.input // Use the input value entered by the user
              }
            }
          }
        ]
      })
    };

    // Update state with the new image URL
    this.setState({ ...this.state, imageurl: this.state.input });

    // Make the API call with the updated request options
    try {
      const request = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", updatedRequestOptions)
      const result = await request.json();
      if (result) {
        try {
          const apiCall = await fetch('http://localhost:3000/increment-image-entries', {
            method: 'put',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          });

          const entriesCount = await apiCall.json();
          // this.setState({
          //   ...this.state,
          //   user: {
          //     ...this.state.user,
          //     entries: entriesCount
          //   }
          // })
          Object.assign(this.state.user, { entries: entriesCount });

        } catch (error) {
          console.log("🚀 ~ App ~ onClickDetect= ~ ̥:", error);
        }

      }



      const regions = result?.outputs?.[0]?.data?.regions || [];
      const image = document.getElementById('inputimage');
      const imageWidth = Number(image.width);
      const imageHeight = Number(image.height);

      const boxes = regions.map(region => {
        const boundingBox = region.region_info.bounding_box;
        const topRow = boundingBox.top_row * imageHeight;
        const leftCol = boundingBox.left_col * imageWidth;
        const bottomRow = imageHeight - boundingBox.bottom_row * imageHeight;
        const rightCol = imageWidth - boundingBox.right_col * imageWidth;
        return {
          topRow,
          leftCol,
          bottomRow,
          rightCol
        };
      });
      this.setState({ boxes });

    } catch (error) {
      console.log('error', error)
    }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ issignedin: false });
    } else if (route === 'home') {
      this.setState({ issignedin: true });
    }
    this.setState({ route: route });
    this.setState({ imageurl: '' })  // added recently
  }

  render() {
    return (
      <div className="App">
        <Navbar onRouteChange={this.onRouteChange} issignedin={this.state.issignedin} />
        {
          this.state.route === 'home'
            ?
            <div>
              <Logo />
              <Rank user={this.state.user} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onClickDetect={this.onClickDetect}
              />
            </div>
            :
            (
              this.state.route === 'signin' ?
                <SignIn updateUser={this.loadUser} onRouteChange={this.onRouteChange} /> : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            )


        }

        {
          this.state.imageurl && (
            <FaceRecognition imageurl={this.state.imageurl} boxes={this.state.boxes} />
          )
        }
      </div>
    );
  }
}

export default App;
