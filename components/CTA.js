import Link from "next/link";

const CTA = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 text-center">
      <h2 className="text-4xl font-bold">Start Managing Your Finances Today</h2>
      <p className="mt-4 text-lg">Sign up now and get a free 14-day trial.</p>
      <Link href="/signup">
        <button className="mt-6 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
          Get Started
        </button>
      </Link>
    </section>
  );
};

export default CTA;
