# MB-Calendar

Calendar widget

```
<mb-calendar selected={{someDate}} select="monthSelected" />
```

## Dependencies

Currently relies on momentjs; liquid-fire and a private {{format-time}} helper which goes through I18n.

A simple {{format-time}} helper can be found in the test dummy app, we'll open source mb-utils at some point
once it's cleaned up.

## Development

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
