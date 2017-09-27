const _ = {
    omit: require('lodash.omit'),
    merge: require('lodash.merge'),
    isDate: require('lodash.isdate'),
    isBoolean: require('lodash.isboolean')
};
const createGraphQLType = require('./index.js');
const createType = require('mongoose-schema-to-graphql').default;
const Schema = require('mongoose').Schema;

// Mongoose Types
const CernerBoolean = {
    type: Boolean,
    set: bool => {
        return _.isBoolean(bool) ? bool : bool !== 0;
    }
};

const CernerDate = {
    type: Date,
    set: date => {
        // e.g. '09\/07\/17 11:00:00'
        return _.isDate(date) ? date : moment(date, 'MM/DD/YY HH:mm:ss').toDate();
    }
};

// GraphQL Types
const GraphQLDateTime = require('graphql-iso-date').GraphQLDateTime;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLBoolean = require('graphql').GraphQLBoolean;

const typeConversions = {
    Date: GraphQLDateTime,
    ObjectID: GraphQLID,
    // Custom Mongoose types
    CernerDate: GraphQLDateTime,
    CernerBoolean: GraphQLBoolean
};

const testSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        time: Date,
        cernerDateTest: CernerDate,
        cernerBooleanTest: CernerBoolean
    },
    { timestamps: true }
);

const fullConfig = {
    name: 'TestType',
    description: 'Test type description',
    class: 'GraphQLObjectType',
    schema: testSchema,
    exlude: ['__v'],
    extend: {
        _id: GraphQLID,
        time: GraphQLDateTime,
        cernerDateTest: GraphQLDateTime,
        cernerBooleanTest: GraphQLBoolean
    }
};

const slimConfig = _.omit(fullConfig, ['class', 'exclude', 'extend']);

describe('createGraphQLType', () => {
    test('Types created with original and wrapper match', () => {
        const graphQLTypeUsingFullConfig = createType(fullConfig);
        const graphQLTypeUsingSlimConfig = createGraphQLType(slimConfig, typeConversions);

        expect(graphQLTypeUsingFullConfig).toEqual(graphQLTypeUsingSlimConfig);
    });

    test('Using the full configuration in the wrapper works the same as the slimmed config', () => {
        const graphQLTypeUsingFullConfig = createGraphQLType(fullConfig, typeConversions);
        const graphQLTypeUsingSlimConfig = createGraphQLType(slimConfig, typeConversions);

        expect(graphQLTypeUsingFullConfig).toEqual(graphQLTypeUsingSlimConfig);
    });

    test('An error is thrown if the schema property is not an instance of mongoose.Schema', () => {
        const errorConfig = _.merge({}, slimConfig);
        errorConfig.schema = { stuff: Schema.Types.ObjectId };

        expect(() => {
            createGraphQLType(errorConfig, typeConversions);
        }).toThrow(/`schema` option should be a valid mongoose.Schema instance/);
    });

    test('No errors are thrown if `typeConversions` is not passed', () => {
        const graphQLType1 = createGraphQLType(slimConfig);

        expect(graphQLType1).toBeTruthy();
    });
});
