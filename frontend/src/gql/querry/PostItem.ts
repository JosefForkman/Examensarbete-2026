import { graphql } from "..";

export const cardFragment = graphql(`
    fragment cardDitals on WebsiteType {
        id
        name
        rssUrl
    }
`);
