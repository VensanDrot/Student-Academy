import fs from "fs";
import path from "path";
import handlebars from "handlebars";

/**
 * Loads and compiles `src/emails/templates/<name>.hbs` with the given context.
 */
export const compileTemplate = (name: string, context: Record<string, any>) => {
    // 1) Find the template file
    const filePath = path.resolve(__dirname, "../emails", `${name}.hbs`);
    // 2) Read it in
    const source = fs.readFileSync(filePath, "utf8");
    // 3) Compile with Handlebars
    const template = handlebars.compile(source);
    // 4) Merge with your context data
    return template(context);
};
