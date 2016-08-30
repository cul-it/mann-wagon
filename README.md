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

  > proxied through [Browsersync](https://www.browsersync.io) for live-reload goodness -- watching SCSS, JS, templates

   ```bash
$ npm start
```

1. Visit the Mann website at [http://localhost:3000](http://localhost:3000)

  > default browser should automatically launch and request this URL thanks to Browsersync

### Syncing/Deploying

We'll be using the sample development environment in this example.

  > See official Locomotive documentation for a [guide to installing engine](https://locomotive-v3.readme.io/docs/getting-started-with-locomotive) and more details on available options for [`sync`](https://locomotive-v3.readme.io/docs/synchronize-content) and [`deploy`](https://locomotive-v3.readme.io/docs/deploy) commands.

###### Configure environments in `config/deploy.yml`

1. Copy the example configuration

  ```bash
$ cp config/deploy.yml.example config/deploy.yml
```

1. Edit `host`, `handle`, `email` and `api_key` as applicable for your development environment

###### Sync from a remote Engine

```bash
$ bundle exec wagon sync development -v
```

###### Deploy to a remote Engine

```bash
$ bundle exec wagon deploy development -v
```
