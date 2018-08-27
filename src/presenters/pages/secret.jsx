import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import {UserPrefsProvider, UserPref} from '../includes/user-prefs.jsx';

const SecretPageContainer = ({api}) => {
  const toggles = [
    {name: "fish", description: "Whether or not fish.", default: true},
    {name: "cakes", description: "Whether or not cakes.", default: false},
    {name: "fishcakes", description: "opinions on if it's a cake or not", default: true},
  ];
  
  const defaultToggles = toggles.filter(
    (toggle) => toggle.default
  ).map(
    ({name}) => name
  );
  
  
  return (
    <UserPrefsProvider>
      <UserPref name="devToggles" default={defaultToggles}>
        {(enabledToggles, set) => (
          <Secret enabledToggles={enabledToggles} toggles={toggles} setEnabled={set}></Secret>
        )}
      </UserPref>
    </UserPrefsProvider>
  );
};

const Secret = ({toggles, enabledToggles, setEnabled}) => { 
  const toggleTheToggle = (name) => {
    let newToggles = null;
    if(isEnabled(name)) {
      newToggles = enabledToggles.filter(
        (enabledToggleName) => enabledToggleName !== name
      );
    } else {
      newToggles = enabledToggles.concat([name]);
    }
    setEnabled(newToggles);
  };
  
  const isEnabled = (toggleName) => {
    console.log("checking ", enabledToggles, toggleName)
    return enabledToggles.includes(toggleName);
  }
  
  return (
    <section className="secretPage">
      <Helmet>
        <title>Glitch -- It's a secret to everybody.</title>
      </Helmet>
      <ul>
        {toggles.map(({name, description}) => (
          <li key={name}>
            <button onClick={() => toggleTheToggle(name)} className={isEnabled(name) ? "lit" : "dark"}>{name}</button>
            <span style={{backgroundColor: "white"}}>I AM {isEnabled(name) ? "ENABLED" : "a sad panda"}</span>
            <span>{description}</span>
          </li>
        ))}
      </ul>
      
      
    </section>
  );
}

export default SecretPageContainer;