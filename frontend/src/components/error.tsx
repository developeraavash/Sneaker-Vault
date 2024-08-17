export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-700 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Page Not Found</p>
        <a href="/" className="text-blue-500 hover:underline">
          Go Back Home
        </a>
      </div>
    </div>
  );
}
