const steps = [
    { step: "1", title: "Sign Up", description: "Create a free account to get started." },
    { step: "2", title: "Link Accounts", description: "Connect your bank accounts securely." },
    { step: "3", title: "Track & Save", description: "Monitor spending and get AI suggestions." }
  ];
  
  const HowItWorks = () => {
    return (
      <section className="py-16 bg-white text-center">
        <h2 className="text-4xl font-bold">How It Works</h2>
        <div className="mt-10 flex justify-center gap-10">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-blue-600">{step.step}</div>
              <h3 className="text-xl font-semibold mt-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default HowItWorks;
  