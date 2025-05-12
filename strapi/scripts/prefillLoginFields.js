const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Base directory and target file patterns
const directoryPath =
  "./node_modules/@strapi/admin/dist/admin/admin/src/pages/Auth/components";
const targetFiles = ["Login.js", "Login.mjs"]; // You can add more file patterns here

// Content to replace
const originalContent = `initialValues: {
                                email: '',
                                password: '',
                                rememberMe: false
                            },`;

const newContent = `initialValues: {
                                email: "admin@strapidemo.com",
                                password: "welcomeToStrapi123",
                                rememberMe: false
                            },`;

// Function to update a given file
const updateFile = (filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`❌ Error reading file ${filePath}:`, err);
      return;
    }

    if (data.includes(newContent)) {
      console.log(`✅ File already modified with demo credentials: ${filePath}`);
      return;
    }

    if (data.includes(originalContent)) {
      const updatedData = data.replace(originalContent, newContent);

      fs.writeFile(filePath, updatedData, "utf8", (err) => {
        if (err) {
          console.error(`❌ Error writing to file ${filePath}:`, err);
          return;
        }
        console.log(`✅ Successfully updated: ${filePath}`);
      });
    } else {
      console.log(`⚠️ Original content not found in: ${filePath}`);
    }
  });
};

// Iterate over each file pattern
targetFiles.forEach((pattern) => {
  glob(path.join(directoryPath, pattern), (err, files) => {
    if (err) {
      console.error("❌ Error finding files:", err);
      return;
    }

    if (files.length > 0) {
      files.forEach(updateFile);
    } else {
      console.log(`⚠️ No matching files found for: ${pattern}`);
      process.exit(1);
    }
  });
});
