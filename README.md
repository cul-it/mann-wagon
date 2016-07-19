<a href="https://zenhub.com"><img src="https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png"></a>

# mann-wagon
[Locomotive](http://locomotivecms.com) Wagon site for Mann Library

### Overview

[Wagon](http://github.com/locomotivecms/wagon) is the command line interface for Locomotive and is where developers will spend most of their time when working on a Locomotive site. For a more thorough intro to the Locomotive approach and workflow, please review the [mann-locomotive README](http://github.com/cul-it/mann-locomotive#overview). We'll be here when you get back.

### QuickStart

###### Local Dev

1. Clone this repo
    ```bash
$ git clone git@github.com:cul-it/mann-wagon.git
```

1. Install gems
   ```bash
$ cd <clone>
$ bundle install
```

1. Install modules
   ```bash
$ npm install
```

1. Serve the site

  > proxied through [Browsersync](https://www.browsersync.io) for live-reload goodness -- watching styles, JS, templates

   ```bash
$ npm start
```

1. Visit the Mann website at [http://localhost:3000](http://localhost:3000)

### Syncing/Deploying

We'll be using the dev Engine at http://mannloco-dev.library.cornell.edu as an example.

  > See official [Locomotive documentation](https://locomotive-v3.readme.io/docs) for more details on available options for [`sync`](https://locomotive-v3.readme.io/docs/synchronize-content) and [`deploy`](https://locomotive-v3.readme.io/docs/deploy) commands.

###### Configure environments in `config/deploy.yml`

1. Copy the example configuration

  ```bash
$ cp config/deploy.yml.example config/deploy.yml
```

1. Edit `email` and `api_key` for the development environment

  > **Don't have an api_key?** What about an account on the remote Engine? [Request one](http://mannloco-dev.library.cornell.edu/locomotive/sign_up) and then you'll find your api-key under [account settings](http://mannloco-dev.library.cornell.edu/locomotive/my_account/edit?_location=%2Flocomotive%2Fsites#api).

###### Sync from a remote Engine

```bash
$ bundle exec wagon sync development -v
```

###### Deploy to a remote Engine

```bash
$ bundle exec wagon deploy development -v
```
