const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Specify the directory path and the pattern to find the file
const directoryPath = "./node_modules/@strapi/admin/dist/admin/";
const filePattern = "index-*.mjs";

// Function to find and replace the specific content in the file
const updateFile = (filePath) => {
  // Read the file content
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    // Define the original and replacement content
    const originalContent = `initialValues: {
            email: "",
            password: "",
            rememberMe: false
          },`;

    const newContent = `initialValues: {
            email: "admin@strapidemo.com",
            password: "welcomeToStrapi123",
            rememberMe: false
          },`;

    // Check if the content exists and replace it
    if (data.includes(originalContent)) {
      const updatedData = data.replace(originalContent, newContent);

      // Write the updated content back to the file
      fs.writeFile(filePath, updatedData, "utf8", (err) => {
        if (err) {
          console.error(`Error writing to file ${filePath}:`, err);
          return;
        }
        console.log(`Successfully updated the content in file: ${filePath}`);
      });
    } else {
      console.log(`Original content not found in file: ${filePath}`);
    }
  });
};

// Find the file using glob pattern matching
glob(path.join(directoryPath, filePattern), (err, files) => {
  if (err) {
    console.error("Error finding files:", err);
    return;
  }

  // Process the first file found (since index-*.mjs may match multiple files)
  if (files.length > 0) {
    const filePath = files[0];
    updateFile(filePath);
  } else {
    console.log("No matching files found.");
  }
});
