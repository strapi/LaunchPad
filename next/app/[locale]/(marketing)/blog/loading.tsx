export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="h-10 bg-gray-700 rounded w-48 mb-8 animate-pulse" />

      <div className="grid md:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
