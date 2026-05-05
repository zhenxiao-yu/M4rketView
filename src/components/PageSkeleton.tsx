const PageSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-4">
    <div className="h-8 bg-gray-200/50 rounded-lg w-48" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 bg-gray-200/50 rounded-xl" />
      ))}
    </div>
    <div className="h-64 bg-gray-200/50 rounded-xl" />
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200/50 rounded-lg" />
      ))}
    </div>
  </div>
)

export default PageSkeleton
