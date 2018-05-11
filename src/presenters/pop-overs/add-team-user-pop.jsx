import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import Loader from '../includes/loader.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

/*
function Old(application) {

  var self = {
  
    application,
  
    query: Observable(""),

    hiddenUnlessAddTeamUserPopVisible() {
      if (!application.addTeamUserPopVisible()) { return 'hidden'; }
    },

    stopPropagation(event) {
      return event.stopPropagation();
    },
    
    hiddenUnlessSearching() {
      if (!application.searchingForUsers()) { return 'hidden'; }
    },

    spacekeyDoesntClosePop(event) {
      event.stopPropagation();
      return event.preventDefault();
    },      

    search(event) {
      const query = event.target.value.trim();
      self.query(query);
      application.searchingForUsers(true);
      return self.searchUsers(query);
    },

    searchUsers: debounce(function(query) {
      if (query.length) {
        return application.searchUsers(self.query());
      } 
      return application.searchingForUsers(false);
        
    }
      , 500),

    searchResults() {
      const MAX_RESULTS = 5;
      if (self.query().length) {
        return application.searchResultsUsers().slice(0, MAX_RESULTS);
      } 
      return [];
      
    },

    hiddenIfNoSearch() {
      if (!self.searchResults().length && !application.searchingForUsers()) {
        return 'hidden';
      }
    }, 

    UserResultItem(user) {
      const action = () => {
        console.log("hi");
        //application.team().addUser(application, user);
      };
      const props = {
        user: user.asProps(),
        action,
      };
      
      return Reactlet(UserResultItem, props, `add-user-${user.id()}`);
    },
    
  };
            
  return AddTeamUserTemplate(self);
}
/*

/*
- Loader = require "../includes/loader"

dialog.pop-over.add-team-user-pop(class=@hiddenUnlessAddTeamUserPopVisible click=@stopPropagation)

  section.pop-over-info
    input#team-user-search.pop-over-input.search-input.pop-over-search(input=@search keyup=@spacekeyDoesntClosePop placeholder="Search for a user or email")

  section.pop-over-actions.last-section.results-list(class=@hiddenIfNoSearch)

    span(class=@hiddenUnlessSearching)
      = Loader(this)

    ul.results
      - application = @application
      - context = @
      - @searchResults().forEach (user) ->
        = context.UserResultItem(user)
*/

const UserSearchResults = ({users}) => (
  (users.length > 0) ? (
    <ul className="results">
      {users.map(user => (
        <li key={user.id}>
          <UserResultItem user={user} />
        </li>
      ))}
    </ul>
  ) : (
    <p className="results">nothing found</p>
  )
);

class AddTeamUserPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
      request: null, //The active request promise
      results: null, //Null means still waiting vs empty -- [jude: i suggest the 'maybe' convention for nullable fields with meaning.  'maybeResults']
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
  }
  
  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({ query });
    if (query) {
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }
  
  clearSearch() {
    this.setState({
      request: null,
      results: null,
    });
  }
  
  // I wish you could use async!
  async startSearch() {
    if (!this.state.query) {
      return this.clearSearch();
    }
    
    const request = this.props.search(this.state.query);
    this.setState({ request });
    const results = await request;
    
    this.setState(prevState => {
      return (request === prevState.request) ? {
        request: null,
        results: results.map(user => user.asProps()),
      } : {};
    });
  }
  
  render() {
    const isLoading = !!(this.state.request || !this.state.results);
    const hasResults = !!this.state.results;
    return (
      <dialog className="pop-over add-team-user-pop">
        <section className="pop-over-info">
          <input id="team-user-search"
            className="pop-over-input search-input pop-over-search"
            value={this.state.query} onChange={this.handleChange}
            placeholder="Search for a user or email"
          />
        </section>
        {!!this.state.query && <section className="pop-over-actions last-section results-list">
          {isLoading && <Loader />}
          {hasResults && <UserSearch}
        </section>}
      </dialog>
    );
  }
}

AddTeamUserPop.propTypes = {
  search: PropTypes.func.isRequired,
};

export default AddTeamUserPop;