# mongoose-to-gql [![Build Status][travis-image]][travis-url]

[travis-url]: https://travis-ci.org/MLH-KM/mongoose-to-gql
[travis-image]: https://travis-ci.org/MLH-KM/mongoose-to-gql.svg?branch=master

Convert Mongoose Schemas to GraphQLTypes with some reasonable defaults.

This module wraps the [mongoose-schema-to-graphql](https://github.com/sarkistlt/mongoose-schema-to-graphql) module.

```javascript

const createGraphQLType = require('mongoose-to-gql');
const { Date, ObjectId } = require('mongoose').Schema.Types;

let typeConversions = {
    Date: GraphQLDateTime,
    ObjectId: GraphQLID,
    // etc.
}

let graphQLType = createGraphQLType({
    name: 'NurseUnit',
    description: 'NurseUnit',
    schema: model.schema
}, typeConversions);

```

{{>main}}