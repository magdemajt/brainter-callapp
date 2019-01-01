import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Style

// Import Components

// Import Actions

const Home = ({user}) => {
  return (
    <div>
      Test
    </div>
  );
};

// Retrieve data from store as props
const mapStateToProps = (store) => {
  return {
    user: store.userData.user
  };
};

export default connect(mapStateToProps)(Home);
