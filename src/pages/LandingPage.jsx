"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-scroll";
import { useInView } from "react-intersection-observer";
import { Brain, Headphones, Globe, Smartphone, Star } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Particles from "react-tsparticles";
import { tsParticles } from "tsparticles-engine";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const noteVariants = {
    initial: { y: "-100vh", opacity: 0 },
    animate: { y: "100vh", opacity: [0, 1, 1, 0] },
  };
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/emotion-detection");
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-black z-10">
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="note"
            initial="initial"
            animate="animate"
            variants={noteVariants}
            transition={{
              delay: i * 0.5,
              duration: 12,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 2 + 1}rem`,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            ♫
          </motion.div>
        ))}
      </div>

      {/* Navigation Links */}
      <div className="absolute top-10 flex space-x-6 z-10">
        <ul className="flex space-x-8 text-lg font-semibold text-gray-300">
          <li className="hover:text-blue-400 transition-colors duration-300">
            <Link
              to="how-it-works"
              smooth={true}
              duration={50}
              spy={true}
              hashSpy={true}
              className="cursor-pointer"
            >
              How It Works
            </Link>
          </li>
          <li className="hover:text-blue-400 transition-colors duration-300">
            <Link
              to="features"
              smooth={true}
              duration={50}
              spy={true}
              hashSpy={true}
              className="cursor-pointer"
            >
              Features
            </Link>
          </li>
          <li className="hover:text-blue-400 transition-colors duration-300">
            <Link
              to="testimonials"
              smooth={true}
              duration={50}
              spy={true}
              hashSpy={true}
              className="cursor-pointer"
            >
              Testimonials
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-mono"
        >
          F♫CIFY
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="text-2xl mb-8 text-gray-200"
        >
          Where Music Meets Emotion. Tune into Your Mood.
        </motion.p>

        <motion.button
          onClick={handleGetStarted}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full text-lg font-bold shadow-xl hover:from-blue-700 hover:to-purple-800 transition duration-500"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { title: "Facial Scan", image: "src/assets/e.jpg" },
    { title: "Emotion Analysis", image: "src/assets/e1.jpg" },
    { title: "Emotion Detection", image: "src/assets/e2.jpg" },
    { title: "Music Recommendation", image: "src/assets/e3.jpg" },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      steps.forEach((_, index) => {
        controls.start((i) => ({
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          transition: { delay: i * 1, duration: 1 },
        }));
      });
    }
  }, [controls, inView]);

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative z-10"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-5xl font-bold mb-12 text-center text-white">
          How It Works
        </h2>
        <p className="text-center text-lg mb-10 text-gray-300">
          Experience our four-step journey to match music with your emotions.
        </p>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial={{ opacity: 0, scale: 2, x: 0, y: 0 }}
              animate={controls}
              className="bg-gray-800 p-10 rounded-xl text-center shadow-lg hover:shadow-2xl"
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-40 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4 text-gray-100">
                {step.title}
              </h3>
              <p className="text-gray-400">
                Using advanced AI to enhance your music experience.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Emotion Detection",
      icon: <Brain className="w-16 h-16 text-blue-400" />,
    },
    {
      title: "Real-time Recommendations",
      icon: <Headphones className="w-16 h-16 text-green-400" />,
    },
    {
      title: "Personalized Playlists",
      icon: <Globe className="w-16 h-16 text-yellow-400" />,
    },
    {
      title: "Seamless Experience",
      icon: <Smartphone className="w-16 h-16 text-red-400" />,
    },
  ];

  return (
    <section id="features" className="py-20 bg-black relative z-10">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-5xl font-bold mb-12 text-center text-white">
          Explore the Features
        </h2>
        <p className="text-center text-lg mb-10 text-gray-300">
          Discover what makes our platform unique and perfect for every mood.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700 p-10 rounded-xl flex items-center shadow-lg hover:shadow-2xl"
            >
              <div className="mr-6">{feature.icon}</div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  Enhancing your music experience with AI-driven technology.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "John Doe",
      text: "Facify has completely transformed how I listen to music!",
    },
    {
      name: "Jane Smith",
      text: "The emotion detection is spot on. Highly recommended!",
    },
    {
      name: "Mike Johnson",
      text: "I love how the app adapts to my mood. It's like having a personal DJ!",
    },
    {
      name: "Ava Adams",
      text: "I love how the app adapts to my mood. It's like having a personal DJ!",
    },
    {
      name: "Nathalie Cherie",
      text: "I love how the app adapts to my mood. It's like having a personal DJ!",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-b from-gray-900 to-black relative z-10"
    >
      <div className="container mx-auto px-6 lg:px-12 overflow-hidden">
        <h2 className="text-5xl font-bold mb-12 text-center text-white">
          What Our Users Say
        </h2>

        <motion.div
          className="flex space-x-6"
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 50,
          }}
          style={{ display: "flex", width: "max-content" }}
        >
          {/* Duplicate testimonials to create a seamless loop */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800 p-10 rounded-xl shadow-lg text-center hover:shadow-2xl min-w-[300px]"
            >
              <p className="text-gray-300 mb-6">{testimonial.text}</p>
              <p className="text-blue-400 font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black text-white py-12 relative z-10">
    <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <h3 className="text-3xl font-bold relative z-10">Facify</h3>
        <p className="text-gray-400 relative z-10">Your Mood, Your Music</p>
      </div>
      <div className="flex space-x-6">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook
            size={24}
            className="text-gray-400 hover:text-blue-600 transition-colors relative z-10"
          />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter
            size={24}
            className="text-gray-400 hover:text-blue-400 transition-colors relative z-10"
          />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram
            size={24}
            className="text-gray-400 hover:text-pink-500 transition-colors relative z-10"
          />
        </a>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
