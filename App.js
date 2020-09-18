/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Text, TextInput, Button, Image, StyleSheet} from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';

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

  onChange(event) {
    let name = event.target._internalFiberInstanceHandleDEV.memoizedProps.name;
    this.setState({
      [name]: event.nativeEvent.text,
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
      } else {
        this.setState({image: response.uri});
      }
    });
  }
  render() {
    return (
      <>
        <View style={{marginTop: 50, marginLeft: 20}}>
          <Text style={{fontSize: 30}}>Meal Log</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Title"
          name="title"
          type="text"
          onChange={this.onChange}
          value={this.state.title}></TextInput>
        <TextInput
          style={styles.input}
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

const styles = StyleSheet.create({
  input: {
    margin: 20,
    borderWidth: 0.5,
    padding: 4,
  },
});

export default App;
