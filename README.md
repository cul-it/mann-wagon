# mann-wagon
[LocomotiveCMS](http://locomotivecms.com) Wagon site for Mann Library

### Overview

[Wagon](http://github.com/locomotivecms/wagon) is the command line interface for LocomotiveCMS and is where developers will spend most of their time when working on a LocomotiveCMS site. For a more thorough intro to the LocomotiveCMS approach and workflow, please review the [mann-locomotive README](http://github.com/cul-it/mann-locomotive#overview). We'll be here when you get back.

### QuickStart

###### Local Dev

1. Clone this repo
    ```shellsession
$ git clone git@github.com:cul-it/mann-wagon.git
```

1. Install gems
   ```shellsession
$ cd <clone>
$ bundle install
```

1. Serve the site
   ```shellsession
$ bundle exec wagon serve
```

1. Visit the Mann website at [http://localhost:3333](http://localhost:3333)

### Syncing/Deploying

We'll be using dev Engine at http://mannloco-dev.library.cornell.edu as example

###### Configure environments in `config/deploy.yml`

Add `email` and `api_key` for development environment

> **Don't have an api_key?** What about an account on the remote Engine? [Request one](http://mannloco-dev.library.cornell.edu/locomotive/sign_up) and then you'll find your api-key under [account settings](http://mannloco-dev.library.cornell.edu/locomotive/my_account/edit?_location=%2Flocomotive%2Fsites#api).

###### Sync from a remote Engine

```shellsession
$ wagon sync development
```

###### Deploy to a remote Engine

```shellsession
$ wagon deploy development
```
