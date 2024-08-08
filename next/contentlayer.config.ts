import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: `blogs/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the blog post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the blog post',
      required: true,
    },
    author: {
      type: 'string',
      required: true,
    },
    authorAvatar: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    image: {
      type: 'string',
      required: true,
    },
    categories: {
      type: 'list',
      of: { type: 'string' },
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.split('/').pop()}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [BlogPost],
})
