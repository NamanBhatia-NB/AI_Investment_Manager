"use client"
import Link from 'next/link'
import React, { useRef, useEffect } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import '../app/globals.css'


const HeroSection = () => {
  const imageRef = useRef();

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      }
      else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [])


  return (
    <div className='pb-20 px-4'>
      <div className='container mx-auto text-center'>
        <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title'>
          Smarter Investment Decisions<br />with AI Assistance
        </h1>
        <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
          Empower your financial journey with an AI-driven assistant that provides actionable insights, and helps you make data-backed decisions for a brighter financial future.
        </p>
        <div className='flex justify-center space-x-4'>
          <Link href="\dashboard">
            <Button size="lg" className='px-8'>
              Get Started
            </Button>
          </Link>

          <Link href="\dashboard">
            <Button size="lg" variant="outline" className='px-8'>
              Demo Video
            </Button>
          </Link>
        </div>
        <div className='hero-image-wrapper'>
          <div className='hero-image' ref={imageRef} >
            <Image src="/banner.jpeg" width={1280} height={720} alt="Dashboard Preview" className='rounded-lg shadow-2xl border mx-auto' priority />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
