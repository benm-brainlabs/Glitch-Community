import PropTypes from 'prop-types';
import React from 'react';

export function UserItemPresenter(application, user) {
  var self = {
    application,
    user,

    login() {
      return `@${user.login()}`;
    },

    name() {
      return user.name();
    },

    truncatedDescription() {
      return user.truncatedDescriptionMarkdown();
    },

    coverUrl() {
      return user.coverUrl('small');
    },

    coverColor() {
      return user.coverColor();
    },

    thanks() {
      return user.userThanks();
    },

    userLink() {
      return user.userLink();
    },

    avatarUrl() {
      return user.userAvatarUrl('large');
    },

    hiddenUnlessThanks() {
      if (!(user.thanksCount() > 0)) { return 'hidden'; }
    },
    
    hiddenUnlessDescription() {
      if (!user.description()) { return 'hidden'; }
    },
    
    hiddenUnlessName() {
      if (!user.name()) { return 'hidden'; }
    },

    style() {
      return {
        backgroundImage: `url('${self.coverUrl()}')`,
        backgroundColor: self.coverColor(),
      };
    },
  };
}

export default function UserItem({user}) {
  const style = {
    backgroundImage: `url('${user.coverUrl('small')}')`,
    backgroundColor: self.coverColor,
  };
  return (
    <li>
      <a href={user.userLink}>
        <div className="item" style={style}>
          <div className="content">
            <img className="avatar" src="@avatarUrl" alt="@login"></img>
            <div className="information">
              <h3 className="name @hiddenUnlessName">@name</h3>
              <div className="button"><span>@login</span></div>
              <p className="thanks @hiddenUnlessThanks">@thanks <span className="emoji sparkling_heart"></span></p>
              <p className="description @hiddenUnlessDescription">@truncatedDescription</p>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    userLink: PropTypes.string.isRequired,
  }),
};