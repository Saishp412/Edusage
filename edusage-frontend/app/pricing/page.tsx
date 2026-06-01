"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Star, Brain } from "lucide-react";

export default function Pricing() {
  const router = useRouter();

  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for individual learners",
      features: [
        "5 notebooks",
        "Basic AI assistance",
        "Progress tracking",
        "Community support"
      ],
      color: "from-gray-400 to-gray-600",
      popular: false
    },
    {
      name: "Professional",
      price: "$19",
      period: "per month",
      description: "Most popular for serious learners",
      features: [
        "Unlimited notebooks",
        "Advanced AI tutor",
        "Detailed analytics",
        "Priority support",
        "Custom study plans",
        "AI-powered insights"
      ],
      color: "from-blue-400 to-purple-500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For institutions and teams",
      features: [
        "Everything in Professional",
        "Unlimited users",
        "Custom integrations",
        "Dedicated support",
        "Advanced analytics dashboard",
        "White-label options"
      ],
      color: "from-emerald-400 to-blue-500",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        
        {/* Notebook grid pattern */}
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 200px 200px, 200px 200px',
        }} />
        
        {/* Notebook lines pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(59, 130, 246, 0.5) 0px,
              transparent 1px,
              transparent 24px,
              rgba(59, 130, 246, 0.5) 25px
            )
          `,
          backgroundSize: '100% 25px',
        }} />
        
        {/* Subtle notebook margin line */}
        <div className="absolute left-20 top-0 bottom-0 w-px bg-red-400 opacity-[0.06]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-12 w-12 rounded-lg bg-black flex items-center justify-center text-white">
                  <Brain size={24} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-gray-900">EduSage</span>
                <div className="text-xs text-gray-500 font-medium">AI Learning Platform</div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="px-5 py-2.5 rounded-full bg-transparent hover:bg-white transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
              onClick={() => router.push("/")}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 px-6 pt-32 pb-16">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              <Star size={16} />
              <span>Pricing Plans</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Choose Your Learning Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Select the perfect plan for your educational needs with flexible pricing and powerful AI features
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl border ${
                  plan.popular 
                    ? 'border-blue-400/50 ring-2 ring-blue-400/20 hover:scale-105' 
                    : 'border-gray-200 hover:scale-102'
                } transition-all duration-300 hover:-translate-y-2`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-3">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    className={`w-full h-12 rounded-lg font-bold shadow-lg ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.color} hover:shadow-xl transform hover:-translate-y-1 text-white`
                        : 'border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-900'
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => router.push(plan.name === "Starter" ? "/register" : "/demo")}
                  >
                    {plan.name === "Starter" ? "Get Started Free" : plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I switch plans anytime?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any differences.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Is there a free trial?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! All paid plans come with a 14-day free trial. No credit card required to start your learning journey.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What payment methods do you accept?</h3>
                <p className="text-gray-600 leading-relaxed">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are secure and encrypted.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I cancel anytime?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely. No cancellation fees or long-term commitments. You keep your data until the end of your billing period.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-gray-700 font-medium">30-day money-back guarantee on all plans</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to start your AI-powered learning journey?</h3>
            <Button
              className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 font-medium shadow-lg"
              onClick={() => router.push("/register")}
            >
              Get Started Now
              <ArrowLeft size={18} className="ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
