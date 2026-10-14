import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

export function RichText({ content, className = '' }: { content?: BlocksContent | null; className?: string }) {
  if (!content || !Array.isArray(content) || content.length === 0) return null;
  return (
    <div className={`prose-demo space-y-4 ${className}`}>
      <BlocksRenderer content={content} />
    </div>
  );
}
