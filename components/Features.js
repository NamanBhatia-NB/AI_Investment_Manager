import { ShieldCheck, BarChart3, DollarSign } from "lucide-react";


const features = [
  { title: "AI Insights", description: "Get smart AI-powered financial recommendations.", icon: BarChart3 },
  { title: "Automated Budgeting", description: "Track your income & expenses effortlessly.", icon: DollarSign },
  { title: "Secure & Private", description: "Your data is encrypted and protected.", icon: ShieldCheck }
];

const Features = () => {
  return (
    <section className="py-16 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold">Why Choose AI Finance Pro?</h2>
      <div className="mt-10 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-md">
            <feature.icon className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
