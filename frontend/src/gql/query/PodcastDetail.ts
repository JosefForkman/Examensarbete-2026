import { graphql } from "..";

export const postItems = graphql(`
    fragment post on PostItemConnection {
        edges {
            node {
                id
                title
                description
                link
                imageUrl
                publicationDate
            }
        }
    }
`);

export const websites = graphql(`
    fragment website on WebsiteConnection {
        edges {
            node {
                id
                siteName
                description
                imageUrl
                rssUrl
            }
        }
    }
`);
