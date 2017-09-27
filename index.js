const _ = {
    reduce: require('lodash.reduce'),
    get: require('lodash.get'),
    merge: require('lodash.merge')
};
const origCreateType = require('mongoose-schema-to-graphql').default;

/**
 * @ignore
 * @typedef {Object} TypeConversions
 * @type {Object.<MongooseType, GraphQLScalarType>}
 * @desc
 * A configuration object for converting Mongoose Types to GraphQL types.
 * 
 * Key-value pairs: <MongooseType, GraphQLScalarType>
 *  - Key – Mongoose Type identifier. (http://mongoosejs.com/docs/api.html#schema_Schema.Types)
 *  - Value – GraphQL type identifier. (http://graphql.org/graphql-js/type/#scalars)
 * 
 * If no matching Mongoose type key is found in the configuration, a default GraphQL type will be used.
 * 
 * Defaults being used could cause unintended side effects in the GraphQL types.
 * Define the conversions explicitly where possible.
 * 

 */

/**
 * A wrapper for `createType` from the 'mongoose-schema-to-graphql' package.
 * 
 * This function accepts the same input configuration object as the `createType` function, as well as the following:
 *  - Sets some common defaults (`exclude: ['__v']`, `class: 'GraphQLObjectType'`)
 *  - Converts types dynamically (using the `extend` property in the configuration object) based on the key-value pairs in `typeConversions`
 * 
 * @param {{name: string, description: string, class: string, schema: Object}} obj - createType configuration object
 * @param {TypeConversions} typeConversions - Object containing key-value type pairs. 
 * @returns {object}
 * 
 * @global
 */
function createType(obj, typeConversions = undefined) {
    let extend = {};
    if (typeConversions) {
        extend = _.reduce(
            obj.schema.paths,
            (extend, value, key) => {
                // Get the Mongoose type identifier from the schema
                const mongooseType = value.instance || _.get(value, 'options.type.name');
                // console.log(mongooseType, typeConversions);

                if (mongooseType === undefined || mongooseType === null) {
                    throw new Error("This doesn't appear to be a proper Mongoose schema.");
                }

                // If the Mongoose type exists in the `typeConversions` object, use the specified GraphQLType.
                if (typeConversions[mongooseType]) {
                    extend[key] = { type: typeConversions[mongooseType] };
                }
                // Otherwise, don't specify a GraphQLType
                return extend;
            },
            {}
        );
    }

    // Set some defaults, as well as the `extend` property.
    const mergedConfig = _.merge(obj, {
        class: 'GraphQLObjectType',
        exclude: ['__v'],
        extend: extend
    });

    // Pass the configuration object to the original `createType` function to create the executable GraphQL type
    const result = origCreateType(mergedConfig);

    // console.log(`${obj.name} merged config: `, JSON.stringify(mergedConfig), null, 2);
    return result;
}

module.exports = exports = createType;
