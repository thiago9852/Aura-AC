
try {
    const plugin = require("nativewind/babel");
    console.log("Type of export:", typeof plugin);
    console.log("Is function?", typeof plugin === 'function');

    // If it's a function, call it to see what it returns (mimic babel calling it)
    if (typeof plugin === 'function') {
        try {
            const result = plugin({ cache: () => { } }, {});
            console.log("Result keys:", Object.keys(result));
            if (result.plugins) console.log("Has plugins property: YES");
            else console.log("Has plugins property: NO");

            if (result.visitor) console.log("Has visitor property: YES");
        } catch (e) {
            console.log("Error calling function:", e.message);
        }
    } else {
        console.log("Export keys:", Object.keys(plugin));
    }
} catch (error) {
    console.error(error);
}
