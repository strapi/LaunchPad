export default function Loading() {
  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Title skeleton */}
      <div className="h-12 bg-gray-700 rounded w-3/4 mb-4 animate-pulse" />

      {/* Meta info skeleton */}
      <div className="flex gap-4 mb-8">
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
        <div className="h-4 bg-gray-700 rounded w-32 animate-pulse" />
      </div>

      {/* Featured image skeleton */}
      <div className="aspect-video bg-gray-700 rounded-lg mb-8 animate-pulse" />

      {/* Content skeleton */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-700 rounded animate-pulse"
            style={{ width: `${70 + (i % 4) * 8}%` }}
          />
        ))}
      </div>
    </article>
  );
}
