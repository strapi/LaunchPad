const read_file = {
  name: "read_file",
  description: "Read the content of a specified file path and return, supports txt, md, xlsx, json formats",
  params: {
    type: "object",
    properties: {
      path: {
        description: "The path of the file to read.",
        type: "string"
      }
    },
    required: ["path"]
  },
  getActionDescription({ path }) {
    return path;
  }
};

module.exports = read_file;