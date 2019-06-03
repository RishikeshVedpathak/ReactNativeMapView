import React, { Component } from 'react';
import { Text, View, ActivityIndicator, Button } from 'react-native';
import MapView from "react-native-maps";
import styles from "./styles";

// Disable yellow box warning messages
// console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      region: {
        latitude: 10,
        longitude: 10,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      },
      isMapReady: false,
      marginTop: 1,
      userLocation: "",
      regionChangeProgress: false
    };
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        };
        this.setState({
          region: region,
          loading: false,
          error: null,
        });
      },
      (error) => {
        alert(error);
        this.setState({
          error: error.message,
          loading: false
        })
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 },
    );
  }

  onMapReady = () => {
    this.setState({ isMapReady: true, marginTop: 0 });
  }

  // Fetch location details as a JOSN from google map API
  fetchAddress = () => {
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.region.latitude + "," + this.state.region.longitude + "&key=" + "AIzaSyAXW-WDp0MF5si6oFXaukDQuThTr1wqmDE")
      .then((response) => response.json())
      .then((responseJson) => {
        const userLocation = responseJson.results[0].formatted_address;
        this.setState({
          userLocation: userLocation,
          regionChangeProgress: false
        });
      });
  }

  // Update state on region change
  onRegionChange = region => {
    this.setState({
      region,
      regionChangeProgress: true
    }, () => this.fetchAddress());
  }

  // Action to be taken after select location button click
  onLocationSelect = () => alert(this.state.userLocation);

  render() {
    return (<MapView
      style={{ ...styles.map, marginTop: this.state.marginTop }}
      initialRegion={this.state.region}
      showsUserLocation={true}
      onMapReady={this.onMapReady}
      onRegionChangeComplete={this.onRegionChange}
    ></MapView>);
  }
}
