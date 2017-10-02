## This module has been phased out in favor of [mongoose-graphql](https://github.com/MLH-KM/mongoose-graphql).
This module is a roundabout way of creating a GraphQL object (from a Mongoose schema), which is then converted to a String to be passed into `makeExecutableSchema`. I had some dependency issues trying to add functionality and figured there was a better solution. That solution is the project linked above. It converts a Mongoose Schema straight from JS object into the GraphQL String to be passed into `makeExecutableSchema`, meaning one step in this process is cut out, and there's no circular dependency issue.

# PROCEED WITH CAUTION.

---

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

<a name="createType"></a>

## createType(obj, typeConversions) ⇒ <code>object</code>
A wrapper for `createType` from the 'mongoose-schema-to-graphql' package.

This function accepts the same input configuration object as the `createType` function, as well as the following:
 - Sets some common defaults (`exclude: ['__v']`, `class: 'GraphQLObjectType'`)
 - Converts types dynamically (using the `extend` property in the configuration object) based on the key-value pairs in `typeConversions`

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | createType configuration object |
| typeConversions | <code>TypeConversions</code> | Object containing key-value type pairs. |

