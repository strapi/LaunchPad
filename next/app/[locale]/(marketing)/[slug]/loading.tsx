export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="h-12 bg-gray-700 rounded w-1/2 mb-8 animate-pulse" />
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-700 rounded animate-pulse"
            style={{ width: `${75 + (i % 3) * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}
