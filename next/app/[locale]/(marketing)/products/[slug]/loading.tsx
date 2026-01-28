export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="aspect-square bg-gray-700 rounded-lg animate-pulse" />

        {/* Details skeleton */}
        <div className="space-y-6">
          <div className="h-10 bg-gray-700 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-700 rounded w-1/4 animate-pulse" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-12 bg-gray-700 rounded w-40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
