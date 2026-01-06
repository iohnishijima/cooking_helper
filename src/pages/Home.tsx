import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">
            🍳 Cooking Helper
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Cooking Helper
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Your ultimate companion for discovering recipes, planning meals, and mastering cooking techniques.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Recipe Collection</h3>
            <p className="text-gray-600">
              Browse through thousands of delicious recipes from around the world.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🗓️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Meal Planning</h3>
            <p className="text-gray-600">
              Plan your weekly meals and generate shopping lists automatically.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cooking Tips</h3>
            <p className="text-gray-600">
              Learn professional cooking techniques and tips to improve your skills.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Cooking?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of home cooks who are improving their culinary skills every day.
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-base sm:text-lg">
            Get Started
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base">
            © 2026 Cooking Helper. Built with React + TypeScript + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
