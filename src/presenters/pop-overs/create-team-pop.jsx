import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import _ from 'lodash';
import {withRouter} from 'react-router-dom';
import {CurrentUserConsumer} from '../current-user.jsx';
import {getLink} from '../../models/team';
import Loader from '../includes/loader.jsx';
import {NestedPopoverTitle} from '../pop-overs/popover-nested.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';
import {SignInPop} from './sign-in-pop.jsx';

const wordsApi = axios.create({
  baseURL: 'https://friendly-words.glitch.me/',
});

// Create Team 🌿

class CreateTeamPopBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: '',
      isLoading: false,
      error: ''
    };
    this.debouncedValidate = _.debounce(this.validate.bind(this), 200);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  async componentDidMount() {
    try {
      const {data} = await wordsApi.get('team-pairs');
      this.setState(prevState => (!prevState.teamName ? {teamName: data[0]} : {}));
    } catch (error) {
      // If something goes wrong just leave the field empty
    }
    this.validate();
  }
  
  async validate() {
    const name = this.state.teamName;
    if (name) {
      const url = _.kebabCase(name);
      
      const userReq = this.props.api.get(`userId/byLogin/${url}`);
      const teamReq = this.props.api.get(`teams/byUrl/${url}`);
      const [user, team] = await Promise.all([userReq, teamReq]);
      
      let error = null;
      if (user.data !== 'NOT FOUND') {
        error = 'Name in use, try another';
      } else if (team.data) {
        error = 'Team already exists, try another';
      }
      if (error) {
        this.setState(({teamName}) => (name === teamName) ? {error} : {});
      }
    }
  }
  
  async handleChange(newValue) {
    this.setState({
      teamName: newValue,
      error: '',
    });
    this.debouncedValidate();
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      let description = 'A team that makes things';
      try {
        const {data} = await wordsApi.get('predicates');
        description = `A ${data[0]} team that makes ${data[1]} things`;
      } catch (error) {
        // Just use the plain description
      }
      const {data} = await this.props.api.post('teams', {
        name: this.state.teamName,
        url: _.kebabCase(this.state.teamName),
        hasAvatarImage: false,
        coverColor: '',
        location: '',
        description,
        backgroundColor: '',
        hasCoverImage: false,
        isVerified: false,
      });
      this.props.history.push(getLink(data));
    } catch (error) {
      const message = error && error.response && error.response.data && error.response.data.message;
      this.setState({
        isLoading: false,
        error: message || 'Something went wrong',
      });
    }
  }
  
  render() {
    const placeholder = 'Your Team Name';
    return (
      <dialog className="pop-over create-team-pop">
        <NestedPopoverTitle>
          Create Team <span className="emoji herb" />
        </NestedPopoverTitle>

        <section className="pop-over-info">
          <p className="info-description">
            Showcase your projects in one place, manage collaborators, and view analytics
          </p>
        </section>
        
        <section className="pop-over-actions">  
          <form onSubmit={this.handleSubmit}>
            <PureEditableField
              value={this.state.teamName}
              update={this.handleChange}
              placeholder={placeholder}
              error={this.state.error}
            />
            <p className="action-description team-url-preview">
              /@{_.kebabCase(this.state.teamName || placeholder)}
            </p>
          
            {this.state.isLoading ? <Loader /> : (
              <button type="submit" className="button-small has-emoji">
                Create Team <span className="emoji thumbs_up" />
              </button>
            )}
          </form>

        </section>
        <section className="pop-over-info">
          <p className="info-description">
            You can change this later
          </p>
        </section>
      </dialog>
    );
  }
}

CreateTeamPopBase.propTypes = {
  api: PropTypes.func.isRequired,
};

const CreateTeamPop = withRouter(CreateTeamPopBase);

const CreateTeamPopOrSignIn = ({api}) => (
  <CurrentUserConsumer>
    {user => (user && user.login ? (
      <CreateTeamPop api={api}/>
    ) : (
      <SignInPop params="hash=create-team"
        header={<NestedPopoverTitle>Sign In</NestedPopoverTitle>}
        prompt={<p className="action-description">You'll need to sign in to create a team</p>}
      />
    ))}
  </CurrentUserConsumer>
);

export default CreateTeamPopOrSignIn;