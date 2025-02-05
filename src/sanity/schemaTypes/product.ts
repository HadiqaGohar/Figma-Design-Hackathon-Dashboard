export default {
    name: "product",
    type: "document",
    title: "Product",
    fields: [
        {
            name: "id",
            type: "number",
            title: "ID",
        },
        {
            name: "image",
            type: "image",
            title: "Image",
        },
        {
            name: "name",
            type: "string",
            title: "Product Name",
        },
        {
            name: "price",
            type: "number",
            title: "Price",
        },
        {
            name: "category",
            type: "array",
            title: "Category",
            of: [{ type: "string" }],
        },
        {
            name: "sale",
            type: "boolean",
            title: "On Sale",
        },
    ],
};