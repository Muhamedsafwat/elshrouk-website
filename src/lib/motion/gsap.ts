'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function ensureGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP)
  gsap.defaults({ ease: 'power3.out', duration: 0.7 })
  ScrollTrigger.config({ ignoreMobileResize: true })
  registered = true
}

ensureGsap()

export { DrawSVGPlugin, gsap, ScrollTrigger, useGSAP }
