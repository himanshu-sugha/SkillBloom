"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Brain,
  Trophy,
  Zap,
  ArrowRight,
  Leaf,
  Star,
  Target,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Brain,
    title: "AI-Personalized Learning",
    description: "Mistral AI creates custom lessons tailored to your goals, pace, and learning style.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Leaf,
    title: "Growth Garden",
    description: "Watch your skills bloom as beautiful plants in your personal learning garden.",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Zap,
    title: "Daily Sprints",
    description: "5-minute challenges that fit into your busy life and keep you growing.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Trophy,
    title: "Achievements & Streaks",
    description: "Stay motivated with gamified progress tracking and milestone rewards.",
    gradient: "from-cyan-500 to-blue-600",
  },
];

const stats = [
  { value: "5 min", label: "Daily Lessons" },
  { value: "∞", label: "Skills to Learn" },
  { value: "AI", label: "Powered" },
  { value: "Free", label: "Forever" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">SkillBloom</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/learn" className="btn-secondary">
              Explore
            </Link>
            <Link href="/garden" className="btn-primary">
              <span className="flex items-center gap-2">
                Start Growing <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[15%] w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 blur-xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 right-[20%] w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 blur-xl"
        />
        <motion.div
          animate={{ y: [-5, 15, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 blur-xl"
        />

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">AI-Powered Learning Revolution</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Plant Today,{" "}
            <span className="text-gradient">Harvest</span>{" "}
            Tomorrow
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-foreground-secondary mb-10 max-w-3xl mx-auto"
          >
            SkillBloom uses AI to create personalized micro-lessons that grow with you.
            Watch your skills bloom like a beautiful garden.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/onboarding" className="btn-primary text-lg px-8 py-4">
              <span className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Plant Your First Seed
              </span>
            </Link>
            <Link href="/learn" className="btn-secondary text-lg px-8 py-4">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Explore Skills
              </span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6">
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-foreground-muted text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How Your Garden <span className="text-gradient">Grows</span>
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Every skill you learn becomes a beautiful plant in your personal garden
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="skill-card group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Learning <span className="text-gradient-warm">Journey</span>
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              From seed to harvest in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Target,
                title: "Plant Your Seed",
                description: "Tell our AI what you want to learn. We'll create a personalized path just for you.",
              },
              {
                step: "02",
                icon: TrendingUp,
                title: "Nurture Daily",
                description: "Complete 5-minute micro-lessons. Watch your skill plants grow with each session.",
              },
              {
                step: "03",
                icon: Star,
                title: "Harvest Knowledge",
                description: "Apply your skills, earn achievements, and see your garden flourish.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card p-8 h-full">
                  <div className="text-6xl font-bold text-green-500/20 mb-4">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-5">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-foreground-secondary">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-purple-500/10" />

            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
              >
                <Leaf className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Start <span className="text-gradient">Growing?</span>
              </h2>
              <p className="text-xl text-foreground-secondary mb-8 max-w-2xl mx-auto">
                Join thousands of learners cultivating their skills with AI-powered micro-lessons.
              </p>

              <Link href="/onboarding" className="btn-primary text-lg px-10 py-5 inline-block">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Plant Your First Seed — It&apos;s Free
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
