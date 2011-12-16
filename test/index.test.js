
/*!
  Core Modules
 */

var vows = require('vows'),
    assert = require('assert'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    paginate = require('../lib/mongoose-paginate');

/*!
  Connect to MongoDB with Mongoose
 */

var MongoDB = process.env.MONGO_DB || 'mongodb://localhost/test';

mongoose.connect(MongoDB);

/*!
  Setup
 */

var BlogSchema = new Schema({
  id    : ObjectId,
  title : String,
  entry : String,
  date  : Date
});

var BlogEntry = mongoose.model('BlogEntry', BlogSchema);

function setup(callback){
  var complete = 0;
  for (var i = 1; i < 101; i++) {
    var newEntry = new BlogEntry({
      title : 'Item #'+i,
      entry : 'This is the entry for Item #'+i
    });
    newEntry.save(function(error, result) {
      if (error) {
        console.error(error);
      } else {
        complete++;
        if (complete === 100){
          callback(null, 100);
        }
      }
    });
  };
}

/*!
  Teardown
 */

function teardown(callback){
  var complete = 0;
  BlogEntry.find({}, function(error, results) {
    if (error) {
      callback(error, null);
    } else {
      for (result in results) {
        results[result].remove(function(error) {
          if (error) {
            callback(error, null);
          } else {
            complete++;
            if (complete === 100) {
              callback(null, 100);
            }
          };
        });
      };
    }
  });
};

/*!
  Vows
 */

vows.describe('pagination module basic test')

.addBatch({
  'when requiring `mongoose-paginate`':{
    topic:function(){
      return paginate;
    },
    'there should be no errors and paginate should be an object':function(topic){
      assert.equal(typeof(topic), 'object');
    }
  }
})

.addBatch({
  'when creating 100 dummy documents with our test mongodb string':{
    topic:function(){
      setup(this.callback);
    },
    'there should be no errors and resultCount should be 100':function(error, resultCount){
      assert.equal(error, null);
      assert.equal(resultCount, 100);
    }
  }
})

.addBatch({
  'when deleting all of our 100 dummy documents with our test mongodb string':{
    topic:function(){
      teardown(this.callback);
    },
    'there should be no errors and resultCount should be a number':function(error, resultCount){
      assert.equal(error, null);
      assert.equal(resultCount, 100);
    }
  }
})

.export(module);

/* EOF */