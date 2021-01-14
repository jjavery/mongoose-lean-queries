function plugin(schema) {
  schema.pre('find', lean);
  schema.pre('findOne', lean);
  schema.pre('findById', lean);
  schema.pre('findOneAndUpdate', lean);
  schema.pre('findByIdAndUpdate', lean);
  schema.pre('findOneAndRemove', lean);
  schema.pre('findOneAndDelete', lean);

  schema.post('find', leanId);
  schema.post('findOne', leanId);
  schema.post('findById', leanId);
  schema.post('findOneAndUpdate', leanId);
  schema.post('findByIdAndUpdate', leanId);
  schema.post('findOneAndRemove', leanId);
  schema.post('findOneAndDelete', leanId);
}

function lean() {
  if (this._mongooseOptions.lean === false) return;

  this.lean();
}

function leanId(doc) {
  if (!this._mongooseOptions.lean || doc == null) return;

  setId(doc);
}

function setId(doc) {
  if (Array.isArray(doc)) {
    for (const value of doc) {
      if (!isObject(value)) continue;

      if (value._id) {
        value.id = value._id.toString();
      }

      for (const key in value) {
        if (!Array.isArray(value[key])) continue;

        setId(value[key]);
      }
    }
  } else {
    if (!doc) {
      return;
    }

    if (isObjectId(doc)) {
      return doc;
    }

    if (doc._id) {
      doc.id = doc._id.toString();
    }

    for (const key in doc) {
      if (!Array.isArray(doc[key])) continue;

      setId(doc[key]);
    }
  }
}

function isObject(value) {
  return (
    value != null && typeof value === 'object' && Array.isArray(value) === false
  );
}

function isObjectId(id) {
  if (id == null) return false;

  if (
    typeof id === 'object' &&
    'toHexString' in id &&
    typeof id.toHexString === 'function'
  ) {
    if (typeof id.id === 'string') {
      return id.id.length === 12;
    }
    return (
      id.toHexString().length === 24 &&
      checkForHexRegExp.test(id.id.toString('hex'))
    );
  }

  return false;
}

// Regular expression that checks for hex value
const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

module.exports = plugin;
