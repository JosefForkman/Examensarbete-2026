import { introspection } from "@/graphql-env";
import { initGraphQLTada } from "gql.tada";
import { GraphQLClient } from "graphql-request";

const endpoint = `${process.env.services__backend__https__0}/graphql`;

export const client = (headers?: Headers) =>
    new GraphQLClient(endpoint, {
        headers,
    });

export const graphql = initGraphQLTada<{
    introspection: introspection;
    scalars: {
        DateTime: Date;
        JSON: string;
    };
}>();
