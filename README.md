<a href="https://zenhub.com"><img src="https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png"></a>

# mann-wagon
[Locomotive](http://locomotivecms.com) site for Mann Library

### Overview

[Wagon](http://github.com/locomotivecms/wagon) is the command line interface for Locomotive and is where developers will spend most of their time when working locally on a Locomotive site. For a more thorough intro to the Locomotive approach and workflow, please review the [mann-locomotive README](http://github.com/cul-it/mann-locomotive#overview). We'll be here when you get back.

### Prerequisites

* ruby
* bundler
* node
* yarn

### QuickStart

###### Local Dev

1. Clone this repo
   ```sh
   $ git clone git@github.com:cul-it/mann-wagon.git
   ```

1. Install gems
   ```sh
   $ cd <clone>
   $ bundle install
   ```

1. Install modules
   ```sh
   $ yarn
   ```

1. Serve the site

   > proxied through [Browsersync](https://www.browsersync.io) for live-reload goodness -- watching SCSS, JS, templates

   ```sh
   $ yarn start
   ```

1. Visit the Mann website at [http://localhost:3000](http://localhost:3000)

   > default browser should automatically launch and request this URL thanks to Browsersync

### Syncing/Deploying

We'll be using the sample development environment in this example.

  > See official Locomotive documentation for a [guide to installing engine](https://locomotive-v3.readme.io/docs/getting-started-with-locomotive) and more details on available options for [`sync`](https://locomotive-v3.readme.io/docs/synchronize-content) and [`deploy`](https://locomotive-v3.readme.io/docs/deploy) commands.

###### Configure environments in `config/deploy.yml`

1. Copy the example configuration

   ```sh
   $ cp config/deploy.yml.example config/deploy.yml
   ```

1. Edit `host`, `handle`, `email` and `api_key` as applicable for your development environment

###### Sync from a remote Engine

```sh
$ bundle exec wagon sync development -v
```

###### Deploy to a remote Engine

> **IMPORTANT!** Be sure to optimize assets prior to deploying
> ```sh
> $ yarn build
> ```

```sh
$ bundle exec wagon deploy development -v
```

#### Deploy to Production

1. Copy the example configuration

   ```sh
   $ cp config/deploy.yml.example config/deploy.yml
   ```

2. Log in to Locomotive admin interface (https://admin.mannlib.cornell.edu), navigate to the Developers menu option, and copy the Production block that contains the `host`, `handle`, `email` and `api_key`

3. Paste the Production block into your `config/deploy.yml`

> **IMPORTANT!** Be sure to optimize assets prior to deploying
> ```sh
> $ yarn build
> ```

4. To deploy changes to Production environment, run 
```sh
$ bundle exec wagon deploy production
```


### Linting

Via [Javascript Standard Style](https://standardjs.com) and [sass-lint](https://github.com/sasstools/sass-lint)

```sh
$ yarn lint
```
> Or lint JS and Sass separately:
>
>  ```sh
>  $ yarn lint-js
>  $ yarn lint-sass
>  ```
