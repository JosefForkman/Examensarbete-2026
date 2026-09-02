import { graphql } from "..";

export const cardFragment = graphql(`
    fragment cardDitals on Website {
        id
        siteName
        rssUrl
        createdAt
        imageUrl
    }
`);
