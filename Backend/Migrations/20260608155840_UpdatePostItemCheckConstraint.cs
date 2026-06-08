using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePostItemCheckConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_PostItems_PublicationDate_NotInFuture",
                table: "PostItems");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PostItems_PublicationDate_NotInFuture",
                table: "PostItems",
                sql: "\"PublicationDate\" <= CURRENT_TIMESTAMP");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_PostItems_PublicationDate_NotInFuture",
                table: "PostItems");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PostItems_PublicationDate_NotInFuture",
                table: "PostItems",
                sql: "\"PublicationDate\" <= CURRENT_DATE");
        }
    }
}
