# mongoose-lean-queries

Mongoose plugin to use lean queries by default

## Installation

Install with NPM

```shell
$ npm install @jjavery/mongoose-lean-queries
```

## Example

```javascript
const mongoose = require('mongoose');
const mongooseLeanQueries = require('@jjavery/mongoose-lean-queries');

const schema = new mongoose.Schema({
  field: String
});

// Apply the plugin to a single schema
schema.plugin(mongooseLeanQueries);

// Or apply the plugin to all schemas
mongoose.plugin(mongooseLeanQueries);

const Thing = mongoose.Model('thing', schema);

async function getData(id) {
  const thing1 = await Thing.findById(id);

  // thing1 is a lean pojo with the result of _id.toString() copied to id

  const thing2 = await Thing.findById(id).lean(false);

  // thing2 is a Mongoose Document
}
```

## To Do
* more tests
* option to disable copying \_id to id
* honor schema option id === false

---

Copyright &copy; 2021 James P. Javery [@jjavery](https://github.com/jjavery)
