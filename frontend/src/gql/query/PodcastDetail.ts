import { graphql } from "..";

export const postItems = graphql(`
    fragment post on PostItemsConnection {
        nodes {
            id
            title
            description
            link
            imageUrl
            publicationDate
        }
    }
`);

export const websites = graphql(`
    fragment website on WebsitesConnection {
        nodes {
            id
            name
            description
            imageUrl
            rssUrl
        }
    }
`);
