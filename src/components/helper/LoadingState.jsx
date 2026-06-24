const LoadingState = () => {
  return (
    <div className="flex justify-center items-center gap-x-1.5 min-h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
    </div>
  )
}

export default LoadingState