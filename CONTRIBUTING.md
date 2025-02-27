Contributing
------------

Hey, welcome!  This document should give you all the steps you need to make contributions to the Glitch community site. This guide applies to full time makers of Glitch as well as all members of our Glitch community.

Please note we have a [code of conduct](https://glitch.com/edit/#!/community?path=CODE_OF_CONDUCT.md), please follow it in all your interactions with the project and the denizens thereof.

We also having a [style guide](https://glitch.com/edit/#!/community?path=STYLE.md) discussing our coding conventions, styles, and goals.

Mission
--------------------
Anyone in our community can feel welcome and supported in submitting improvements, fixes, and ideas to this Glitch community site.


Philosophy
----------

Our contribution flow is built around a hunger for creative expression. Build things fast, with glitch, and share them.  Here's how:

1. You remix this site, play with it, and show us what you made!  Tweeting [@Glitch](https://twitter.com/glitch) or posting to [our forum](https://support.glitch.com/) are good ways to get our attention.
2. We say something like "We like what you got, good job!"
3. Your changes (or something inspired by your changes) are prepared and make their way to our live production site.

This site is open source. All interactions between this site and Glitch-the-application are using public API endpoints-- there aren't any special privileges or secret endpoints going on.

This site is also young and hungry.  We don't have a public "bug list" and a lot of processes that are best to formalize have yet to be. And this site believes in a Glitchy future-- it is built, maintained, and deployed entirely within Glitch itself.  We're living the Glitchy future of web development, and it's a blast.

Accessible technologies are important to allowing people to contribute.  As we internally work on the code, we'll move incrementally towards ever-stronger documentation for the special pieces of this site and "boring"(easy to learn, perfectly fine) solutions for the standard components.

Behind the scenes, we'll make use of GitHub's Pull Request workflow to incorporate changes into the site. If you're a part of the GitHub community, then feel free to submit pull requests directly-- if you're not,  don't worry about it and just focus on building cool stuff and sharing your ideas.


Contribution Workflow
----------------------

First, remix from [https://glitch.com/~community](https://glitch.com/~community) into, e.g., `my-remix`

Next, make your changes.  When you've got something you like, share it with us (see above), and **you're all set**.

_If you're a core contributor or just really love Git, then read on._

### Pull Request Workflow

Ok cool, these next steps are what we'd do internally and you're welcome to follow them as well if you choose.  Beyond this point, there be 🐉s.

#### First Time Setup

_(Do this once per computer to create a local repository)_

  ```
  # 1. On your local machine, clone our git repository from Github: 
  git clone https://github.com/FogCreek/Glitch-Community

  # 2. Inside of your new repo, add a remote endpoint for our live site:
  cd Glitch-Community
  git remote add live https://api.glitch.com/community/git
  ```
    
#### Creating a Pull Request

_(Do this once per remix/PR)_

We're going to add a branch named after your remix, and set up a remote endpoint pointed at its git repo in glitch.  We're using `my-remix` as a placeholder for your project name.  Swap that out in the scripts below.

In your local repository,
```
  # 1. Add your remix as remote source
  git remote add my-remix https://api.glitch.com/my-remix/git

  # 2. Fetch your remix into a new branch of the same name
  git fetch my-remix master:my-remix
  
  # 3. Switch to your new branch
  git checkout my-remix

  # 4. Push your branch to github
  git push origin my-remix
  
```

Now you can use the GitHub UI to turn your branch into a pull request. 

It's good practice to share a link to your project in the PR and talk about the functional changes you've made.  This allows the reviewers to easily visit your remix to test out your new behavior.

_(Don't have permission to push to github? You'll need to first [Fork](https://blog.scottlowe.org/2015/01/27/using-fork-branch-git-workflow/) our [repository](https://github.com/FogCreek/Glitch-Community) and then [create a pull request from the fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) instead.)_

#### Updating an Existing Pull Request

(Do this when you've made more changes in Glitch that you want to include in the PR.)

In your local repository,
 ```
   # 1. Make sure we're on the right branch
   git checkout my-remix 
   
   # 2. Pull from Glitch into your local branch.
   git pull my-remix master
   
   # 3. Update the PR in Github
   git push origin my-remix
 ``` 

And you're all set.

Keep your PR's small! (Days of work, not weeks.)  This will save you from having to think about and use all of the more advanced git hyjinks to keep your PR in sync with master (not documented here, because there would be _over 9000 🐉_'s. )

_Note: Glitch apps make git commits (we call them checkpoints) every 10 minutes. If you make some quick changes, they may not show up in your diff on the Github pull request. If that is the case, you can either wait several minutes for the checkpoint to be made, or toggle Glitch Rewind on-and-off (which will force a checkpoint)._

### Deployment

Only employees of Fog Creek will be able to do this step, and here it is! 

You should perform these steps immediately after clicking the "Merge pull request" button on your PR in Github. 

As you go through these steps, be present in our team Slack room and communicate as you start and finish the deploy.

#### Merge in Live Changes

We need to make sure any live changes are merged and happy.  This is a Glitch site, after all-- we're not forcing the PR workflow, especially for small changes.

In your local git repository:

```
  # Make sure we're in the right place and up to date.
  git checkout master
  git pull

  # Pull in any live changes that aren't yet in Master:
  git pull live master
  
  # Merge if needed
  # [ This is on you. 🐉 ]
  
  # Then push these changes back up to github
  git push origin master
  
``` 

Ok, now the GitHub repository is updated and stable. 

#### Stage the Deployment

We're going to put our release candidate onto community-staging.glitch.me.

Go to [https://glitch.com/~community-staging](https://glitch.com/~community-staging) and open up the console.
  ```
  git log -1 # Prints out a stable changeset in case we need it.
  git pull # Update us to master.
  
  # That last step should never need to merge.
  # If it does, something went wrong or somebody edited community-staging directly.
  # Ask Jude or Greg for help. 
  
  refresh # Update the Glitch editor with the new files and kick off the build.
  ```

Now open up the logs and wait for the build to finish, then test your stuff.

In particular test anything that you merged with.  Make sure there's no console errors, etc.  If you find a problem, stop here and go back to the PR phase to fix it up.

Satisfied?  Deploy it.

#### Deploy

Run the _special command_ to swap ~community with ~community-staging.

(there's a special endpoint for this, ask us about it and sit beside a team member the first time you use it.   It's the same thing as renaming the two projects, but it does this atomically and without downtime, which you can't do if you rename then manually.)

#### If You Need to Revert the Deploy

Repeat the _special command_ to swap ~community with ~community-staging.

Thereby putting things back the way they were. Now you have time to fix it and try again. 

After you revert, check on if any live changes were made to the site after you deployed and before you reverted. (Are the curated items the same on both ~community and ~community-staging?).  If so, port the curated updates to the reverted page so that the edits are preserved.

#### Making Live Edits

 _Can I just edit ~community directly, since it’s Glitch we’re dealing with here?_
  
Sure thing. All standard caveats and cautions apply.  This is appropriate for updating the curated content, fixing typos, and one-line bug fixes. Our build scripts don't update the live site until the build is healthy and your changes are complete.
