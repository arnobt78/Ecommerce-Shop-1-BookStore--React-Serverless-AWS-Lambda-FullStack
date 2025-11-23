export const DashboardCardSkeleton = () => {
  return (
    <div className="max-w-4xl m-auto p-2 mb-5 border dark:border-slate-700">
      {/* Order Header Skeleton - matches flex justify-between text-sm m-2 font-bold dark:text-slate-200 */}
      <div className="flex justify-between text-sm m-2 font-bold">
        <div className="h-5 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      {/* Product Items Skeleton - typically 1-3 products per order */}
      {Array(2).fill(0).map((_, productIndex) => (
        <div key={productIndex} className="flex flex-wrap justify-between max-w-4xl m-auto p-2 my-5">
          <div className="flex">
            {/* Image Skeleton - matches w-32 rounded, maintaining aspect ratio similar to product images */}
            <div className="w-32 h-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            {/* Text Content Skeleton */}
            <div className="">
              {/* Product Name Skeleton - matches text-lg ml-2 dark:text-slate-200 */}
              <div className="h-6 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ml-2 mb-2"></div>
              {/* Price Skeleton - matches text-lg m-2 dark:text-slate-200 */}
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse m-2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

