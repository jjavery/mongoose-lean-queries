const { assert } = require('chai');
const mongoose = require('mongoose');
const mongooseLeanQueries = require('../src/mongoose-lean-queries');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.set('debug', true);

before(async () => {
  await mongoose.connect(
    'mongodb://localhost:27017/mongoose_lean_queries_test'
  );
});

after(async () => {
  await mongoose.disconnect();
});

it('passes a basic test', async () => {
  const schema = new mongoose.Schema({
    test1: { type: String },
    test2: [
      new mongoose.Schema({
        test3: { type: String }
      })
    ]
  });

  schema.plugin(mongooseLeanQueries);

  const TestModel = mongoose.model('test', schema);

  const { _id } = await TestModel.create({
    test1: 'test4',
    test2: [{ test3: 'test5' }, { test3: 'test6' }, { test3: 'test7' }]
  });

  const test = await TestModel.findById(_id);

  assert.isTrue(isPojo(test));
});

function isPojo(doc) {
  if (doc === null || typeof doc !== 'object') {
    return false;
  }
  return Object.getPrototypeOf(doc) === Object.prototype;
}
