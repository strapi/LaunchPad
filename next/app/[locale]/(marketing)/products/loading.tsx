export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="h-10 bg-gray-700 rounded w-48 mb-8 animate-pulse" />

      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
