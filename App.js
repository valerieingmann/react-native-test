/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
// import CameraScreen from './CameraScreen';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';

// class CameraScreen extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       showPhotoGallery: false,
//       photoArray: [],
//     };
//   }
//   async getPhotosFromGallery() {
//     console.log('in func');
//     let result = await CameraRoll.getPhotos({first: 10000});
//     let photoArray = result.edges;
//     this.setState({
//       showPhotoGallery: true,
//       photoArray: photoArray,
//     });
//     console.log(this.state.photoArray[0]);
//   }
//   render() {
//     if (this.state.showPhotoGallery) {
//       let uri = this.state.photoArray[0].uri;
//       return <Image source={{uri: uri}} />;
//     }
//     return (
//       <View>
//         <TouchableHighlight onPress={() => this.getPhotosFromGallery()}>
//           <Text>Add Photo</Text>
//         </TouchableHighlight>
//       </View>
//     );
//   }
// }

// class Camera extends React.Component {
//   constructor() {
//     super();
//     this.state = {photos: []};
//   }
//   _handleButtonPress = () => {
//     CameraRoll.getPhotos({
//       first: 20,
//       assetType: 'Photos',
//     })
//       .then((r) => {
//         this.setState({photos: r.edges});
//       })
//       .catch((err) => {
//         //Error Loading Images
//       });
//   };
//   render() {
//     return (
//       <View>
//         <Button title="Load Images" onPress={this._handleButtonPress} />
//         <ScrollView>
//           {this.state.photos.map((p, i) => {
//             return (
//               <Image
//                 key={i}
//                 style={{
//                   width: 300,
//                   height: 100,
//                 }}
//                 source={{uri: p.node.image.uri}}
//               />
//             );
//           })}
//         </ScrollView>
//       </View>
//     );
//   }
// }

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      entries: [],
      title: '',
      description: '',
      image: '',
    };
    this.post = this.post.bind(this);
    this.onChange = this.onChange.bind(this);
    this.imagePicker = this.imagePicker.bind(this);
  }
  async componentDidMount() {
    let res = await axios.get('http://localhost:3000/api');
    this.setState({entries: res.data});
  }

  onChange(e) {
    let name = e.target._internalFiberInstanceHandleDEV.memoizedProps.name;
    this.setState({
      [name]: e.nativeEvent.text,
    });
  }
  async post() {
    let newEntry = await axios.post('http://localhost:3000/api', {
      title: this.state.title,
      description: this.state.description,
      image: this.state.image,
    });
    let res = await axios.get('http://localhost:3000/api');
    this.setState({
      entries: res.data,
      title: '',
      description: '',
      image: '',
    });
  }

  imagePicker() {
    ImagePicker.showImagePicker((response) => {
      console.log('test');
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('in else');
        this.setState({image: response.uri});
        console.log(this.state);
      }
    });
  }
  render() {
    return (
      <>
        <View style={{marginTop: 50, marginLeft: 20}}>
          <Text style={{fontSize: 30}}>TEST APP</Text>
        </View>
        <TextInput
          style={{margin: 20, borderWidth: 0.5, padding: 4}}
          placeholder="Title"
          name="title"
          type="text"
          onChange={this.onChange}
          value={this.state.title}></TextInput>
        <TextInput
          style={{margin: 20, borderWidth: 0.5, padding: 4}}
          placeholder="Description"
          name="description"
          type="text"
          onChange={this.onChange}
          value={this.state.description}></TextInput>
        <Button title="Add Picture" onPress={this.imagePicker}></Button>
        <Button title="Submit" onPress={this.post} />
        <View style={{margin: 20}}>
          {this.state.entries.map((entry) => (
            <View key={entry.id}>
              <Text style={{fontSize: 26, margin: 4}}>{entry.title}</Text>
              <Text style={{fontSize: 16, margin: 4}}>{entry.description}</Text>
              {entry.image ? (
                <Image
                  style={{
                    height: 100,
                    width: 200,
                  }}
                  source={{uri: entry.image}}
                />
              ) : null}
            </View>
          ))}
        </View>
      </>
    );
  }
}

export default App;
