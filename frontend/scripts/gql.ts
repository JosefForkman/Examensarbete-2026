import "dotenv/config";
import { execSync } from "child_process";

const backendEndpoint = process.env.BACKEND_HTTPS;

if (!backendEndpoint) {
    console.error("❌ Could not find backendEndpoint!");
    process.exit(1);
}

const GraphQLEndPoint = `${backendEndpoint}/graphql/`;

try {
    console.log("Starting generate .graphql");
    execSync(
        `npx gql-tada generate-schema -o ./schema.graphql ${GraphQLEndPoint}`,
    );

    console.log("Making the graphql ts types");
    execSync("npx gql-tada generate-output");
} catch (error) {
    console.error("❌ Misslyckades med att generera gql-tada filer:", error);
    process.exit(1);
}
